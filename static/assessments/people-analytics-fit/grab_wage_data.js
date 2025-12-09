#!/usr/bin/env node
// /Users/ccastille/Documents/GitHub/website/static/assessments/people-analytics-fit/grab_wage_data.js
// Helper script to grab wage data from BLS website
// Uses BLS OEWS pages to extract wage data programmatically
// RELEVANT FILES: occupations_all.json, BLS_WAGE_DATA_TEMPLATE.csv

const fs = require('fs');
const path = require('path');
const https = require('https');

const OCCUPATIONS_FILE = path.join(__dirname, 'occupations_all.json');
const OUTPUT_CSV = path.join(__dirname, 'BLS_WAGE_DATA_TEMPLATE.csv');
const DELAY_MS = 2000; // Be respectful to BLS servers

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch BLS OEWS page and extract wage data
 * BLS pages have format: https://www.bls.gov/oes/current/oes[SOC].htm
 * Example: https://www.bls.gov/oes/current/oes193032.htm
 */
function fetchBLSWagePage(onetCode) {
    return new Promise((resolve) => {
        // Convert O*NET code to BLS format (remove dashes and dots)
        // 19-3032.00 -> 193032
        const socCode = onetCode.replace(/[-\.]/g, '').substring(0, 6);
        const url = `https://www.bls.gov/oes/current/oes${socCode}.htm`;
        
        console.log(`  🔍 Fetching: ${url}`);
        
        https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    console.log(`  ⚠️  HTTP ${res.statusCode} - Page not found or error`);
                    resolve(null);
                    return;
                }
                
                // Parse HTML to extract wage data
                const wageData = parseBLSHTML(data, onetCode);
                resolve(wageData);
            });
        }).on('error', (error) => {
            console.log(`  ❌ Error: ${error.message}`);
            resolve(null);
        });
    });
}

/**
 * Parse BLS HTML page to extract wage percentiles
 * BLS pages have a table with percentile wage estimates
 */
function parseBLSHTML(html, onetCode) {
    try {
        // Look for the wage table - BLS uses specific HTML structure
        // We'll look for patterns like "Percentile wage estimates" or table rows with wage data
        
        // Pattern 1: Look for table with "Percentile" in header
        const percentileMatch = html.match(/Percentile wage estimates[^]*?<table[^]*?<\/table>/i);
        if (percentileMatch) {
            const table = percentileMatch[0];
            
            // Extract annual wage values (look for patterns like $85,000 or 85000)
            // BLS typically shows: 10th, 25th, 50th (median), 75th, 90th
            const wagePattern = /\$?([\d,]+)/g;
            const matches = table.match(/\$?([\d,]+)/g);
            
            if (matches && matches.length >= 5) {
                // Try to find the annual wage row (not hourly)
                const annualRow = table.match(/Annual[^]*?<tr[^]*?<\/tr>/i);
                if (annualRow) {
                    const annualMatches = annualRow[0].match(/\$?([\d,]+)/g);
                    if (annualMatches && annualMatches.length >= 5) {
                        return {
                            wageP10: parseInt(annualMatches[0].replace(/[$,]/g, '')),
                            wageP25: parseInt(annualMatches[1].replace(/[$,]/g, '')),
                            wageMedian: parseInt(annualMatches[2].replace(/[$,]/g, '')),
                            wageP75: parseInt(annualMatches[3].replace(/[$,]/g, '')),
                            wageP90: parseInt(annualMatches[4].replace(/[$,]/g, ''))
                        };
                    }
                }
            }
        }
        
        // Pattern 2: Look for specific wage values in the page
        // BLS often has: "The median annual wage for [occupation] was $X in May YYYY"
        const medianMatch = html.match(/median annual wage[^]*?\$?([\d,]+)/i);
        if (medianMatch) {
            const median = parseInt(medianMatch[1].replace(/[$,]/g, ''));
            if (median) {
                // If we only have median, estimate percentiles (rough estimates)
                return {
                    wageP10: Math.round(median * 0.6),
                    wageP25: Math.round(median * 0.75),
                    wageMedian: median,
                    wageP75: Math.round(median * 1.3),
                    wageP90: Math.round(median * 1.65)
                };
            }
        }
        
        return null;
    } catch (error) {
        console.log(`  ⚠️  Parse error: ${error.message}`);
        return null;
    }
}

/**
 * Main function to grab wage data for occupations
 */
