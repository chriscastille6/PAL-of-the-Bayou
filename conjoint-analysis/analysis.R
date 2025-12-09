# File location: conjoint-analysis/analysis.R
# Purpose: Main analysis script for conjoint analysis data
# Why: Performs multinomial logit estimation, computes attribute importance, WTP, and efficient frontier analysis
# RELEVANT FILES: README.md, scripts/export_assessment_data.R

# Analysis script for conjoint analysis
# - Works with exported data from export_conjoint_data() or direct data files
# - Estimates multinomial logit (MNL) models
# - Computes attribute importance and willingness-to-pay (WTP)
# - Generates efficient frontier analysis
# - Creates visualizations and CSV outputs

# Install required packages if needed
required_packages <- c("tidyverse", "mlogit", "ggplot2", "scales")
installed <- required_packages %in% rownames(installed.packages())
if (any(!installed)) {
  install.packages(required_packages[!installed], repos = "https://cloud.r-project.org")
}

suppressPackageStartupMessages({
  library(tidyverse)
  library(mlogit)
  library(ggplot2)
  library(scales)
})

# Set up paths
SCRIPT_DIR <- getwd()
if (basename(SCRIPT_DIR) != "conjoint-analysis") {
  # Try to find the conjoint-analysis directory
  possible_paths <- c(
    file.path(dirname(getwd()), "conjoint-analysis"),
    file.path(getwd(), "conjoint-analysis"),
    getwd()
  )
  for (path in possible_paths) {
    if (dir.exists(path) && basename(path) == "conjoint-analysis") {
      SCRIPT_DIR <- path
      break
    }
  }
}
ROOT <- dirname(SCRIPT_DIR)
OUTPUT_DIR <- file.path(SCRIPT_DIR, "outputs")
if (!dir.exists(OUTPUT_DIR)) dir.create(OUTPUT_DIR, recursive = TRUE)

# Check if conjoint_data exists (from export_conjoint_data())
if (!exists("conjoint_data")) {
  stop("Error: conjoint_data not found. Please run:\n",
       "  source('scripts/export_assessment_data.R')\n",
       "  conjoint_data <- export_conjoint_data(con)\n",
       "Or load your data into the 'conjoint_data' variable.")
}

choice_data <- conjoint_data$choice_data
assessment_data <- conjoint_data$assessment_data

message("Loaded ", nrow(choice_data), " choice observations")
message("Loaded ", nrow(assessment_data), " assessment responses")

# TODO: Define attributes_df based on your conjoint study design
# This should match the attributes and levels used in your assessment
# Example structure:
attributes_df <- tribble(
  ~attribute,                ~level,               ~label,                                        ~order, ~is_better_higher, ~cost_k,
  "Base pay",               "0%",                "Base unchanged",                             1L,     TRUE,              0.0,
  "Base pay",               "10%",               "Base +10%",                                  2L,     TRUE,              10.0,
  "Base pay",               "20%",               "Base +20%",                                  3L,     TRUE,              20.0,
  "Learning",               "0",                 "No mandatory training",                      1L,     TRUE,              0.0,
  "Learning",               "40",                "40 hours/yr mandatory training",             2L,     TRUE,              1.5,
  "Learning",               "60+Mentor",         "60 hours + mentoring program",               3L,     TRUE,              2.5,
  "Manager effectiveness",  "Average",           "Average manager capability",                  1L,     TRUE,              0.0,
  "Manager effectiveness",  "Enhanced",          "Invest to strengthen managers",               2L,     TRUE,              1.5,
  "Internal job market",    "StatusQuo",         "No change",                                   1L,     TRUE,              0.0,
  "Internal job market",    "ApplyNoPermission", "Apply without manager permission",            2L,     TRUE,              0.5,
  "Internal job market",    "ActiveRecruit",     "Managers actively recruit across departments", 3L,     TRUE,              1.0,
  "Health care",            "Premium25to50",     "Pay $25–$50 premium for dependents",          1L,     TRUE,              0.0,
  "Health care",            "NoChange",          "No change to current plan",                   2L,     TRUE,              2.0,
  "Health care",            "CashWaiver",        "Cash for waiving portions of coverage",       3L,     TRUE,              1.0
) %>% arrange(attribute, order)

# Build profiles and design matrix
attr_levels <- attributes_df %>% 
  group_by(attribute) %>% 
  summarise(levels = list(level), .groups = "drop")

profiles_df <- attr_levels %>%
  pull(levels) %>%
  do.call(expand.grid, .) %>%
  as_tibble() %>%
  setNames(attr_levels$attribute) %>%
  mutate(profile_id = row_number(), .before = 1)

build_design_matrix <- function(profiles_tbl) {
  mats <- lapply(unique(attributes_df$attribute), function(att){
    levs <- attributes_df %>% 
      filter(attribute == att) %>% 
      arrange(order) %>% 
      pull(level)
    levs_no_base <- levs[-1]
    mm <- sapply(levs_no_base, function(lv){ 
      as.integer(profiles_tbl[[att]] == lv) 
    })
    if (is.null(dim(mm))) mm <- matrix(mm, ncol = 1)
    colnames(mm) <- paste(att, levs_no_base, sep = "|")
    mm
  })
  X <- do.call(cbind, mats)
  attr(X, "col_labels") <- colnames(X)
  X
}

profiles_X <- build_design_matrix(profiles_df)

# Process choice data into mlogit format
# The exported data has: resp_id, task_id, chosen_alt (1 or 2), and task_data columns
# task_data contains the alternatives shown in each choice task

# Create choice ID
choice_data <- choice_data %>%
  mutate(chid = paste(resp_id, task_id, sep = "_"))

# Check what columns are in choice_data (after unnest_wider)
message("Choice data columns: ", paste(names(choice_data), collapse = ", "))

