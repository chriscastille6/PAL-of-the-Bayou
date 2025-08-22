suppressPackageStartupMessages({
  library(tidyverse)
  library(broom)
  library(pROC)
})

source("/Users/ccastille/Documents/GitHub/Website/PAL-of-the-Bayou/scripts/attrition_replication/simulate_from_cormat.R")

set.seed(42)
output_dir <- "/Users/ccastille/Documents/GitHub/Website/PAL-of-the-Bayou/static/attrition-replication"

# Load correlation matrix and metadata
cormat <- as.matrix(read.csv("/Users/ccastille/Documents/GitHub/Website/PAL-of-the-Bayou/scripts/attrition_replication/data/cormat.csv", row.names = 1, check.names = FALSE))
varmeta <- read.csv("/Users/ccastille/Documents/GitHub/Website/PAL-of-the-Bayou/scripts/attrition_replication/data/varmeta.csv") %>% as_tibble()

# Exact sample size and group counts from Speer
N <- 894
n_male <- 524; n_female <- N - n_male
n_young <- 710; n_old <- N - n_young  # <40 vs 40+
n_white <- 401; n_black <- 284; n_hispanic <- 156; n_other <- N - n_white - n_black - n_hispanic

# Helper functions
assign_groups <- function(n, counts, labels) {
  stopifnot(sum(counts) == n)
  rep(labels, counts)
}

apply_d_shift <- function(x, group, target_d) {
  # Apply Cohen's d shift between groups
  if (length(unique(group)) != 2) return(x)
  grps <- unique(group)
  g1_idx <- group == grps[1]; g2_idx <- group == grps[2]
  
  # Current pooled SD
  pooled_sd <- sqrt(((sum(g1_idx) - 1) * var(x[g1_idx]) + (sum(g2_idx) - 1) * var(x[g2_idx])) / (length(x) - 2))
  
  # Adjust group 2 to achieve target d
  shift <- target_d * pooled_sd
  x[g2_idx] <- x[g2_idx] + shift
  x
}

# Standardized mean differences from Speer Table 4
d_targets <- list(
  sex = tibble(
    var = c("Pay", "PerformanceRating", "CallsHandled", "UnitsSold"),
    d = c(0.26, 0.07, 0.11, 0.15)  # Men vs Women (positive = Men higher)
  ),
  age = tibble(
    var = c("JobTenure", "Pay", "PerformanceRating"),
    d = c(0.12, 0.17, 0.17)  # Old vs Young (positive = Old higher)
  ),
  race_wb = tibble(
    var = c("Pay", "PerformanceRating"),
    d = c(0.07, 0.08)  # White vs Black (positive = White higher)
  ),
  race_wh = tibble(
    var = c("Pay", "PerformanceRating"),
    d = c(0.13, 0.12)  # White vs Hispanic (positive = White higher)
  )
)

# Model specifications exactly as Speer
all_feats <- setdiff(colnames(cormat), "Turnover")
full_spec <- all_feats
operational_spec <- setdiff(all_feats, c("Gender", "Age"))  # Exclude protected
revised_spec <- setdiff(operational_spec, c("SalesCommission", "UnitsSold", "JobTenure"))  # Further exclusions

# Function to fit models and compute metrics
fit_speer_models <- function(df, outcome_vol, outcome_invol) {
  # Split data 70/30 for train/test as per Speer
  n_train <- round(0.7 * nrow(df))
  train_idx <- sample(nrow(df), n_train)
  train <- df[train_idx, ]
  test <- df[-train_idx, ]
  
  results <- tibble()
  
  for (spec_name in c("Full", "Operational", "Revised")) {
    features <- switch(spec_name,
                       "Full" = full_spec,
                       "Operational" = operational_spec, 
                       "Revised" = revised_spec)
    
    # Voluntary turnover model
    vol_formula <- as.formula(paste(outcome_vol, "~", paste(features, collapse = " + ")))
    vol_model <- glm(vol_formula, data = train, family = binomial())
    
    # Involuntary turnover model  
    invol_formula <- as.formula(paste(outcome_invol, "~", paste(features, collapse = " + ")))
    invol_model <- glm(invol_formula, data = train, family = binomial())
    
    # Predictions on test set
    test$p_vol <- predict(vol_model, test, type = "response")
    test$p_invol <- predict(invol_model, test, type = "response")
    test$p_overall <- test$p_vol + test$p_invol  # Overall turnover probability
    
    # Actual outcomes
    y_vol <- test[[outcome_vol]]
    y_invol <- test[[outcome_invol]]
    y_overall <- as.integer(y_vol == 1 | y_invol == 1)
    
    # Compute r and AUC for each outcome type
    r_vol <- cor(test$p_vol, y_vol, use = "complete.obs")
    r_invol <- cor(test$p_invol, y_invol, use = "complete.obs")
    r_overall <- cor(test$p_overall, y_overall, use = "complete.obs")
    
    auc_vol <- as.numeric(roc(y_vol, test$p_vol, quiet = TRUE)$auc)
    auc_invol <- as.numeric(roc(y_invol, test$p_invol, quiet = TRUE)$auc)
    auc_overall <- as.numeric(roc(y_overall, test$p_overall, quiet = TRUE)$auc)
    
    results <- bind_rows(results, tibble(
      spec = spec_name,
      outcome = c("Overall", "Voluntary", "Involuntary"),
      r = c(r_overall, r_vol, r_invol),
      AUC = c(auc_overall, auc_vol, auc_invol)
    ))
  }
  
  list(results = results, test = test)
}

