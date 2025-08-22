suppressPackageStartupMessages({
  library(tidyverse)
  library(broom)
  library(pROC)
})

source("/Users/ccastille/Documents/GitHub/Website/PAL-of-the-Bayou/scripts/attrition_replication/simulate_from_cormat.R")

set.seed(42)
project_root <- normalizePath(".")
output_dir <- file.path(project_root, "PAL-of-the-Bayou/static/attrition-replication")
dir.create(output_dir, showWarnings = FALSE, recursive = TRUE)

# Load correlation matrix and variable meta
cormat <- as.matrix(read.csv(file.path(project_root, "PAL-of-the-Bayou/scripts/attrition_replication/data/cormat.csv"), row.names = 1, check.names = FALSE))
varmeta <- read.csv(file.path(project_root, "PAL-of-the-Bayou/scripts/attrition_replication/data/varmeta.csv")) %>% as_tibble()

N <- 894
sim <- simulate_from_cormat(cormat, varmeta, N)
# Make Turnover binary outcome
y <- as.integer(sim$Turnover > 0.5)
X <- dplyr::select(as_tibble(sim), -Turnover)

# Helper: add group labels by exact counts
assign_groups <- function(n, counts, labels) {
  stopifnot(sum(counts) == n)
  factor(rep(labels, counts))
}

# Helper: enforce standardized mean difference d between two groups for a given variable
# shifts are applied to keep overall mean near original
apply_d_shift <- function(vec, g, d_target) {
  # standardize to sd=1 first
  s <- sd(vec); if (is.na(s) || s == 0) return(vec)
  z <- (vec - mean(vec)) / s
  g <- droplevels(g)
  lv <- levels(g); if (length(lv) != 2) stop("g must be binary factor")
  n1 <- sum(g == lv[1]); n2 <- sum(g == lv[2]); n <- n1 + n2
  shift1 <-  d_target * (n2 / n)
  shift2 <- -d_target * (n1 / n)
  z[g == lv[1]] <- z[g == lv[1]] + shift1
  z[g == lv[2]] <- z[g == lv[2]] + shift2
  # return on original scale
  z * s + mean(vec)
}

# Modeling specs
fit_and_eval <- function(df, outcome, features_full, protected_vars, revised_drop) {
  set.seed(1)
  idx <- sample(seq_len(nrow(df)), size = floor(0.3 * nrow(df)))
  test <- df[idx, ]; train <- df[-idx, ]
  # Full
  m_full <- glm(as.formula(paste(outcome, "~", paste(features_full, collapse = "+"))), data = train, family = binomial())
  s_full <- predict(m_full, newdata = test, type = "response")
  r_full <- cor(s_full, test[[outcome]])
  auc_full <- as.numeric(pROC::roc(test[[outcome]], s_full, quiet = TRUE)$auc)
  # Operational (exclude protected)
  feat_op <- setdiff(features_full, protected_vars)
  m_op <- glm(as.formula(paste(outcome, "~", paste(feat_op, collapse = "+"))), data = train, family = binomial())
  s_op <- predict(m_op, newdata = test, type = "response")
  r_op <- cor(s_op, test[[outcome]])
  auc_op <- as.numeric(pROC::roc(test[[outcome]], s_op, quiet = TRUE)$auc)
  # Revised (drop listed)
  feat_rev <- setdiff(feat_op, revised_drop)
  m_rev <- glm(as.formula(paste(outcome, "~", paste(feat_rev, collapse = "+"))), data = train, family = binomial())
  s_rev <- predict(m_rev, newdata = test, type = "response")
  r_rev <- cor(s_rev, test[[outcome]])
  auc_rev <- as.numeric(pROC::roc(test[[outcome]], s_rev, quiet = TRUE)$auc)
  tibble(spec = c("Full","Operational","Revised"), r = c(r_full, r_op, r_rev), AUC = c(auc_full, auc_op, auc_rev),
         score_full = list(s_full), score_op = list(s_op), score_rev = list(s_rev), test = list(test))
}

