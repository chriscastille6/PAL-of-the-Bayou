# BLS Wage Data Integration Guide

## Overview

This guide covers three approaches to add BLS wage data to the assessment:
- **Option A:** Automated import from the official BLS Excel download (⭐ fastest, now implemented)
- **Option C:** Manual CSV workflow (still available if you want to hand-edit)
- **Option D:** BLS API (Currently not working - OEWS data not in timeseries API)

---

## Option A: Automated Excel Import (Recommended)

Use this when you have the full OEWS download in `~/Downloads/oesm23nat`.

### Step 1: Copy the Excel file into the project

```bash
cd "/Users/ccastille/Documents/GitHub/website/static/assessments/people-analytics-fit"
mkdir -p data
cp -R ~/Downloads/oesm23nat ./data/
```

You should now have: `data/oesm23nat/national_M2023_dl.xlsx`

### Step 2: Install dependencies (one-time)

```bash
npm install
```

The script uses the lightweight `xlsx` package to parse the spreadsheet.

### Step 3: Run the importer

```bash
node import_bls_from_excel.js
```

This will:
- ✅ Parse the OEWS Excel (`national_M2023_dl.xlsx`)
- ✅ Match SOC codes to `occupations_all.json`
- ✅ Write `wageP10`, `wageP25`, `wageMedian`, `wageP75`, `wageP90`
- ✅ Update metadata with `BLS OEWS 2023 - National`

The script prints how many occupations were updated and lists any SOC codes not found in the data (usually older or discontinued codes).

### Step 4: Test in the UI

Same as before: open the assessment, pick an occupation, finish the test, and check the Income section.

---

## Option C: Download BLS Excel/CSV Data (Recommended)

### Step 1: Get BLS Data

**Option C1: Manual Entry via BLS Website (Best for small batches)**

1. Go to: https://data.bls.gov/oes/#/home
2. Select "National" for area
3. Search for occupation by SOC code (e.g., "19-3032" for I-O Psychologists)
4. Click "Retrieve Data"
5. Copy the annual wage percentiles:
   - 10th percentile
   - 25th percentile
   - 50th percentile (Median) ⭐
   - 75th percentile
   - 90th percentile

**Option C2: Download Full BLS Excel File (Best for all 867 occupations)**

1. Go to: https://www.bls.gov/oes/tables.htm
2. Download "National" OEWS data (Excel format)
3. Open Excel file
4. Filter by SOC code to match your occupations
5. Extract wage columns

### Step 2: Add to CSV Template

1. Open `BLS_WAGE_DATA_TEMPLATE.csv`
2. For each occupation, fill in:
   - `annual_10th` - 10th percentile wage (number only, no $ or commas)
   - `annual_25th` - 25th percentile wage
   - `annual_median` - Median wage ⭐ **Required**
   - `annual_75th` - 75th percentile wage
   - `annual_90th` - 90th percentile wage
   - `data_source` - e.g., "BLS OEWS 2024 - National"
   - `data_year` - e.g., "2024"

**Example:**
```csv
onet_code,occupation_title,annual_10th,annual_25th,annual_median,annual_75th,annual_90th,data_source,data_year
19-3032.00,Industrial-Organizational Psychologists,50000,65000,85000,110000,140000,BLS OEWS 2024 - National,2024
```

### Step 3: Convert CSV to JSON

```bash
cd "/Users/ccastille/Documents/GitHub/website/static/assessments/people-analytics-fit"
node convert_bls_excel_to_json.js
```

This will:
- ✅ Read your CSV file
- ✅ Update `occupations_all.json` with wage data
- ✅ Update metadata
- ✅ Show summary of updated occupations

### Step 4: Test

1. Open assessment: http://localhost:8000/index.html
2. Select an occupation with wage data
3. Complete assessment
4. Check "Income" section in results
5. Should see BLS wage data displayed

---

## Option D: BLS API (Not Currently Working)

### Current Status

❌ **BLS timeseries API does not include OEWS wage data**