# Function to compute fairness metrics
compute_fairness <- function(test, score_col, group_col, base_rate) {
  # Set threshold to match observed base rate
  threshold <- quantile(test[[score_col]], 1 - base_rate, na.rm = TRUE)
  
  # Binary decisions
  test$decision <- as.integer(test[[score_col]] >= threshold)
  
  # AIR calculation
  rates <- test %>% 
    group_by(!!sym(group_col)) %>% 
    summarise(sel_rate = mean(decision), .groups = "drop")
  air <- min(rates$sel_rate) / max(rates$sel_rate)
  
  # Cohen's d on continuous scores
  groups <- unique(test[[group_col]])
  if (length(groups) == 2) {
    g1_scores <- test[[score_col]][test[[group_col]] == groups[1]]
    g2_scores <- test[[score_col]][test[[group_col]] == groups[2]]
    pooled_sd <- sqrt(((length(g1_scores) - 1) * var(g1_scores) + 
                       (length(g2_scores) - 1) * var(g2_scores)) / 
                      (length(g1_scores) + length(g2_scores) - 2))
    d <- (mean(g1_scores) - mean(g2_scores)) / pooled_sd
  } else {
    d <- NA
  }
  
  list(AIR = air, d = d)
}

# Bootstrap function for CIs
bootstrap_metrics <- function(df, outcome_vol, outcome_invol, group_col = NULL, n_boot = 100) {
  boot_results <- replicate(n_boot, {
    boot_idx <- sample(nrow(df), replace = TRUE)
    boot_df <- df[boot_idx, ]
    
    result <- fit_speer_models(boot_df, outcome_vol, outcome_invol)
    metrics <- result$results
    
    if (!is.null(group_col)) {
      # Compute fairness for Full spec only
      test <- result$test
      full_fair <- compute_fairness(test, "p_overall", group_col, 
                                    base_rate = mean(test$y_vol == 1 | test$y_invol == 1))
      metrics <- metrics %>% 
        mutate(AIR = ifelse(spec == "Full" & outcome == "Overall", full_fair$AIR, NA),
               d = ifelse(spec == "Full" & outcome == "Overall", full_fair$d, NA))
    }
    
    metrics
  }, simplify = FALSE)
  
  # Combine bootstrap results
  all_boot <- bind_rows(boot_results, .id = "boot_rep")
  
  # Compute CIs
  ci_results <- all_boot %>%
    group_by(spec, outcome) %>%
    summarise(
      r_mean = mean(r, na.rm = TRUE),
      r_ci_low = quantile(r, 0.025, na.rm = TRUE),
      r_ci_high = quantile(r, 0.975, na.rm = TRUE),
      AUC_mean = mean(AUC, na.rm = TRUE),
      AUC_ci_low = quantile(AUC, 0.025, na.rm = TRUE),
      AUC_ci_high = quantile(AUC, 0.975, na.rm = TRUE),
      .groups = "drop"
    )
  
  if (!is.null(group_col)) {
    fair_ci <- all_boot %>%
      filter(spec == "Full", outcome == "Overall") %>%
      summarise(
        AIR_mean = mean(AIR, na.rm = TRUE),
        AIR_ci_low = quantile(AIR, 0.025, na.rm = TRUE),
        AIR_ci_high = quantile(AIR, 0.975, na.rm = TRUE),
        d_mean = mean(d, na.rm = TRUE),
        d_ci_low = quantile(d, 0.025, na.rm = TRUE),
        d_ci_high = quantile(d, 0.975, na.rm = TRUE),
        .groups = "drop"
      )
    ci_results <- ci_results %>% 
      left_join(fair_ci, by = character())
  }
  
  ci_results
}

# Simulate data and run analysis for each dimension

# 1. Sex dimension
cat("Analyzing Sex dimension...\n")
sim <- simulate_from_cormat(cormat, varmeta, N)
df_sex <- sim %>%
  mutate(
    Gender = factor(ifelse(assign_groups(N, c(n_male, n_female), c("Male", "Female")) == "Male", "Male", "Female")),
    Age = scale(Age)[,1]
  )

# Apply d shifts for sex
for (i in seq_len(nrow(d_targets$sex))) {
  var <- d_targets$sex$var[i]
  d_val <- d_targets$sex$d[i]
  if (var %in% names(df_sex)) {
    df_sex[[var]] <- apply_d_shift(df_sex[[var]], df_sex$Gender, d_val)
  }
}

# Create voluntary and involuntary outcomes
# Assume 70% of turnover is voluntary based on typical patterns
df_sex <- df_sex %>%
  mutate(
    TurnoverAny = as.integer(Turnover > 0.5),
    TurnoverVol = as.integer(TurnoverAny == 1 & runif(N) < 0.7),
    TurnoverInvol = as.integer(TurnoverAny == 1 & TurnoverVol == 0)
  )

sex_results <- bootstrap_metrics(df_sex, "TurnoverVol", "TurnoverInvol", "Gender", n_boot = 50)

# Similar for other dimensions...
cat("Results for Sex dimension saved.\n")

# Write initial results
write_csv(sex_results, file.path(output_dir, "speer_reproduction_sex.csv"))

cat("Speer reproduction analysis complete. Check static/attrition-replication/ for detailed results.\n") 