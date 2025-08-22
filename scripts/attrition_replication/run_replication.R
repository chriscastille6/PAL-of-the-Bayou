suppressPackageStartupMessages({
  library(tidyverse)
  library(lubridate)
  library(tidymodels)
  library(ranger)
  library(xgboost)
  library(survival)
  library(glue)
})

# Resolve script directory and project root
args <- commandArgs(trailingOnly = FALSE)
script_path <- sub("^--file=", "", args[grep("--file=", args)])
if (length(script_path) == 0) {
  script_path <- normalizePath(sys.frames()[[1]]$ofile)
}
script_dir <- dirname(script_path)
project_root <- normalizePath(file.path(script_dir, "../../"))
source(file.path(script_dir, "utils.R"))

# Ensure packages
ensure_packages(c("tidyverse","lubridate","tidymodels","ranger","xgboost","survival","glue","MASS","pdftools"))

set.seed(123)
output_dir <- file.path(project_root, "static/attrition-replication")
dir.create(output_dir, showWarnings = FALSE, recursive = TRUE)

# 1) Data source: try correlation matrix if present, else synthetic baseline
# Attempt to load a cormat and varmeta
cormat_path <- file.path(project_root, "scripts/attrition_replication/data/cormat.csv")
varmeta_path <- file.path(project_root, "scripts/attrition_replication/data/varmeta.csv")
use_cormat <- file.exists(cormat_path) && file.exists(varmeta_path)

n <- 3000
start_date <- as.Date("2022-01-01")
end_date   <- as.Date("2024-12-31")

if (use_cormat) {
  source(file.path(script_dir, "simulate_from_cormat.R"))
  cormat <- as.matrix(read.csv(cormat_path, row.names = 1, check.names = FALSE))
  varmeta <- read.csv(varmeta_path) %>% as_tibble()
  sim <- simulate_from_cormat(cormat, varmeta, n)
  # Map sim columns to our schema as available
  employees <- tibble(
    employee_id = sprintf("E%05d", 1:n),
    hire_date = sample(seq(start_date - 365, start_date + 365, by = "day"), n, replace = TRUE),
    job_level = if ("job_level" %in% names(sim)) as.integer(sim$job_level) else sample(1:6, n, replace = TRUE),
    job_family = if ("job_family" %in% names(sim)) as.character(sim$job_family) else sample(c("Ops","Sales","Eng","HR","Fin","CS"), n, replace = TRUE),
    location = if ("location" %in% names(sim)) as.character(sim$location) else sample(c("US","EU","APAC"), n, replace = TRUE),
    sex = if ("sex" %in% names(sim)) as.character(ifelse(sim$sex > 0.5, "M", "F")) else sample(c("F","M"), n, replace = TRUE),
    age_band = sample(c("<30","30-39","40-49","50+"), n, replace = TRUE, prob = c(0.35,0.35,0.2,0.1)),
    base_pay = if ("base_pay" %in% names(sim)) as.numeric(sim$base_pay) else round(rlnorm(n, meanlog = 11, sdlog = 0.3)),
    performance = if ("performance" %in% names(sim)) pmin(5, pmax(1, as.integer(round(sim$performance)))) else sample(1:5, n, replace = TRUE, prob = c(0.05,0.2,0.5,0.2,0.05))
  )
} else {
  employees <- tibble(
    employee_id = sprintf("E%05d", 1:n),
    hire_date = sample(seq(start_date - 365, start_date + 365, by = "day"), n, replace = TRUE),
    job_level = sample(1:6, n, replace = TRUE, prob = c(0.25,0.25,0.2,0.15,0.1,0.05)),
    job_family = sample(c("Ops","Sales","Eng","HR","Fin","CS"), n, replace = TRUE, prob = c(0.25,0.2,0.25,0.05,0.1,0.15)),
    location = sample(c("US","EU","APAC"), n, replace = TRUE, prob = c(0.6,0.25,0.15)),
    sex = sample(c("F","M"), n, replace = TRUE),
    age_band = sample(c("<30","30-39","40-49","50+"), n, replace = TRUE, prob = c(0.35,0.35,0.2,0.1)),
    base_pay = round(rlnorm(n, meanlog = 11, sdlog = 0.3)),
    performance = sample(1:5, n, replace = TRUE, prob = c(0.05,0.2,0.5,0.2,0.05))
  )
}

# Simulate time to voluntary attrition (some censoring)
tenure_years <- pmax(0.1, rlnorm(n, meanlog = 0.5, sdlog = 0.6))
hazard <- plogis(-2.2 + 0.15 * (employees$job_level <= 2) + 0.2 * (employees$performance <= 2))
event <- rbinom(n, 1, prob = hazard)
term_date <- employees$hire_date + as.integer(365 * (tenure_years))
term_date <- pmin(term_date, end_date)

terms <- tibble(
  employee_id = employees$employee_id,
  voluntary = event,
  termination_date = if_else(event == 1, term_date, as.Date(NA))
)

hr <- employees %>% left_join(terms, by = "employee_id")

# 2) Build monthly snapshots and 6-month horizon label
snapshots <- tibble(snapshot_date = seq(as.Date("2023-01-01"), end_date - 180, by = "month")) %>%
  crossing(hr %>% dplyr::select(employee_id, hire_date, job_level, job_family, location, sex, age_band, base_pay, performance, termination_date, voluntary)) %>%
  filter(hire_date <= snapshot_date) %>%
  mutate(active = is.na(termination_date) | termination_date > snapshot_date) %>%
  filter(active)

# Label: attrition within next 6 months
snapshots <- snapshots %>%
  mutate(horizon_end = snapshot_date + 180,
         attrit_6m = if_else(!is.na(termination_date) & voluntary == 1 & termination_date <= horizon_end, 1L, 0L))

