# Attrition Modeling Replication (Speer-aligned)

This folder contains a minimal, reproducible pipeline to replicate Speer’s applied attrition modeling approach on synthetic data. Swap in your HRIS export later using the same schema.

Steps
- Install R 4.3+ and R packages on first run (the script will install if missing)
- Run `Rscript run_replication.R`
- Outputs are written to `static/attrition-replication/` for inclusion in the draft blog post

Files
- `run_replication.R`: end-to-end pipeline (data synth → features → models → validation → fairness → figures)
- `utils.R`: helpers for metrics and plotting
- `data/`: placeholders for synthetic or real data exports 