# Convert to long format for mlogit
# This requires knowing how alternatives are stored in task_data
# Common formats: alternative1, alternative2 or altA, altB or alternatives as list
# Adjust based on your actual data structure

# Example: if alternatives are stored as alternative1, alternative2 columns
# or if they're in a nested structure, you'll need to unnest them first

# For now, create a placeholder that you can customize
message("\nNOTE: You may need to customize the data processing section")
message("based on how your task_data stores the alternatives.\n")

# This is a template - customize based on your data structure
# If alternatives are stored as separate columns (e.g., alternative1, alternative2)
alt_cols <- names(choice_data)[str_detect(names(choice_data), "alternative|alt[AB]|profile")]
if (length(alt_cols) >= 2) {
  choices_long <- choice_data %>%
    pivot_longer(
      cols = all_of(alt_cols),
      names_to = "which",
      values_to = "profile_attr"
    ) %>%
    mutate(
      alt = case_when(
        str_detect(which, "1|A|first") ~ "A",
        str_detect(which, "2|B|second") ~ "B",
        TRUE ~ substr(which, nchar(which), nchar(which))
      ),
      chosen = as.integer((chosen_alt == 1 & alt == "A") | (chosen_alt == 2 & alt == "B"))
    ) %>%
    arrange(resp_id, chid, alt)
} else {
  stop("Could not find alternative columns. Please customize the data processing section.")
}

# Attach design variables
Xcols <- colnames(profiles_X)
with_design <- choices_long %>%
  mutate(row = match(profile_id, profiles_df$profile_id))
for (j in seq_along(Xcols)) {
  with_design[[Xcols[j]]] <- profiles_X[with_design$row, j]
}
with_design <- with_design %>% select(-row)

# Prepare mlogit data
df_mlogit <- mlogit.data(
  with_design, 
  choice = "chosen", 
  shape = "long", 
  chid.var = "chid", 
  alt.var = "alt", 
  id.var = "resp_id"
)

# Estimate pooled MNL
formula_term <- paste(sprintf("`%s`", Xcols), collapse = " + ")
fm <- as.formula(paste("chosen ~", formula_term, "| 0"))
fit <- mlogit(fm, data = df_mlogit)
print(summary(fit))

coef_est <- coef(fit)

# Compute attribute importance (range over levels per attribute)
imp_tbl <- {
  ranges <- list()
  for (att in unique(attributes_df$attribute)) {
    levs <- attributes_df %>% 
      filter(attribute == att) %>% 
      arrange(order) %>% 
      pull(level)
    base <- levs[1]
    alts <- levs[-1]
    betas <- c(0, as.numeric(coef_est[paste(att, alts, sep = "|")]))
    rng <- max(betas) - min(betas)
    ranges[[att]] <- rng
  }
  tibble(
    attribute = names(ranges), 
    range = unlist(ranges)
  ) %>% 
    mutate(importance = 100 * range / sum(range)) %>% 
    arrange(desc(importance))
}

# Compute willingness-to-pay (WTP)
# Translate non-monetary betas into % base pay equivalents
bp10 <- unname(coef_est["Base pay|10%"])
if (is.na(bp10)) {
  message("Warning: Base pay coefficient not found. Skipping WTP calculation.")
  wtp_tbl <- tibble(
    attribute_level = names(coef_est),
    coef = as.numeric(coef_est),
    wtp_pct_base = NA_real_
  )
} else {
  salary_per_pct <- bp10 / 10
  wtp_tbl <- tibble(
    attribute_level = names(coef_est),
    coef = as.numeric(coef_est)
  ) %>%
    filter(!str_starts(attribute_level, "Base pay|")) %>%
    mutate(wtp_pct_base = coef / salary_per_pct)
}

# Save outputs
readr::write_csv(imp_tbl, file.path(OUTPUT_DIR, "attribute_importance.csv"))
readr::write_csv(wtp_tbl, file.path(OUTPUT_DIR, "wtp_pct.csv"))

# Create attribute importance visualization
p_importance <- ggplot(imp_tbl, aes(x = reorder(attribute, importance), y = importance)) +
  geom_bar(stat = "identity", fill = "#3B82F6") +
  coord_flip() +
  labs(
    x = "Attribute",
    y = "Relative Importance (%)",
    title = "Attribute Importance in Conjoint Analysis"
  ) +
  theme_minimal(base_size = 12) +
  theme(plot.title = element_text(hjust = 0.5))

ggsave(
  file.path(OUTPUT_DIR, "attribute_importance.png"), 
  p_importance, 
  width = 8, 
  height = 5, 
  dpi = 300
)

# Create WTP visualization
if (!all(is.na(wtp_tbl$wtp_pct_base))) {
  p_wtp <- ggplot(wtp_tbl, aes(x = reorder(attribute_level, wtp_pct_base), y = wtp_pct_base)) +
    geom_bar(stat = "identity", fill = "#10B981") +
    coord_flip() +
    labs(
      x = "Attribute Level",
      y = "Willingness-to-Pay (% of Base Pay)",
      title = "Willingness-to-Pay by Attribute Level"
    ) +
    theme_minimal(base_size = 10) +
    theme(plot.title = element_text(hjust = 0.5))
  
  ggsave(
    file.path(OUTPUT_DIR, "wtp.png"), 
    p_wtp, 
    width = 10, 
    height = 6, 
    dpi = 300
  )
}

message("\n✓ Analysis complete!")
message("✓ Outputs saved to: ", OUTPUT_DIR)
message("  - attribute_importance.csv")
message("  - wtp_pct.csv")
message("  - attribute_importance.png")
if (!all(is.na(wtp_tbl$wtp_pct_base))) {
  message("  - wtp.png")
}