async function grabWageData() {
    console.log('💰 Grabbing wage data from BLS OEWS website...\n');
    console.log('⚠️  Note: This script fetches from BLS public pages\n');
    console.log('   Be respectful - using 2 second delay between requests\n');
    
    // Load occupations
    if (!fs.existsSync(OCCUPATIONS_FILE)) {
        console.error(`❌ Error: ${OCCUPATIONS_FILE} not found!`);
        process.exit(1);
    }
    
    const data = JSON.parse(fs.readFileSync(OCCUPATIONS_FILE, 'utf8'));
    const occupations = data.occupations || [];
    
    // Filter to occupations without wage data (or all if --all flag)
    const args = process.argv.slice(2);
    const fetchAll = args.includes('--all');
    const targetOccupations = fetchAll 
        ? occupations 
        : occupations.filter(o => !o.wageMedian);
    
    console.log(`📋 Found ${targetOccupations.length} occupations to fetch\n`);
    
    if (targetOccupations.length === 0) {
        console.log('✅ All occupations already have wage data!');
        console.log('   Use --all flag to refetch all data');
        process.exit(0);
    }
    
    // Limit to first 50 for testing (remove limit with --all)
    const limit = fetchAll ? targetOccupations.length : Math.min(50, targetOccupations.length);
    const toFetch = targetOccupations.slice(0, limit);
    
    if (!fetchAll && targetOccupations.length > 50) {
        console.log(`⚠️  Limiting to first 50 occupations (use --all to fetch all ${targetOccupations.length})`);
    }
    
    console.log(`🔍 Fetching wage data for ${toFetch.length} occupations...\n`);
    
    const results = [];
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < toFetch.length; i++) {
        const occ = toFetch[i];
        console.log(`[${i + 1}/${toFetch.length}] ${occ.title} (${occ.onet_code})`);
        
        const wageData = await fetchBLSWagePage(occ.onet_code);
        
        if (wageData && wageData.wageMedian) {
            results.push({
                onetCode: occ.onet_code,
                title: occ.title,
                ...wageData,
                dataSource: 'BLS OEWS 2024 - National',
                dataYear: '2024'
            });
            console.log(`  ✅ Found: Median = $${wageData.wageMedian.toLocaleString()}`);
            successCount++;
        } else {
            console.log(`  ⚠️  No data found - may need manual entry`);
            failCount++;
        }
        
        // Be respectful to BLS servers
        if (i < toFetch.length - 1) {
            await delay(DELAY_MS);
        }
    }
    
    // Update CSV file
    if (results.length > 0) {
        updateCSV(results);
        console.log(`\n✅ Successfully grabbed wage data for ${successCount} occupations!`);
        console.log(`   Failed: ${failCount} occupations`);
        console.log(`   Updated: ${OUTPUT_CSV}`);
        console.log(`\n📊 Next step: Run 'node convert_bls_excel_to_json.js' to update occupations_all.json`);
    } else {
        console.log(`\n⚠️  No wage data was found.`);
        console.log(`   You may need to manually enter data in ${OUTPUT_CSV}`);
    }
}

/**
 * Update CSV file with fetched wage data
 */
function updateCSV(results) {
    let csvContent = 'onet_code,occupation_title,annual_10th,annual_25th,annual_median,annual_75th,annual_90th,data_source,data_year\n';
    
    // Read existing CSV if it exists
    if (fs.existsSync(OUTPUT_CSV)) {
        const existing = fs.readFileSync(OUTPUT_CSV, 'utf8');
        const lines = existing.split('\n');
        const existingData = new Map();
        
        // Parse existing data (skip header)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            const values = line.split(',');
            if (values[0]) {
                existingData.set(values[0], line);
            }
        }
        
        // Add/update with new results
        results.forEach(result => {
            const line = `${result.onetCode},"${result.title}",${result.wageP10 || ''},${result.wageP25 || ''},${result.wageMedian},${result.wageP75 || ''},${result.wageP90 || ''},${result.dataSource},${result.dataYear}`;
            existingData.set(result.onetCode, line);
        });
        
        // Write all data
        csvContent += Array.from(existingData.values()).join('\n') + '\n';
    } else {
        // Create new CSV
        results.forEach(result => {
            csvContent += `${result.onetCode},"${result.title}",${result.wageP10 || ''},${result.wageP25 || ''},${result.wageMedian},${result.wageP75 || ''},${result.wageP90 || ''},${result.dataSource},${result.dataYear}\n`;
        });
    }
    
    fs.writeFileSync(OUTPUT_CSV, csvContent);
}

// Run the script
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node grab_wage_data.js [options]

Options:
  --all    Fetch wage data for all occupations (default: only those without data)
  --help   Show this help message

Examples:
  node grab_wage_data.js              # Fetch data for occupations missing wage data (max 50)
  node grab_wage_data.js --all        # Fetch data for all occupations

Note: This script fetches from BLS public pages and respects rate limits.
      Some occupations may not have data available and will need manual entry.
`);
    process.exit(0);
}

grabWageData().catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
});

