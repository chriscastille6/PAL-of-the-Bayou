#!/usr/bin/env node
// /Users/ccastille/Documents/GitHub/website/static/assessments/people-analytics-fit/generate_bls_links.js
// Generates a CSV with direct BLS links for easy manual data entry
// RELEVANT FILES: occupations_all.json, BLS_WAGE_DATA_TEMPLATE.csv

const fs = require('fs');
const path = require('path');

const OCCUPATIONS_FILE = path.join(__dirname, 'occupations_all.json');
const OUTPUT_CSV = path.join(__dirname, 'BLS_WAGE_DATA_TEMPLATE.csv');

console.log('🔗 Generating BLS links for wage data collection...\n');

// Load occupations
if (!fs.existsSync(OCCUPATIONS_FILE)) {
    console.error(`❌ Error: ${OCCUPATIONS_FILE} not found!`);
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(OCCUPATIONS_FILE, 'utf8'));
const occupations = data.occupations || [];

// Filter to occupations without wage data
const needsData = occupations.filter(o => !o.wageMedian);

console.log(`📋 Found ${needsData.length} occupations needing wage data`);
console.log(`   (${occupations.length - needsData.length} already have data)\n`);

if (needsData.length === 0) {
    console.log('✅ All occupations already have wage data!');
    process.exit(0);
}

// Generate CSV with BLS links
let csvContent = 'onet_code,occupation_title,annual_10th,annual_25th,annual_median,annual_75th,annual_90th,data_source,data_year,bls_link\n';

needsData.forEach(occ => {
    // Convert O*NET code to BLS format
    const socCode = occ.onet_code.replace(/[-\.]/g, '').substring(0, 6);
    const blsLink = `https://www.bls.gov/oes/current/oes${socCode}.htm`;
    const blsDataTool = `https://data.bls.gov/oes/#/home (Search: ${socCode.substring(0, 2)}-${socCode.substring(2)})`;
    
    csvContent += `${occ.onet_code},"${occ.title}",,,,,,BLS OEWS 2024 - National,2024,${blsLink}\n`;
});

fs.writeFileSync(OUTPUT_CSV, csvContent);

console.log(`✅ Generated CSV with ${needsData.length} occupations`);
console.log(`   File: ${OUTPUT_CSV}\n`);

console.log('📝 Instructions:');
console.log('   1. Open the CSV file in Excel or Google Sheets');
console.log('   2. Click on the BLS link in the last column for each occupation');
console.log('   3. Find the "Percentile wage estimates" table');
console.log('   4. Copy the ANNUAL wage values (10th, 25th, median, 75th, 90th)');
console.log('   5. Paste into the corresponding columns (remove $ and commas)');
console.log('   6. Save the CSV');
console.log('   7. Run: node convert_bls_excel_to_json.js\n');

console.log('💡 Quick Start (Psychology occupations):');
const psychOccupations = needsData.filter(o => 
    o.onet_code.includes('19-303') || 
    o.onet_code.includes('21-101')
).slice(0, 5);

if (psychOccupations.length > 0) {
    console.log('   Start with these:');
    psychOccupations.forEach(occ => {
        const socCode = occ.onet_code.replace(/[-\.]/g, '').substring(0, 6);
        console.log(`   - ${occ.title}: https://www.bls.gov/oes/current/oes${socCode}.htm`);
    });
}

