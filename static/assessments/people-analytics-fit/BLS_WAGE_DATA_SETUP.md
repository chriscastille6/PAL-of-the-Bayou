# BLS Wage Data Setup Guide

## Overview

This assessment can display BLS (Bureau of Labor Statistics) wage data for occupations. The wage data fields are already integrated into the UI - you just need to populate the data.

## Current Status

✅ **UI is ready** - The assessment will automatically display BLS wage data when available in `occupations_all.json`

⚠️ **Data collection needed** - Wage data needs to be added to the JSON file

## Option 1: BLS API (Automated)

### Script Available
- **File:** `fetch_wages_from_bls.js`
- **What it does:** Attempts to fetch wage data from BLS API for all 867 occupations
- **Status:** ⚠️ BLS timeseries API may not have OEWS data available

### To Run:
```bash
cd "/Users/ccastille/Documents/GitHub/website/static/assessments/people-analytics-fit"
node fetch_wages_from_bls.js
```

### Expected Output:
- Script will attempt to fetch data for each occupation
- If successful, adds wage fields to `occupations_all.json`
- If API doesn't work, you'll see "No BLS data available" messages

## Option 2: Manual Data Entry (Recommended)

Since BLS API may not work, you can manually add wage data:

### Step 1: Get Wage Data from BLS Website

1. Go to: https://www.bls.gov/oes/
2. Click "Data Tools" → "OES Data"
3. Search for each occupation
4. Copy the wage percentiles (10th, 25th, median, 75th, 90th)

### Step 2: Add to occupations_all.json

For each occupation, add these fields:
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

### Quick Start for Your Niece

For a quick test, you can manually add wage data for just a few key occupations:

1. **Forensic Psychologists** (19-3032.00 or related)
2. **Clinical Psychologists** (19-3031.00)
3. **Counseling Psychologists** (19-3031.00)
4. Any other occupations she's interested in

## Option 3: Download BLS Excel File

1. Download OEWS data from: https://www.bls.gov/oes/tables.htm
2. Filter for national data
3. Match SOC codes to O*NET codes
4. Extract wage columns
5. Add to JSON file

## Data Format

Each occupation can have these optional fields:

- `wageP10` - 10th percentile annual wage (number)
- `wageP25` - 25th percentile annual wage (number)
- `wageMedian` - Median annual wage (number) ⭐ **Required if adding wage data**
- `wageP75` - 75th percentile annual wage (number)
- `wageP90` - 90th percentile annual wage (number)
- `wageDataSource` - Source description (string)
- `wageDataYear` - Year of data (string)

## Testing

Once you add wage data:

1. Open the assessment: http://localhost:8000/index.html
2. Select an occupation with wage data
3. Complete the assessment
4. Check the "Income" section in results
5. Should see BLS wage data displayed

## BLS Attribution

When displaying BLS data, the assessment automatically includes:
> "Wage data from U.S. Bureau of Labor Statistics, Occupational Employment and Wage Statistics (OEWS)"

## Next Steps

1. **For quick testing:** Manually add wage data for 5-10 key occupations
2. **For full dataset:** Try the BLS API script, or download BLS Excel and convert
3. **For production:** Consider automating data updates annually

## Questions?

- BLS OEWS: https://www.bls.gov/oes/
- BLS API Docs: https://www.bls.gov/developers/
- O*NET: https://www.onetcenter.org/