The BLS Public Data API (timeseries) is designed for time-series data like employment statistics, not cross-sectional wage data from OEWS.

### What We Tried

- Multiple series ID formats
- Different SOC code formats (6-digit, 8-digit)
- Various API endpoints
- All returned "Series does not exist"

### Alternative API Approaches

**Option D1: BLS OEWS API (If Available)**

BLS may have a separate OEWS API endpoint. Check:
- https://www.bls.gov/developers/
- BLS developer documentation
- Contact BLS support: https://www.bls.gov/bls/contact.htm

**Option D2: Web Scraping (Not Recommended)**

- Against BLS terms of service
- Fragile (breaks when website changes)
- Legal concerns

**Option D3: Use BLS Data Files**

- Download structured data files
- Parse programmatically
- More reliable than API

---

## Quick Start for Testing

To quickly test with your niece, add wage data for just a few key occupations:

1. **Forensic Psychology related:**
   - 19-3032.00 - Industrial-Organizational Psychologists
   - 19-3031.00 - Clinical and Counseling Psychologists
   - 19-3039.00 - Psychologists, All Other

2. **Add to CSV:**
   ```csv
   19-3032.00,Industrial-Organizational Psychologists,50000,65000,85000,110000,140000,BLS OEWS 2024 - National,2024
   ```

3. **Run conversion:**
   ```bash
   node convert_bls_excel_to_json.js
   ```

4. **Test in assessment**

---

## Data Format Reference

### JSON Structure

Each occupation in `occupations_all.json` can have:

```json
{
  "onet_code": "19-3032.00",
  "title": "Industrial-Organizational Psychologists",
  "description": "...",
  "domain_vectors": {...},
  "wageP10": 50000,
  "wageP25": 65000,
  "wageMedian": 85000,
  "wageP75": 110000,
  "wageP90": 140000,
  "wageDataSource": "BLS OEWS 2024 - National",
  "wageDataYear": "2024"
}
```

### CSV Format

```csv
onet_code,occupation_title,annual_10th,annual_25th,annual_median,annual_75th,annual_90th,data_source,data_year
```

**Important:**
- Numbers only (no $ or commas)
- Median is required
- Other percentiles are optional

---

## BLS Attribution

The assessment automatically displays:
> "Wage data from U.S. Bureau of Labor Statistics, Occupational Employment and Wage Statistics (OEWS)"

This is required per BLS usage terms.

---

## Troubleshooting

**Q: CSV conversion script says "No wage data found"?**
- A: Make sure you filled in the `annual_median` column (required)

**Q: Numbers have dollar signs or commas?**
- A: Remove them - CSV should have numbers only like "85000" not "$85,000"

**Q: Occupation not found in JSON?**
- A: Check that the O*NET code matches exactly (including dashes and .00)

**Q: Want to add more occupations?**
- A: Just add more rows to the CSV and run the conversion script again

---

## Files

- `import_bls_from_excel.js` - NEW automated importer that reads the official BLS Excel download
- `generate_bls_links.js` - Helper to build a CSV with direct BLS links (manual workflow helper)
- `BLS_WAGE_DATA_TEMPLATE.csv` - Template for manual data entry
- `convert_bls_excel_to_json.js` - Manual CSV-to-JSON conversion script
- `fetch_wages_from_bls.js` - API script (not currently working)
- `occupations_all.json` - Target file (updated by conversion script)

---

## Next Steps

1. **For quick testing:** Add 5-10 key occupations manually
2. **For full dataset:** Download BLS Excel and convert
3. **For production:** Set up annual data update process

---

## Resources

- **BLS OEWS Home:** https://www.bls.gov/oes/
- **BLS Data Tool:** https://data.bls.gov/oes/#/home
- **BLS Tables:** https://www.bls.gov/oes/tables.htm
- **BLS API Docs:** https://www.bls.gov/developers/
- **BLS Contact:** https://www.bls.gov/bls/contact.htm

