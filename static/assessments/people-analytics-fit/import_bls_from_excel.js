#!/usr/bin/env node
// /Users/ccastille/Documents/GitHub/website/static/assessments/people-analytics-fit/import_bls_from_excel.js
// Imports BLS OEWS wage data from the official Excel download into occupations_all.json
// This script exists to automate salary integration without manual data entry
// RELEVANT FILES: data/oesm23nat/national_M2023_dl.xlsx, occupations_all.json, BLS_WAGE_DATA_TEMPLATE.csv

const fs = require('fs')
const path = require('path')
const XLSX = require('xlsx')

const BLS_EXCEL_PATH = path.join(__dirname, 'data/oesm23nat/national_M2023_dl.xlsx')
const OCCUPATIONS_FILE = path.join(__dirname, 'occupations_all.json')

if (!fs.existsSync(BLS_EXCEL_PATH)) {
  console.error(`❌ BLS Excel file not found at ${BLS_EXCEL_PATH}`)
  console.error('   Make sure you copied the OEWS download into data/oesm23nat')
  process.exit(1)
}

if (!fs.existsSync(OCCUPATIONS_FILE)) {
  console.error(`❌ occupations_all.json not found at ${OCCUPATIONS_FILE}`)
  process.exit(1)
}

console.log('💰 Importing BLS OEWS wage data from Excel...')
console.log(`   Source: ${BLS_EXCEL_PATH}`)

const workbook = XLSX.readFile(BLS_EXCEL_PATH)
const worksheet = workbook.Sheets[workbook.SheetNames[0]]
const rows = XLSX.utils.sheet_to_json(worksheet, { defval: null })

const wageMap = new Map()

const sanitize = value => {
  if (value === null || value === undefined) return null
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed === '' || trimmed === '#' || trimmed === '**') return null
    const numeric = Number(trimmed.replace(/[$,]/g, ''))
    return Number.isNaN(numeric) ? null : Math.round(numeric)
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? Math.round(value) : null
  }
  return null
}

rows.forEach(row => {
  if (row.AREA !== '99') return // National data only
  if (row.NAICS !== '000000') return // Cross-industry totals
  if (row.O_GROUP !== 'detailed') return // Detailed occupations map to O*NET codes

  const occCode = typeof row.OCC_CODE === 'string' ? row.OCC_CODE.trim() : ''
  if (!occCode) return

  const normalizedCode = occCode.includes('.') ? occCode : `${occCode}.00`

  const wageEntry = {
    wageP10: sanitize(row.A_PCT10),
    wageP25: sanitize(row.A_PCT25),
    wageMedian: sanitize(row.A_MEDIAN),
    wageP75: sanitize(row.A_PCT75),
    wageP90: sanitize(row.A_PCT90),
    wageDataSource: 'BLS OEWS 2023 - National',
    wageDataYear: '2023'
  }

  if (wageEntry.wageMedian) {
    wageMap.set(normalizedCode, wageEntry)
  }
})

console.log(`   Loaded wage data for ${wageMap.size} SOC codes`)

const occupationsData = JSON.parse(fs.readFileSync(OCCUPATIONS_FILE, 'utf8'))
const occupations = occupationsData.occupations || []

let updatedCount = 0
let missingCodes = []

occupations.forEach(occupation => {
  const code = occupation.onet_code
  const wageData = wageMap.get(code) || wageMap.get(code.replace('.00', ''))

  if (wageData) {
    Object.assign(occupation, wageData)
    updatedCount++
  } else {
    missingCodes.push(code)
  }
})

occupationsData.metadata = occupationsData.metadata || {}
occupationsData.metadata.last_wage_update = new Date().toISOString().split('T')[0]
occupationsData.metadata.wage_data_source = 'BLS OEWS 2023 - National'
occupationsData.metadata.note = `${occupationsData.metadata.note || ''}`.split('; ')
  .filter(Boolean)
  .filter(entry => !entry.startsWith('Wage data from BLS'))
  .join('; ')

if (occupationsData.metadata.note) {
  occupationsData.metadata.note += '; '
}
occupationsData.metadata.note = (occupationsData.metadata.note || '') + 'Wage data from BLS OEWS (national wages)'

fs.writeFileSync(OCCUPATIONS_FILE, JSON.stringify(occupationsData, null, 2))

console.log(`✅ Updated wage data for ${updatedCount} occupations`)
console.log(`⚠️  Missing wage data for ${missingCodes.length} occupations`)

if (missingCodes.length) {
  const sample = missingCodes.slice(0, 10).join(', ')
  console.log(`   Sample missing codes: ${sample}${missingCodes.length > 10 ? ', ...' : ''}`)
  console.log('   These may be military occupations or codes not covered by OEWS')
}

console.log(`   Output: ${OCCUPATIONS_FILE}`)
console.log('\n📊 Wage data import complete!')
