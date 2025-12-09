# File location: conjoint-analysis/quick_start.R
# Purpose: Quick start script to verify project setup and check for missing files
# Why: Helps verify that all necessary files are present and identifies what might be missing
# RELEVANT FILES: analysis.R, README.md

# Quick Start Verification Script
# This script checks what files exist and helps identify what might be missing

cat("=== CONJOINT ANALYSIS PROJECT - QUICK START CHECK ===\n\n")

# Set working directory
SCRIPT_DIR <- getwd()
if (basename(SCRIPT_DIR) != "conjoint-analysis") {
  # Try to find the conjoint-analysis directory
  if (dir.exists("conjoint-analysis")) {
    setwd("conjoint-analysis")
    SCRIPT_DIR <- getwd()
  } else {
    cat("WARNING: Not in conjoint-analysis directory\n")
    cat("Current directory:", getwd(), "\n\n")
  }
}

cat("Project directory:", SCRIPT_DIR, "\n\n")

# Check for expected files
expected_files <- c(
  "analysis.R",
  "README.md",
  ".gitignore"
)

cat("=== FILE CHECK ===\n")
for (file in expected_files) {
  exists <- file.exists(file)
  status <- if (exists) "✓" else "✗ MISSING"
  cat(sprintf("%-20s %s\n", file, status))
}

cat("\n=== DIRECTORY CHECK ===\n")
expected_dirs <- c(
  "outputs",
  "data",
  "scripts"
)

for (dir in expected_dirs) {
  exists <- dir.exists(dir)
  status <- if (exists) "✓" else "✗ MISSING"
  cat(sprintf("%-20s %s\n", dir, status))
}

cat("\n=== EXISTING FILES IN PROJECT ===\n")
all_files <- list.files(recursive = TRUE, include.dirs = TRUE)
if (length(all_files) > 0) {
  for (file in all_files) {
    cat("  -", file, "\n")
  }
} else {
  cat("  (no additional files found)\n")
}

cat("\n=== DATA FILES CHECK ===\n")
data_files <- list.files(pattern = "\\.(csv|rds|RData|json)$", recursive = TRUE)
if (length(data_files) > 0) {
  cat("Found data files:\n")
  for (file in data_files) {
    size <- file.info(file)$size
    cat(sprintf("  - %s (%s KB)\n", file, round(size/1024, 2)))
  }
} else {
  cat("  No data files found (this is normal if you haven't exported data yet)\n")
}

cat("\n=== ANALYSIS SCRIPT CHECK ===\n")
if (file.exists("analysis.R")) {
  script_content <- readLines("analysis.R", warn = FALSE)
  cat("analysis.R exists:", length(script_content), "lines\n")
  
  # Check for key functions
  has_mlogit <- any(grepl("mlogit", script_content, ignore.case = TRUE))
  has_wtp <- any(grepl("wtp|willingness", script_content, ignore.case = TRUE))
  has_importance <- any(grepl("importance", script_content, ignore.case = TRUE))
  
  cat("  - mlogit usage:", if (has_mlogit) "✓" else "✗", "\n")
  cat("  - WTP calculation:", if (has_wtp) "✓" else "✗", "\n")
  cat("  - Importance calculation:", if (has_importance) "✓" else "✗", "\n")
} else {
  cat("✗ analysis.R not found!\n")
}

cat("\n=== PACKAGE CHECK ===\n")
required_packages <- c("tidyverse", "mlogit", "ggplot2", "scales")
for (pkg in required_packages) {
  installed <- pkg %in% rownames(installed.packages())
  status <- if (installed) "✓" else "✗ NOT INSTALLED"
  if (installed) {
    version <- as.character(packageVersion(pkg))
    cat(sprintf("%-15s %s (v%s)\n", pkg, "✓", version))
  } else {
    cat(sprintf("%-15s %s\n", pkg, status))
  }
}

cat("\n=== SUMMARY ===\n")
cat("To get started:\n")
cat("1. If you have a data package zip file, extract it into this directory\n")
cat("2. Export conjoint data using: scripts/export_assessment_data.R\n")
cat("3. Customize attributes_df in analysis.R to match your study design\n")
cat("4. Run: source('analysis.R')\n")

cat("\n=== NEXT STEPS ===\n")
cat("If you have session_0_Data_Package.zip:\n")
cat("  unzip session_0_Data_Package.zip\n")
cat("\nTo export new data:\n")
cat("  source('../scripts/export_assessment_data.R')\n")
cat("  con <- connect_supabase()\n")
cat("  conjoint_data <- export_conjoint_data(con)\n")
cat("  source('analysis.R')\n")

cat("\n✓ Quick start check complete!\n")


