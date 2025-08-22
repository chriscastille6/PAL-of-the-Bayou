suppressPackageStartupMessages({
  library(tidyverse)
  library(tidymodels)
  library(ranger)
  library(yardstick)
  library(MASS)
})

# Set working directory and paths
script_dir <- "/Users/ccastille/Documents/GitHub/Website/PAL-of-the-Bayou/scripts/attrition_replication"
project_root <- "/Users/ccastille/Documents/GitHub/Website/PAL-of-the-Bayou"
source(file.path(script_dir, "utils.R"))

set.seed(123)
output_dir <- file.path(project_root, "static/attrition-replication")

# 1) Load and simulate data using correlation matrix approach
cormat_path <- file.path(script_dir, "data/cormat.csv")
varmeta_path <- file.path(script_dir, "data/varmeta.csv")

if (file.exists(cormat_path) && file.exists(varmeta_path)) {
  source(file.path(script_dir, "simulate_from_cormat.R"))
  cormat <- as.matrix(read.csv(cormat_path, row.names = 1, check.names = FALSE))
  varmeta <- read.csv(varmeta_path) %>% as_tibble()
  sim <- simulate_from_cormat(cormat, varmeta, 3000)
  
  # Map to our HR schema
  employees <- tibble(
    employee_id = sprintf("E%05d", 1:3000),
    hire_date = sample(seq(as.Date("2022-01-01") - 365, as.Date("2022-01-01") + 365, by = "day"), 3000, replace = TRUE),
    job_level = if ("job_level" %in% names(sim)) as.integer(sim$job_level) else sample(1:6, 3000, replace = TRUE),
    job_family = if ("job_family" %in% names(sim)) as.character(sim$job_family) else sample(c("Ops","Sales","Eng","HR","Fin","CS"), 3000, replace = TRUE),
    location = if ("location" %in% names(sim)) as.character(sim$location) else sample(c("US","EU","APAC"), 3000, replace = TRUE),
    sex = if ("Gender" %in% names(sim)) as.character(ifelse(sim$Gender > 0.5, "M", "F")) else sample(c("F","M"), 3000, replace = TRUE),
    age_band = if ("Age" %in% names(sim)) cut(sim$Age, breaks = c(0,30,40,50,Inf), labels = c("<30","30-39","40-49","50+"), right = FALSE) else sample(c("<30","30-39","40-49","50+"), 3000, replace = TRUE, prob = c(0.35,0.35,0.2,0.1)),
    base_pay = if ("Pay" %in% names(sim)) as.numeric(sim$Pay) else round(rlnorm(3000, meanlog = 11, sdlog = 0.3)),
    performance = if ("PerformanceRating" %in% names(sim)) pmin(5, pmax(1, as.integer(round(sim$PerformanceRating)))) else sample(1:5, 3000, replace = TRUE, prob = c(0.05,0.2,0.5,0.2,0.05))
  )
} else {
  # Fallback to simple simulation
  employees <- tibble(
    employee_id = sprintf("E%05d", 1:3000),
    hire_date = sample(seq(as.Date("2022-01-01") - 365, as.Date("2022-01-01") + 365, by = "day"), 3000, replace = TRUE),
    job_level = sample(1:6, 3000, replace = TRUE),
    job_family = sample(c("Ops","Sales","Eng","HR","Fin","CS"), 3000, replace = TRUE),
    location = sample(c("US","EU","APAC"), 3000, replace = TRUE),
    sex = sample(c("F","M"), 3000, replace = TRUE),
    age_band = sample(c("<30","30-39","40-49","50+"), 3000, replace = TRUE, prob = c(0.35,0.35,0.2,0.1)),
    base_pay = round(rlnorm(3000, meanlog = 11, sdlog = 0.3)),
    performance = sample(1:5, 3000, replace = TRUE, prob = c(0.05,0.2,0.5,0.2,0.05))
  )
}

# 2) Simulate attrition events
tenure_years <- pmax(0.1, rlnorm(3000, meanlog = 0.5, sdlog = 0.6))
attrition_prob <- pmax(0.01, pmin(0.4, 0.25 + rnorm(3000, 0, 0.1) - 0.05 * log(tenure_years)))
voluntary_flags <- rbinom(3000, 1, attrition_prob)
term_dates <- employees$hire_date + round(tenure_years * 365)
term_dates[voluntary_flags == 0] <- NA

hr <- employees %>%
  mutate(
    termination_date = term_dates,
    voluntary = voluntary_flags
  )

# 3) Create monthly snapshots
snapshots <- tibble(snapshot_date = seq(as.Date("2023-01-01"), as.Date("2024-12-31") - 180, by = "month")) %>%
  crossing(hr %>% dplyr::select(employee_id, hire_date, job_level, job_family, location, sex, age_band, base_pay, performance, termination_date, voluntary)) %>%
  filter(hire_date <= snapshot_date) %>%
  mutate(active = is.na(termination_date) | termination_date > snapshot_date) %>%
  filter(active)

# Feature engineering
snapshots <- snapshots %>%
  mutate(
    horizon_end = snapshot_date + 180,
    attrit_6m = if_else(!is.na(termination_date) & voluntary == 1 & termination_date <= horizon_end, 1L, 0L),
    tenure_days = as.integer(snapshot_date - hire_date),
    tenure_years = tenure_days / 365,
    compa_ratio = base_pay / median(base_pay, na.rm = TRUE),
    season_q = quarter(snapshot_date),
    is_jan = month(snapshot_date) == 1L
  )

