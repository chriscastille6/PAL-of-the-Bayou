#!/usr/bin/env node
// /Users/ccastille/Documents/GitHub/website/static/assessments/people-analytics-fit/fetch_wages_from_bls.js
// Script to fetch wage data from BLS OEWS API and add to occupations_all.json
// BLS provides national wage data via their public API
// RELEVANT FILES: occupations_all.json, index.html

const fs = require('fs');
const path = require('path');
const https = require('https');

const BLS_API_BASE_URL = 'https://api.bls.gov/publicAPI/v2/timeseries/data';
// BLS API key (register at https://data.bls.gov/registrationEngine/)
// Using existing API key from managerial-fit-assessment
const BLS_API_KEY = '13db5dcf8fde4616ba43649ae4bcb236';

const OCCUPATIONS_FILE = path.join(__dirname, 'occupations_all.json');
const DELAY_MS = 1200; // Delay between API calls (BLS rate limit: 10 per 10 seconds unregistered)

const DATA_TYPES = {
    ANNUAL_10TH_PERCENTILE: '04',
    ANNUAL_25TH_PERCENTILE: '05',
    ANNUAL_MEDIAN: '03',
    ANNUAL_75TH_PERCENTILE: '06',
    ANNUAL_90TH_PERCENTILE: '07',
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Build BLS series ID for national wage data
 * Format: OEUN000000000[SOC8][DataType]
 * Uses full 8-digit SOC code (removes dashes and dots)
 * Example: 19-3032.00 -> 19303200 -> OEUN0000000001930320003
 */
function buildNationalSeriesId(onetCode, dataType) {
    // Remove dashes and dots to get 8-digit SOC code
    const socCode = onetCode.replace(/[-\.]/g, '');
    return `OEUN000000000${socCode}${dataType}`;
}

/**
 * Fetch wage data from BLS OEWS API for national data
 */
function fetchBLSWages(onetCode) {
    return new Promise((resolve) => {
        const seriesIds = [
            buildNationalSeriesId(onetCode, DATA_TYPES.ANNUAL_10TH_PERCENTILE),
            buildNationalSeriesId(onetCode, DATA_TYPES.ANNUAL_25TH_PERCENTILE),
            buildNationalSeriesId(onetCode, DATA_TYPES.ANNUAL_MEDIAN),
            buildNationalSeriesId(onetCode, DATA_TYPES.ANNUAL_75TH_PERCENTILE),
            buildNationalSeriesId(onetCode, DATA_TYPES.ANNUAL_90TH_PERCENTILE),
        ];

        const requestBody = {
            seriesid: seriesIds,
            registrationkey: BLS_API_KEY,
            startyear: '2023',
            endyear: '2024',
        };

        const postData = JSON.stringify(requestBody);

        const options = {
            hostname: 'api.bls.gov',
            path: '/publicAPI/v2/timeseries/data',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode !== 200) {
                    console.error(`  ❌ HTTP error for ${onetCode}: ${res.statusCode}`);
                    resolve(null);
                    return;
                }

                try {
                    const jsonData = JSON.parse(data);

                    if (jsonData.status !== 'REQUEST_SUCCEEDED') {
                        if (jsonData.message && jsonData.message[0] && jsonData.message[0].includes('not found')) {
                            console.log(`  ⚠️  No BLS data found for ${onetCode}`);
                        } else {
                            console.error(`  ❌ BLS API error for ${onetCode}:`, jsonData.message);
                        }
                        resolve(null);
                        return;
                    }

                    // Parse wage data from response
                    const wageData = {};
                    const results = jsonData.Results.series || [];

                    for (const series of results) {
                        if (!series.data || series.data.length === 0) continue;
                        
                        // Get most recent value (first in array is latest)
                        const latestData = series.data[0];
                        const value = parseFloat(latestData.value);
                        const year = latestData.year;
                        
                        if (isNaN(value)) continue;

                        // Determine which percentile based on series ID
                        if (series.seriesID.includes(DATA_TYPES.ANNUAL_10TH_PERCENTILE)) {
                            wageData.wageP10 = Math.round(value);
                        } else if (series.seriesID.includes(DATA_TYPES.ANNUAL_25TH_PERCENTILE)) {
                            wageData.wageP25 = Math.round(value);
                        } else if (series.seriesID.includes(DATA_TYPES.ANNUAL_MEDIAN)) {
                            wageData.wageMedian = Math.round(value);
                            wageData.year = year;
                        } else if (series.seriesID.includes(DATA_TYPES.ANNUAL_75TH_PERCENTILE)) {
                            wageData.wageP75 = Math.round(value);
                        } else if (series.seriesID.includes(DATA_TYPES.ANNUAL_90TH_PERCENTILE)) {
                            wageData.wageP90 = Math.round(value);
                        }
                    }

                    if (wageData.wageMedian) {
                        wageData.wageDataSource = 'BLS OEWS - National';
                        wageData.wageDataYear = '2024';
                        resolve(wageData);
                    } else {
                        resolve(null);
                    }
                } catch (error) {
                    console.error(`  ❌ Error parsing BLS response for ${onetCode}:`, error.message);
                    resolve(null);
                }
            });
        });

        req.on('error', (error) => {
            console.error(`  ❌ Network error for ${onetCode}:`, error.message);
            resolve(null);
        });

        req.write(postData);
        req.end();
    });
}