# Fairness metrics (for a given score)
air_and_d <- function(test_df, score, group_var, cutoff = 0.5) {
  g <- test_df[[group_var]]
  pred <- as.numeric(score >= cutoff)
  # AIR: min/max selection rate by group
  rates <- tapply(pred, g, mean)
  air <- min(rates) / max(rates)
  # d: standardized difference in scores (group1 - group2)
  lv <- levels(g); if (length(lv) != 2) return(tibble(AIR = air, d = NA_real_))
  s1 <- score[g == lv[1]]; s2 <- score[g == lv[2]]
  sp <- sqrt(((length(s1)-1)*var(s1) + (length(s2)-1)*var(s2)) / (length(s1)+length(s2)-2))
  d <- (mean(s1) - mean(s2)) / sp
  tibble(AIR = air, d = d)
}

# Bootstrap CI helper
boot_ci <- function(values, conf = 0.95) {
  qs <- quantile(values, probs = c((1-conf)/2, 1-(1-conf)/2), na.rm = TRUE)
  c(lo = unname(qs[1]), hi = unname(qs[2]))
}

# Table 4 d targets (by dimension)
d_targets <- list(
  sex = tribble(~var, ~d,
                "JobTenure", 0.19,
                "InternalCandidate", 0.13,
                "SupervisorChange", 0.12,
                "Pay", 0.15,
                "SalesCommission", 0.28,
                "UnitsSold", 0.27,
                "SalesEfficiency", 0.14,
                "PerformanceRating", 0.07),
  age = tribble(~var, ~d,
                "EducationLevel", -0.13,
                "Pay", -0.09,
                "PayChange", -0.17,
                "UnitsSold", -0.03,
                "SalesEfficiency", 0.09,
                "PerformanceRating", -0.08),
  race_wb = tribble(~var, ~d,
                    "JobTenure", -0.11,
                    "InternalCandidate", -0.14,
                    "EducationLevel", 0.08,
                    "SupervisorChange", -0.14,
                    "Pay", 0.17,
                    "PayChange", 0.06,
                    "SalesCommission", 0.18,
                    "FirstCallResolution", 0.16,
                    "CallsHandled", -0.14,
                    "CustomerSatisfaction", 0.12,
                    "UnitsSold", -0.14,
                    "SalesEfficiency", -0.23,
                    "PerformanceRating", 0.17),
  race_wh = tribble(~var, ~d,
                    "JobTenure", -0.46,
                    "DepartmentChange", -0.36,
                    "EducationLevel", 0.41,
                    "SupervisorChange", -0.48,
                    "Pay", -0.21,
                    "PayChange", -0.19,
                    "SalesCommission", 0.18,
                    "FirstCallResolution", -0.31,
                    "CallsHandled", -0.10,
                    "CustomerSatisfaction", 0.07,
                    "UnitsSold", -0.23,
                    "SalesEfficiency", -0.33,
                    "PerformanceRating", 0.07)
)

# Common features in our schema
all_feats <- colnames(X)
protected <- c("Gender","Age") # Race not in cormat; we’ll use group labels separately
revised_drop <- c("SalesCommission","UnitsSold","JobTenure")

results <- list()

# Dimension: Sex (Men vs Women)
{
  df <- X %>% mutate(Gender = ifelse(runif(N) < (524/894), 1, 0), Age = scale(Age)[,1]) %>% mutate(Gender = factor(ifelse(Gender==1, "Men","Women")))
  # Apply d shifts for sex
  for (row in seq_len(nrow(d_targets$sex))) {
    v <- d_targets$sex$var[row]; dval <- d_targets$sex$d[row]
    if (v %in% names(df)) df[[v]] <- apply_d_shift(df[[v]], df$Gender, dval)
  }
  df$Turnover <- y
  res <- fit_and_eval(df, outcome = "Turnover", features_full = all_feats, protected_vars = c("Gender","Age"), revised_drop = revised_drop)
  # Fairness metrics by Gender using Full scores
  test <- res$test[[1]]; s_full <- res$score_full[[1]]
  fair <- air_and_d(test, s_full, group_var = "Gender", cutoff = 0.5)
  write_csv(bind_cols(tibble(dimension = "Sex"), res %>% dplyr::select(spec, r, AUC), fair), file.path(output_dir, "sex_table23.csv"))
  results$sex <- list(res = res, fair = fair)
}