# 4) Train-test split
snapshots <- snapshots %>% arrange(snapshot_date)
cutoff <- as.Date("2024-06-01")
train <- snapshots %>% filter(snapshot_date < cutoff) %>% 
  mutate(attrit_6m = factor(attrit_6m, levels = c(0,1), labels = c("Stay", "Leave")))
test <- snapshots %>% filter(snapshot_date >= cutoff) %>% 
  mutate(attrit_6m = factor(attrit_6m, levels = c(0,1), labels = c("Stay", "Leave")))

cat("Train size:", nrow(train), "Test size:", nrow(test), "\n")
cat("Train attrition rate:", mean(train$attrit_6m == "Leave"), "\n")
cat("Test attrition rate:", mean(test$attrit_6m == "Leave"), "\n")

# 5) Build model
rec <- recipe(attrit_6m ~ job_level + job_family + location + sex + age_band + performance + tenure_years + compa_ratio + season_q + is_jan, data = train) %>%
  step_mutate(is_jan = as.numeric(is_jan)) %>%
  step_impute_median(all_numeric_predictors()) %>%
  step_impute_mode(all_nominal_predictors()) %>%
  step_other(all_nominal_predictors(), threshold = 0.01) %>%
  step_dummy(all_nominal_predictors())

# Random Forest model
rf_spec <- rand_forest(mtry = 5, min_n = 10, trees = 500) %>% 
  set_engine("ranger", probability = TRUE) %>% 
  set_mode("classification")

wf_rf <- workflow(rec, rf_spec)
final_rf <- fit(wf_rf, data = train)

# 6) Generate predictions
test_pred <- predict(final_rf, test, type = "prob") %>%
  bind_cols(predict(final_rf, test, type = "class")) %>%
  bind_cols(test %>% dplyr::select(attrit_6m)) %>%
  rename(pred_prob_stay = .pred_Stay, 
         pred_prob_leave = .pred_Leave,
         pred_class = .pred_class,
         actual = attrit_6m)

# 7) Generate confusion matrices at different thresholds
thresholds <- c(0.1, 0.2, 0.3, 0.4, 0.5)

confusion_results <- map_dfr(thresholds, function(thresh) {
  # Apply threshold to predictions
  pred_at_thresh <- if_else(test_pred$pred_prob_leave >= thresh, "Leave", "Stay") %>%
    factor(levels = c("Stay", "Leave"))
  
  # Create confusion matrix
  cm <- table(Predicted = pred_at_thresh, Actual = test_pred$actual)
  
  # Extract values
  tn <- cm[1,1]  # True Negative (Stay/Stay)
  fp <- cm[2,1]  # False Positive (Leave/Stay) 
  fn <- cm[1,2]  # False Negative (Stay/Leave)
  tp <- cm[2,2]  # True Positive (Leave/Leave)
  
  # Calculate metrics
  accuracy <- (tp + tn) / (tp + tn + fp + fn)
  precision <- tp / (tp + fp)
  recall <- tp / (tp + fn)
  specificity <- tn / (tn + fp)
  f1 <- 2 * (precision * recall) / (precision + recall)
  
  # Return results
  tibble(
    threshold = thresh,
    true_negative = tn,
    false_positive = fp,
    false_negative = fn,
    true_positive = tp,
    accuracy = accuracy,
    precision = precision,
    recall = recall,
    specificity = specificity,
    f1_score = f1
  )
})

# 8) Default confusion matrix (0.5 threshold)
default_cm <- table(Predicted = test_pred$pred_class, Actual = test_pred$actual)
cat("\n=== CONFUSION MATRIX (Default 0.5 Threshold) ===\n")
print(default_cm)

# 9) Performance summary
cat("\n=== MODEL PERFORMANCE SUMMARY ===\n")
auc_score <- roc_auc(test_pred, actual, pred_prob_leave)$.estimate
cat("ROC-AUC:", round(auc_score, 3), "\n")
cat("Overall Accuracy:", round(mean(test_pred$pred_class == test_pred$actual), 3), "\n")

# 10) Save results
write_csv(confusion_results, file.path(output_dir, "confusion_matrix_thresholds.csv"))
write_csv(test_pred, file.path(output_dir, "model_predictions.csv"))

# Create detailed confusion matrix table
cat("\n=== CONFUSION MATRICES BY THRESHOLD ===\n")
for (i in seq_len(nrow(confusion_results))) {
  row <- confusion_results[i, ]
  cat(sprintf("\nThreshold: %.1f\n", row$threshold))
  cat(sprintf("           Predicted\n"))
  cat(sprintf("Actual     Stay  Leave\n"))
  cat(sprintf("Stay       %4d   %4d\n", row$true_negative, row$false_positive))
  cat(sprintf("Leave      %4d   %4d\n", row$false_negative, row$true_positive))
  cat(sprintf("Accuracy: %.3f | Precision: %.3f | Recall: %.3f | F1: %.3f\n", 
              row$accuracy, row$precision, row$recall, row$f1_score))
}

cat("\nResults saved to:", output_dir, "\n")
cat("- confusion_matrix_thresholds.csv\n")
cat("- model_predictions.csv\n") 