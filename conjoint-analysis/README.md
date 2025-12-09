# Conjoint Analysis

## Purpose

This folder contains analysis scripts for conjoint analysis studies, particularly focused on employee preferences and workplace attributes.

The analysis performs:

- Multinomial logit (MNL) estimation
- Attribute importance calculation
- Willingness-to-pay (WTP) estimation
- Efficient frontier analysis
- Visualization generation

## Usage

### Basic Usage

1. Export conjoint data from your assessment system:

```r
source("../scripts/export_assessment_data.R")
con <- connect_supabase()
conjoint_data <- export_conjoint_data(con)
```

2. Run the analysis:

```r
source("analysis.R")
```

### Outputs

The analysis generates several outputs in the `outputs/` folder:

- `attribute_importance.csv` - Relative importance of each attribute
- `wtp_pct.csv` - Willingness-to-pay estimates by attribute level
- `attribute_importance.png` - Visualization of attribute importance
- `wtp.png` - Visualization of willingness-to-pay

## Data Format

The analysis expects `conjoint_data` to be a list with:

- `choice_data` - Choice observations from conjoint tasks
- `assessment_data` - Additional assessment responses

See `scripts/export_assessment_data.R` for the exact format.

## Customization

You'll need to customize `attributes_df` in `analysis.R` to match your study design. This defines:

- Attribute names
- Attribute levels
- Cost values (for efficient frontier analysis)
- Attribute ordering

## Dependencies

- tidyverse
- mlogit
- ggplot2
- scales

These are automatically installed if missing.

## Reference

Based on the approach described in:

Slade, B. A., et al. (2002). [Your citation here]

## Notes

This analysis script is designed to work with data exported from the assessment library system. Adjust the data processing section if using data from other sources.