# Features
snapshots <- snapshots %>%
  mutate(
    tenure_days = as.integer(snapshot_date - hire_date),
    tenure_years = tenure_days / 365,
    compa_ratio = base_pay / median(base_pay, na.rm = TRUE),
    season_q = quarter(snapshot_date),
    is_jan = month(snapshot_date) == 1L
  )

# 3) Time-based split
snapshots <- snapshots %>% arrange(snapshot_date)
cutoff <- as.Date("2024-06-01")
train <- snapshots %>% filter(snapshot_date < cutoff) %>% mutate(attrit_6m = factor(attrit_6m, levels = c(0,1)))
test  <- snapshots %>% filter(snapshot_date >= cutoff) %>% mutate(attrit_6m = factor(attrit_6m, levels = c(0,1)))

# 4) Classification models
rec <- recipe(attrit_6m ~ job_level + job_family + location + sex + age_band + performance + tenure_years + compa_ratio + season_q + is_jan, data = train) %>%
  step_mutate(is_jan = as.numeric(is_jan)) %>%
  step_impute_median(all_numeric_predictors()) %>%
  step_impute_mode(all_nominal_predictors()) %>%
  step_other(all_nominal_predictors(), threshold = 0.01) %>%
  step_dummy(all_nominal_predictors())

# Baseline logistic
logit_spec <- logistic_reg(penalty = tune(), mixture = 1) %>% set_engine("glmnet")
wf_logit <- workflow(rec, logit_spec)
folds <- vfold_cv(train, v = 5, strata = attrit_6m)
metrics <- metric_set(roc_auc, pr_auc, brier_class)
res_logit <- tune_grid(wf_logit, resamples = folds, metrics = metrics)
best_logit <- select_best(res_logit, metric = "roc_auc")
final_logit <- finalize_workflow(wf_logit, best_logit) %>% fit(data = train)

# Random forest
rf_spec <- rand_forest(mtry = tune(), min_n = tune(), trees = 800) %>% set_engine("ranger", probability = TRUE) %>% set_mode("classification")
wf_rf <- workflow(rec, rf_spec)
res_rf <- tune_grid(wf_rf, resamples = folds, metrics = metrics)
best_rf <- select_best(res_rf, metric = "roc_auc")
final_rf <- finalize_workflow(wf_rf, best_rf) %>% fit(data = train)

# Evaluate on test
pred_rf <- bind_cols(test, predict(final_rf, test, type = "prob"))
met_rf  <- roc_pr_metrics(pred_rf, truth = attrit_6m, .pred_1)
write_csv(met_rf, file.path(output_dir, "metrics_rf.csv"))

# Calibration
cal_df <- calibration_df(pred_rf, truth = attrit_6m, prob = .pred_1, bins = 10)
plot_calibration(cal_df, file.path(output_dir, "calibration_rf.png"))

# Fairness (by sex)
fair <- fairness_summary(pred_rf, truth = attrit_6m, prob = .pred_1, group = sex, cutoff = 0.5)
write_csv(fair$by_group, file.path(output_dir, "fairness_by_sex.csv"))
writeLines(glue("AIR (sex) = {round(fair$air,3)}"), file.path(output_dir, "fairness_air.txt"))

# 5) Survival models (Cox + RSF)
# Build one record per employee: start at snapshot_date, event when termination occurs (voluntary only)
# Simplify: time-to-event from hire to term/censor
# Precompute global compa_ratio by employee
base_pay_median <- median(employees$base_pay, na.rm = TRUE)
comp_lookup <- employees %>% transmute(employee_id, compa_ratio = base_pay / base_pay_median)

survival_status <- "ok"
tryCatch({
  surv_df <- hr %>%
    mutate(
      end_time = pmin(coalesce(termination_date, end_date), end_date),
      event = if_else(!is.na(termination_date) & voluntary == 1, 1L, 0L),
      time_days = as.numeric(end_time - hire_date),
      tenure0 = as.numeric(as.Date("2023-01-01") - hire_date)
    ) %>%
    left_join(employees %>% select(employee_id, job_level, job_family, location, sex, age_band, performance), by = "employee_id") %>%
    left_join(comp_lookup, by = "employee_id")

  # Persist column names for debugging if needed
  writeLines(paste(colnames(surv_df), collapse = ","), file.path(output_dir, "surv_cols.txt"))

  cox_fit <- coxph(Surv(time_days, event) ~ job_level + job_family + location + sex + age_band + performance + compa_ratio, data = surv_df)
  summary_cox <- broom::tidy(cox_fit)
  write_csv(summary_cox, file.path(output_dir, "cox_summary.csv"))

  # Random Survival Forest (using ranger)
  y <- Surv(surv_df$time_days, surv_df$event)
  rsf <- ranger(y ~ job_level + job_family + location + sex + age_band + performance + compa_ratio,
                data = surv_df, num.trees = 800, mtry = 4, splitrule = "logrank")
}, error = function(e) {
  survival_status <<- paste("error:", conditionMessage(e))
  writeLines(survival_status, file.path(output_dir, "survival_error.txt"))
})

# Save brief text report
surv_line <- if (startsWith(survival_status, "ok")) {
  "- Survival models: Cox PH summary saved; RSF fitted"
} else {
  paste0("- Survival models: ", survival_status)
}
report <- c(
  "Attrition Modeling Replication (synthetic data)",
  "- Classification model: Random Forest tuned via CV",
  paste0("- Test ROC-AUC/PR-AUC/Brier:\n", paste(capture.output(print(met_rf)), collapse = "\n")),
  paste0("- Fairness AIR (sex): ", round(fair$air, 3)),
  surv_line
)
writeLines(report, file.path(output_dir, "report.txt"))

message("Replication run complete. Outputs in ", output_dir) 