# Dimension: Age (Young vs Old) using bands per Speer (<40 vs 40+)
{
  df <- X %>% mutate(AgeBand = factor(ifelse(runif(N) < (710/894), "Young","Old")), Gender = factor(ifelse(runif(N)<0.5, "Men","Women")))
  for (row in seq_len(nrow(d_targets$age))) {
    v <- d_targets$age$var[row]; dval <- d_targets$age$d[row]
    if (v %in% names(df)) df[[v]] <- apply_d_shift(df[[v]], df$AgeBand, dval)
  }
  df$Turnover <- y
  res <- fit_and_eval(dplyr::select(df, -Age), outcome = "Turnover", features_full = setdiff(all_feats, "Age"), protected_vars = c("AgeBand"), revised_drop = revised_drop)
  test <- res$test[[1]]; s_full <- res$score_full[[1]]
  fair <- air_and_d(test, s_full, group_var = "AgeBand", cutoff = 0.5)
  write_csv(bind_cols(tibble(dimension = "Age"), res %>% dplyr::select(spec, r, AUC), fair), file.path(output_dir, "age_table23.csv"))
  results$age <- list(res = res, fair = fair)
}

# Dimension: Race (White vs Black; White vs Hispanic) – create race factors with exact counts
{
  race <- factor(c(rep("White",401), rep("Black",284), rep("Hispanic",156), rep("Other", N-401-284-156)))
  df0 <- X
  # WB
  df <- df0
df$RaceWB <- factor(ifelse(race %in% c("White","Black"), as.character(race), NA))
keep_wb <- !is.na(df$RaceWB)
df <- df[keep_wb, ]
y_wb <- y[keep_wb]
  for (row in seq_len(nrow(d_targets$race_wb))) {
    v <- d_targets$race_wb$var[row]; dval <- d_targets$race_wb$d[row]
    if (v %in% names(df)) df[[v]] <- apply_d_shift(df[[v]], df$RaceWB, dval)
  }
  df$Turnover <- y_wb
  res <- fit_and_eval(df, outcome = "Turnover", features_full = all_feats, protected_vars = c("Gender","Age","RaceWB"), revised_drop = revised_drop)
  test <- res$test[[1]]; s_full <- res$score_full[[1]]
  fair <- air_and_d(test, s_full, group_var = "RaceWB", cutoff = 0.5)
  write_csv(bind_cols(tibble(dimension = "White-Black"), res %>% dplyr::select(spec, r, AUC), fair), file.path(output_dir, "race_wb_table23.csv"))
  results$race_wb <- list(res = res, fair = fair)
  # WH
  df <- df0
df$RaceWH <- factor(ifelse(race %in% c("White","Hispanic"), ifelse(race=="Hispanic","Hispanic","White"), NA))
keep_wh <- !is.na(df$RaceWH)
df <- df[keep_wh, ]
y_wh <- y[keep_wh]
  for (row in seq_len(nrow(d_targets$race_wh))) {
    v <- d_targets$race_wh$var[row]; dval <- d_targets$race_wh$d[row]
    if (v %in% names(df)) df[[v]] <- apply_d_shift(df[[v]], df$RaceWH, dval)
  }
  df$Turnover <- y_wh
  res <- fit_and_eval(df, outcome = "Turnover", features_full = all_feats, protected_vars = c("Gender","Age","RaceWH"), revised_drop = revised_drop)
  test <- res$test[[1]]; s_full <- res$score_full[[1]]
  fair <- air_and_d(test, s_full, group_var = "RaceWH", cutoff = 0.5)
  write_csv(bind_cols(tibble(dimension = "White-Hispanic"), res %>% dplyr::select(spec, r, AUC), fair), file.path(output_dir, "race_wh_table23.csv"))
  results$race_wh <- list(res = res, fair = fair)
}

cat("Saved: sex_table23.csv, age_table23.csv, race_wb_table23.csv, race_wh_table23.csv in ", output_dir, "\n") 