# Quick Start: Getting Wage Data

## Fastest Method: Import the Excel File Automatically

1. Download the national OEWS dataset from BLS (already in `~/Downloads/oesm23nat`)
2. Copy it into the project:
   ```bash
   cd "/Users/ccastille/Documents/GitHub/website/static/assessments/people-analytics-fit"
   mkdir -p data
   cp -R ~/Downloads/oesm23nat ./data/
   ```
3. Install dependencies (one-time): `npm install`
4. Run the importer:
   ```bash
   node import_bls_from_excel.js
   ```
5. Open the assessment and verify the Income section. Done!

---

## Manual Backup: Use BLS Links If Needed

### Step 1: Generate CSV with BLS Links

```bash
cd "/Users/ccastille/Documents/GitHub/website/static/assessments/people-analytics-fit"
node generate_bls_links.js
```

This creates `BLS_WAGE_DATA_TEMPLATE.csv` with direct links to BLS pages for each occupation.

### Step 2: Open CSV and Click Links

1. Open `BLS_WAGE_DATA_TEMPLATE.csv` in Excel or Google Sheets
2. Each row has a `bls_link` column with a direct link
3. Click the link to open the BLS page for that occupation

### Step 3: Copy Wage Data

On each BLS page:
1. Find the **"Percentile wage estimates"** table
2. Look for the **"Annual"** row (not hourly)
3. Copy these 5 values:
   - 10th percentile
   - 25th percentile
   - 50th percentile (Median) ⭐
   - 75th percentile
   - 90th percentile

### Step 4: Paste into CSV

1. Paste values into the corresponding columns
2. **Important:** Remove dollar signs and commas
   - ✅ Good: `85000`
   - ❌ Bad: `$85,000`

### Step 5: Convert to JSON

```bash
node convert_bls_excel_to_json.js
```

This updates `occupations_all.json` with the wage data.

### Step 6: Test

Open the assessment and check the Income section!

---

## Quick Test: Just 5 Psychology Occupations

For a quick test with your niece, just add data for these:

1. **Industrial-Organizational Psychologists** (19-3032.00)
   - Link: https://www.bls.gov/oes/current/oes193032.htm

2. **Clinical and Counseling Psychologists** (19-3031.00)
   - Link: https://www.bls.gov/oes/current/oes193031.htm

3. **Psychologists, All Other** (19-3039.00)
   - Link: https://www.bls.gov/oes/current/oes193039.htm

4. **Mental Health Counselors** (21-1014.00)
   - Link: https://www.bls.gov/oes/current/oes211014.htm

5. **Educational, Guidance, and Career Counselors** (21-1012.00)
   - Link: https://www.bls.gov/oes/current/oes211012.htm

Add these 5 to the CSV, convert, and you're ready to test!

---

## Alternative: BLS Data Tool

If the direct links don't work, use the BLS Data Tool:

1. Go to: https://data.bls.gov/oes/#/home
2. Select "National" for area
3. Search for occupation by SOC code (e.g., "19-3032")
4. Click "Retrieve Data"
5. Copy the annual wage percentiles

---

## Tips

- **Start small:** Add 5-10 occupations first to test
- **Focus on key occupations:** Add the ones your niece is interested in
- **Median is required:** Other percentiles are optional but recommended
- **Numbers only:** No $ or commas in CSV
- **Save frequently:** Don't lose your work!

---

## Need Help?

- See `BLS_DATA_GUIDE.md` for detailed instructions
- Check `BLS_WAGE_DATA_TEMPLATE.csv` for the template format

