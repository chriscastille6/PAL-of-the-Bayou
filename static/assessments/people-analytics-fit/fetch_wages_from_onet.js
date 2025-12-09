#!/usr/bin/env node
// /Users/ccastille/Documents/GitHub/website/static/assessments/people-analytics-fit/fetch_wages_from_onet.js
// Script to fetch wage data from O*NET API and add to occupations_all.json
// O*NET provides national wage data via their Web Services API
// RELEVANT FILES: occupations_all.json, index.html

const fs = require('fs');
const path = require('path');
const https = require('https');

const ONET_BASE_URL = 'https://services.onetcenter.org/ws/online';
const CLIENT_ID = 'cmcastille_netlify';

const OCCUPATIONS_FILE = path.join(__dirname, 'occupations_all.json');
const DELAY_MS = 200; // Delay between API calls to respect rate limits

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch wage and employment data from O*NET API
 */
function fetchONetWages(onetCode) {
    return new Promise((resolve, reject) => {
        const url = `${ONET_BASE_URL}/occupations/${onetCode}/wages_and_employment?client=${CLIENT_ID}`;
        const urlObj = new URL(url);
        
        const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: 'GET',
            headers: {
                'User-Agent': 'Node.js O*NET Wage Fetcher'
            }
        };
        
        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 404) {
                    console.log(`  ⚠️  No data found for ${onetCode}`);
                    resolve(null);
                    return;
                }
                
                if (res.statusCode !== 200) {
                    console.error(`  ❌ API error for ${onetCode}: ${res.statusCode}`);
                    resolve(null);
                    return;
                }
                
                try {
                    const jsonData = JSON.parse(data);
                    
                    // Extract wage data
                    if (jsonData.national_wages) {
                        resolve({
                            wageMedian: jsonData.national_wages.annual_median || null,
                            wageP10: jsonData.national_wages.annual_10th_percentile || null,
                            wageP25: jsonData.national_wages.annual_25th_percentile || null,
                            wageP75: jsonData.national_wages.annual_75th_percentile || null,
                            wageP90: jsonData.national_wages.annual_90th_percentile || null,
                            wageDataSource: 'O*NET Web Services - National',
                            wageDataYear: new Date().getFullYear().toString()
                        });
                    } else {
                        resolve(null);
                    }
                } catch (error) {
                    console.error(`  ❌ Error parsing response for ${onetCode}:`, error.message);
                    resolve(null);
                }
            });
        });
        
        req.on('error', (error) => {
            console.error(`  ❌ Error fetching ${onetCode}:`, error.message);
            resolve(null);
        });
        
        req.end();
    });
}

/**
 * Main function to update occupations with wage data
 */
async function updateOccupationsWithWages() {
    console.log('💰 Fetching wage data from O*NET Web Services API...\n');
    
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
        
        console.log(`🔍 [${i + 1}/${occupations.length}] Fetching wages for ${occ.title} (${onetCode})...`);
        
        const wageData = await fetchONetWages(onetCode);
        
        if (wageData && wageData.wageMedian) {
            // Add wage data to occupation
            Object.assign(occ, wageData);
            successCount++;
            console.log(`  ✅ Updated: Median = $${wageData.wageMedian.toLocaleString()}`);
        } else {
            failCount++;
            console.log(`  ⚠️  No wage data available`);
        }
        
        // Respect rate limits
        if (i < occupations.length - 1) {
            await delay(DELAY_MS);
        }
    }
    
    // Update metadata
    data.metadata.last_wage_update = new Date().toISOString().split('T')[0];
    data.metadata.wage_data_source = 'O*NET Web Services API';
    data.metadata.note = data.metadata.note || '';
    if (!data.metadata.note.includes('Wage data')) {
        data.metadata.note += (data.metadata.note ? '; ' : '') + 'Wage data from O*NET Web Services (national wages)';
    }
    
    // Save updated file
    fs.writeFileSync(OCCUPATIONS_FILE, JSON.stringify(data, null, 2));
    
    console.log('\n✅ Wage data update complete!');
    console.log(`   Success: ${successCount} occupations`);
    console.log(`   Skipped: ${skipCount} occupations (already had data)`);
    console.log(`   Failed: ${failCount} occupations (no data available)`);
    console.log(`   Output: ${OCCUPATIONS_FILE}`);
    console.log('\n📊 Wage data is now available in the assessment!');
}

// Run the script
updateOccupationsWithWages().catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
});