/**
 * Main function to update occupations with wage data
 */
async function updateOccupationsWithWages() {
    console.log('💰 Fetching wage data from BLS OEWS API (National)...\n');
    console.log('⚠️  WARNING: BLS timeseries API may not include OEWS wage data\n');
    console.log('   If this script fails, use Option C: Download BLS Excel/CSV data\n');
    console.log('   See BLS_DATA_GUIDE.md for instructions\n');
    
    if (!BLS_API_KEY) {
        console.log('💡 Tip: Register at https://data.bls.gov/registrationEngine/ for higher rate limits\n');
    }
    
    // Load occupations file
    if (!fs.existsSync(OCCUPATIONS_FILE)) {
        console.error(`❌ Error: ${OCCUPATIONS_FILE} not found!`);
        process.exit(1);
    }
    
    const fileContent = fs.readFileSync(OCCUPATIONS_FILE, 'utf8');
    const data = JSON.parse(fileContent);
    const occupations = data.occupations || [];
    
    console.log(`📋 Found ${occupations.length} occupations to update\n`);
    
    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;
    
    // Process each occupation
    for (let i = 0; i < occupations.length; i++) {
        const occ = occupations[i];
        const onetCode = occ.onet_code;
        
        // Skip if already has wage data
        if (occ.wageMedian) {
            console.log(`⏭️  [${i + 1}/${occupations.length}] ${occ.title} - Already has wage data`);
            skipCount++;
            continue;
        }
        
        console.log(`🔍 [${i + 1}/${occupations.length}] Fetching BLS wages for ${occ.title} (${onetCode})...`);
        
        const wageData = await fetchBLSWages(onetCode);
        
        if (wageData && wageData.wageMedian) {
            // Add wage data to occupation
            Object.assign(occ, wageData);
            successCount++;
            console.log(`  ✅ Updated: Median = $${wageData.wageMedian.toLocaleString()}`);
        } else {
            failCount++;
        }
        
        // Respect rate limits (10 per 10 seconds without key, 25 per 10 seconds with key)
        if (i < occupations.length - 1) {
            await delay(DELAY_MS);
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
    
    // Save updated file
    fs.writeFileSync(OCCUPATIONS_FILE, JSON.stringify(data, null, 2));
    
    console.log('\n✅ Wage data update complete!');
    console.log(`   Success: ${successCount} occupations`);
    console.log(`   Skipped: ${skipCount} occupations (already had data)`);
    console.log(`   Failed: ${failCount} occupations (no data available)`);
    console.log(`   Output: ${OCCUPATIONS_FILE}`);
    
    if (successCount === 0 && failCount > 0) {
        console.log('\n⚠️  No wage data was retrieved from BLS API.');
        console.log('   This is expected - BLS timeseries API does not include OEWS wage data.');
        console.log('\n💡 Recommended: Use Option C (Download BLS Excel/CSV)');
        console.log('   See BLS_DATA_GUIDE.md for detailed instructions');
        console.log('   Or use convert_bls_excel_to_json.js to convert manual data');
    } else {
        console.log('\n📊 Wage data is now available in the assessment!');
    }
}

// Run the script
updateOccupationsWithWages().catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
});

