suppressPackageStartupMessages({
  library(tidyverse)
  library(pdftools)
})

# Attempt naive extraction of a correlation matrix from a PDF by keyword and line parsing
# Returns a tibble with columns: row, col, r
extract_cormat_from_pdf <- function(pdf_path, keyword = "correlation", max_pages = 10) {
  txt <- pdftools::pdf_text(pdf_path)[1:max_pages]
  lines <- unlist(strsplit(txt, "\n"))
  cand <- grep(keyword, tolower(lines))
  if (length(cand) == 0) return(NULL)
  # Heuristic: take 50 lines around first occurrence
  idx1 <- max(1, cand[1] - 10); idx2 <- min(length(lines), cand[1] + 50)
  block <- lines[idx1:idx2]
  # Parse numbers in a grid-like way (very crude)
  rows <- lapply(block, function(l) as.numeric(str_extract_all(l, "-?[0-9]+\.[0-9]+")[[1]]))
  rows <- rows[map_lgl(rows, ~ length(.x) > 2)]
  if (length(rows) < 3) return(NULL)
  # Build square-ish matrix by trimming to min length
  minlen <- min(lengths(rows))
  M <- do.call(rbind, lapply(rows, function(x) x[1:minlen]))
  if (nrow(M) != ncol(M)) {
    # not square; bail out
    return(NULL)
  }
  # Coerce to correlation matrix bounds
  M[M > 1] <- 1; M[M < -1] <- -1
  colnames(M) <- paste0("V", seq_len(ncol(M)))
  rownames(M) <- paste0("V", seq_len(nrow(M)))
  as_tibble(M, rownames = NA)
} 