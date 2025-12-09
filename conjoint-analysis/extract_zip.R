# File location: conjoint-analysis/extract_zip.R
# Purpose: Helper script to extract the data package zip file
# Why: Makes it easy to restore files from session_0_Data_Package.zip
# RELEVANT FILES: quick_start.R

# Extract Data Package Zip File
# Usage: 
#   1. Update ZIP_PATH below with the path to your zip file
#   2. Run: source("extract_zip.R")

cat("=== EXTRACT DATA PACKAGE ZIP ===\n\n")

# Update this path to point to your zip file
ZIP_PATH <- "session_0_Data_Package.zip"  # Update this!

# Or uncomment and update one of these:
# ZIP_PATH <- file.path(Sys.getenv("HOME"), "Downloads", "session_0_Data_Package.zip")
# ZIP_PATH <- "/full/path/to/session_0_Data_Package.zip"

if (!file.exists(ZIP_PATH)) {
  cat("✗ Zip file not found at:", ZIP_PATH, "\n\n")
  cat("Please update ZIP_PATH in this script to point to your zip file location.\n")
  cat("Or provide the path when running:\n")
  cat('  ZIP_PATH <- "/path/to/session_0_Data_Package.zip"\n')
  cat('  unzip(ZIP_PATH, exdir = ".", overwrite = FALSE)\n')
  stop("Zip file not found. Please update ZIP_PATH.")
}

cat("Found zip file:", ZIP_PATH, "\n")
cat("File size:", round(file.info(ZIP_PATH)$size / 1024, 2), "KB\n\n")

# List contents first
cat("=== ZIP FILE CONTENTS ===\n")
zip_contents <- unzip(ZIP_PATH, list = TRUE)
print(zip_contents)

cat("\n=== EXTRACTING FILES ===\n")
# Extract to current directory
unzip(ZIP_PATH, exdir = ".", overwrite = FALSE)

cat("\n✓ Extraction complete!\n")
cat("\nFiles extracted to:", getwd(), "\n")

# List what was extracted
cat("\n=== EXTRACTED FILES ===\n")
new_files <- list.files(recursive = TRUE)
for (file in new_files) {
  cat("  -", file, "\n")
}

cat("\n=== NEXT STEPS ===\n")
cat("1. Review the extracted files\n")
cat("2. Run quick_start.R to verify everything is in place\n")
cat("3. Compare with analysis.R to see if any updates are needed\n")


