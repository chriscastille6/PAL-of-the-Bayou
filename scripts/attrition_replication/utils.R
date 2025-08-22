suppressPackageStartupMessages({
  library(tidyverse)
  library(yardstick)
  library(rlang)
})

ensure_packages <- function(pkgs) {
  to_install <- pkgs[!pkgs %in% rownames(installed.packages())]
  if (length(to_install) > 0) install.packages(to_install, repos = "https://cloud.r-project.org")
}

roc_pr_metrics <- function(df, truth, prob) {
  truth <- enquo(truth); prob <- enquo(prob)
  bind_rows(
    roc_auc(df, truth = !!truth, !!prob),
    pr_auc(df,  truth = !!truth, !!prob),
    brier_class(df, truth = !!truth, !!prob)
  )
}

calibration_df <- function(df, truth, prob, bins = 10) {
  truth <- enquo(truth); prob <- enquo(prob)
  df %>% mutate(bin = ntile(!!prob, bins)) %>%
    group_by(bin) %>%
    summarise(
      mean_pred = mean(!!prob),
      event_rate = mean(!!truth == 1), .groups = "drop"
    )
}

adverse_impact_ratio <- function(y_true, y_pred_binary, group) {
  d <- tibble(y_true = y_true, y_pred = y_pred_binary, group = group)
  rates <- d %>% group_by(group) %>% summarise(sel_rate = mean(y_pred == 1), .groups = "drop")
  if (nrow(rates) < 2) return(NA_real_)
  min(rates$sel_rate) / max(rates$sel_rate)
}

fairness_summary <- function(df, truth, prob, group, cutoff = 0.5) {
  truth <- enquo(truth); prob <- enquo(prob); group <- enquo(group)
  d <- df %>% mutate(pred = (!!prob) >= cutoff)
  overall <- roc_pr_metrics(d, !!truth, !!prob)
  by_group <- d %>% group_by(!!group) %>%
    summarise(
      tpr = mean(pred & (!!truth == 1)) / sum((!!truth) == 1),
      fpr = mean(pred & (!!truth == 0)) / sum((!!truth) == 0),
      sel_rate = mean(pred), .groups = "drop"
    )
  air <- adverse_impact_ratio(d %>% pull(!!truth), d$pred, d %>% pull(!!group))
  list(overall = overall, by_group = by_group, air = air)
}

plot_calibration <- function(cal_df, out_path) {
  p <- ggplot(cal_df, aes(x = mean_pred, y = event_rate)) +
    geom_point() +
    geom_abline(slope = 1, intercept = 0, linetype = "dashed", color = "gray50") +
    coord_equal(xlim = c(0,1), ylim = c(0,1)) +
    labs(x = "Mean predicted probability", y = "Observed event rate", title = "Calibration plot") +
    theme_minimal()
  ggsave(out_path, p, width = 5, height = 4, dpi = 150)
} 