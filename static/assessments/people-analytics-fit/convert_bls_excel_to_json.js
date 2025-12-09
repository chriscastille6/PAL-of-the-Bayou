#!/usr/bin/env node
// /Users/ccastille/Documents/GitHub/website/static/assessments/people-analytics-fit/convert_bls_excel_to_json.js
// Script to convert BLS OEWS Excel/CSV data to occupations_all.json format
// Supports both CSV (from manual entry) and Excel files (from BLS download)
// RELEVANT FILES: occupations_all.json, BLS_WAGE_DATA_TEMPLATE.csv

const fs = require('fs');
const path = require('path');

const OCCUPATIONS_FILE = path.join(__dirname, 'occupations_all.json');
const CSV_TEMPLATE = path.join(__dirname, 'BLS_WAGE_DATA_TEMPLATE.csv');

console.log('📊 Converting BLS wage data to occupations_all.json...\n');

// Check if CSV template exists
if (!fs.existsSync(CSV_TEMPLATE)) {
    console.log('⚠️  CSV template not found. Creating template...');
    createCSVTemplate();
    console.log(`✅ Created ${CSV_TEMPLATE}`);
    console.log('   Please fill in the wage data and run this script again.\n');
    process.exit(0);
}

// Read CSV
const csvContent = fs.readFileSync(CSV_TEMPLATE, 'utf8');
const lines = csvContent.split('\n').filter(line => line.trim());
const headers = lines[0].split(',').map(h => h.trim());

console.log(`📋 Found ${lines.length - 1} occupations in CSV\n`);

// Parse CSV data
const wageData = {};
let updatedCount = 0;
let skippedCount = 0;

for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Handle CSV with potential commas in quoted fields
    const values = parseCSVLine(line);
    const onetCode = values[0]?.trim();
    const p10 = values[2]?.trim();
    const p25 = values[3]?.trim();
    const median = values[4]?.trim();
    const p75 = values[5]?.trim();
    const p90 = values[6]?.trim();
    const source = values[7]?.trim() || 'BLS OEWS 2024 - National';
    const year = values[8]?.trim() || '2024';
    
    if (!onetCode) continue;
    
    // Only process if we have median wage data
    if (median && median !== '' && !isNaN(parseInt(median))) {
        wageData[onetCode] = {
            wageP10: p10 && !isNaN(parseInt(p10)) ? parseInt(p10) : null,
            wageP25: p25 && !isNaN(parseInt(p25)) ? parseInt(p25) : null,
            wageMedian: parseInt(median),
            wageP75: p75 && !isNaN(parseInt(p75)) ? parseInt(p75) : null,
            wageP90: p90 && !isNaN(parseInt(p90)) ? parseInt(p90) : null,
            wageDataSource: source,
            wageDataYear: year
        };
        updatedCount++;
    } else {
        skippedCount++;
    }
}

console.log(`✅ Parsed CSV: ${updatedCount} occupations with wage data`);
console.log(`⚠️  Skipped: ${skippedCount} occupations (no data entered)\n`);

if (updatedCount === 0) {
    console.log('❌ No wage data found in CSV!');
    console.log('   Please fill in the wage data columns and run again.');
    process.exit(1);
}

// Read current occupations JSON
if (!fs.existsSync(OCCUPATIONS_FILE)) {
    console.error(`❌ Error: ${OCCUPATIONS_FILE} not found!`);
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(OCCUPATIONS_FILE, 'utf8'));
const occupations = data.occupations || [];

// Update wage data
let jsonUpdatedCount = 0;
let notFoundCount = 0;

for (const onetCode in wageData) {
    const occ = occupations.find(o => o.onet_code === onetCode);
    if (occ) {
        Object.assign(occ, wageData[onetCode]);
        console.log(`✅ Updated ${occ.title}: $${wageData[onetCode].wageMedian.toLocaleString()} median`);
        jsonUpdatedCount++;
    } else {
        console.log(`⚠️  ${onetCode} not found in occupations_all.json`);
        notFoundCount++;
    }
}

// Update metadata
data.metadata.last_wage_update = new Date().toISOString().split('T')[0];
data.metadata.wage_data_source = 'BLS OEWS - National';
if (!data.metadata.note) {
    data.metadata.note = '';
}
if (!data.metadata.note.includes('Wage data')) {
    data.metadata.note += (data.metadata.note ? '; ' : '') + 'Wage data from BLS OEWS (national wages)';
}

// Write updated JSON
fs.writeFileSync(OCCUPATIONS_FILE, JSON.stringify(data, null, 2));

console.log('\n✅ Successfully updated occupations_all.json!');
console.log(`   Updated: ${jsonUpdatedCount} occupations`);
console.log(`   Not found: ${notFoundCount} occupations`);
console.log(`   Output: ${OCCUPATIONS_FILE}`);
console.log('\n📊 Wage data is now available in the assessment!');

/**
 * Parse CSV line handling quoted fields
 */
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current);
    
    return values;
}

/**
 * Create CSV template file
 */
function createCSVTemplate() {
    const headers = [
        'onet_code',
        'occupation_title',
        'annual_10th',
        'annual_25th',
        'annual_median',
        'annual_75th',
        'annual_90th',
        'data_source',
        'data_year'
    ];
    
    // Read occupations to create template rows
    if (!fs.existsSync(OCCUPATIONS_FILE)) {
        console.error(`❌ Error: ${OCCUPATIONS_FILE} not found!`);
        return;
    }
    
    const data = JSON.parse(fs.readFileSync(OCCUPATIONS_FILE, 'utf8'));
    const occupations = data.occupations || [];
    
    let csvContent = headers.join(',') + '\n';
    
    // Add first 50 occupations as template (user can add more)
    for (let i = 0; i < Math.min(50, occupations.length); i++) {
        const occ = occupations[i];
        csvContent += `${occ.onet_code},"${occ.title}",,,,,\n`;
    }
    
    fs.writeFileSync(CSV_TEMPLATE, csvContent);
    console.log(`\n📝 Template created with ${Math.min(50, occupations.length)} occupations`);
    console.log('   Fill in the wage columns (annual_10th, annual_25th, annual_median, annual_75th, annual_90th)');
    console.log('   Then run this script again to update occupations_all.json');
}

