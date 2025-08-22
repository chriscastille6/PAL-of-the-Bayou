suppressPackageStartupMessages({
  library(tidyverse)
  library(MASS)
})

# simulate_from_cormat
# cormat: numeric correlation matrix with col/rownames
# varmeta: tibble with columns: var, mean, sd, type ('numeric'|'binary'|'ordered')
# n: number of rows to simulate
simulate_from_cormat <- function(cormat, varmeta, n) {
  varmeta <- varmeta %>% mutate(type = as.character(type))
  stopifnot(all(varmeta$var %in% colnames(cormat)))
  ord <- varmeta$var
  Sigma <- as.matrix(cormat[ord, ord])
  z <- MASS::mvrnorm(n = n, mu = rep(0, ncol(Sigma)), Sigma = Sigma, empirical = FALSE)
  colnames(z) <- ord
  X <- vector("list", length(ord))
  names(X) <- ord
  for (v in ord) {
    meta <- varmeta %>% filter(var == v)
    if (nrow(meta) == 0) stop("Missing metadata for ", v)
    meta <- meta[1, , drop = FALSE]
    t <- trimws(tolower(meta$type))
    if (t == "numeric") {
      X[[v]] <- as.numeric(scale(z[, v])) * as.numeric(meta$sd) + as.numeric(meta$mean)
    } else if (t == "binary") {
      p <- as.numeric(meta$mean)
      p <- min(max(p, 1e-4), 1 - 1e-4)
      thresh <- qnorm(1 - p)
      X[[v]] <- as.integer(z[, v] > thresh)
    } else if (t == "ordered") {
      k <- max(3, round(as.numeric(meta$mean)))
      probs <- pmax(1e-3, dnorm(seq(-2, 2, length.out = k), mean = 0, sd = ifelse(is.na(meta$sd), 0.8, as.numeric(meta$sd))))
      probs <- probs / sum(probs)
      q <- cumsum(probs)
      cuts <- qnorm(q[-length(q)])
      X[[v]] <- as.integer(cut(z[, v], breaks = c(-Inf, cuts, Inf), labels = FALSE))
    } else {
      stop("Unknown type for ", v)
    }
  }
  as_tibble(X)
} 