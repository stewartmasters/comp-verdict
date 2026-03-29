'use strict';

/**
 * ONS ASHE (Annual Survey of Hours and Earnings) source
 *
 * DATA: Office for National Statistics, Annual Survey of Hours and Earnings.
 * Published under Open Government Licence v3.0.
 * https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours
 *
 * We use ASHE Table 14: Annual pay by 4-digit SOC occupation.
 * The table provides p25, median, p75 gross annual pay for:
 *   - All employees (full-time + part-time combined)
 *   - Split by geography: UK, London, regions
 *
 * The downloaded Excel/CSV has a tab for each pay measure.
 * We use the "Annual pay - Gross" tab.
 *
 * SOC 2010 codes relevant to CompVerdict:
 *   2135 — IT business analysts, architects and systems designers
 *   2136 — Programmers and software development professionals
 *   2137 — Web design and development professionals
 *   2139 — Information technology and telecommunications professionals NEC
 *   1136 — IT directors → Engineering Manager proxy
 *   2150 — Research and development managers → partial proxy
 *
 * Geography codes in the file:
 *   K02000001 — UK overall
 *   E12000007 — London
 *   E12000006 — East of England (Cambridge, etc.)
 *   E12000008 — South East
 *
 * Wages in GBP, annual gross.
 */

const fs   = require('fs');
const path = require('path');
const db   = require('../db');

const CACHE_DIR = path.join(__dirname, '..', 'data', 'ons');

// ONS publishes a stable URL for the latest ASHE dataset
// File is an xlsx with multiple tabs
const ASHE_URL =
  'https://www.ons.gov.uk/file?uri=/employmentandlabourmarket/peopleinwork/' +
  'earningsandworkinghours/datasets/occupation4digitsoc2010ashetable14/' +
  'current/table142024.xlsx';

const CACHE_FILE = path.join(CACHE_DIR, 'ashe_table14.xlsx');
const CACHE_TTL  = 30 * 24 * 60 * 60 * 1000; // 30 days — ONS publishes annually

// ONS SOC → CompVerdict roles
const ONS_SOC_TO_ROLES = {
  '2135': ['Software Engineer', 'Backend Engineer'],
  '2136': ['Software Engineer', 'Backend Engineer', 'Full Stack Engineer'],
  '2137': ['Frontend Engineer', 'DevOps Engineer'],
  '2139': ['Machine Learning Engineer', 'Data Scientist'],
  '1136': ['Engineering Manager'],
  '2150': ['Data Scientist'],
};

const TARGET_SOC_CODES = new Set(Object.keys(ONS_SOC_TO_ROLES));

// Geography code → CompVerdict city
const ONS_GEO_TO_CITY = {
  'K02000001': 'Remote (UK)', // UK overall → proxy for remote/national
  'E12000007': 'London',
  'E92000001': 'Remote (UK)', // England overall
};

async function downloadFile() {
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  const stat = fs.existsSync(CACHE_FILE) ? fs.statSync(CACHE_FILE) : null;
  if (stat && (Date.now() - stat.mtimeMs) < CACHE_TTL) {
    console.log(`  [ons] using cached ASHE file`);
    return CACHE_FILE;
  }

  console.log(`  [ons] downloading ASHE Table 14 from ONS...`);
  const res = await fetch(ASHE_URL, { signal: AbortSignal.timeout(60_000) });

  if (!res.ok) {
    // ONS URL pattern changes with each release — provide instructions
    console.warn(`  [ons] WARNING: download failed (${res.status})`);
    console.warn(`  [ons] The ONS URL may have changed for the latest release.`);
    console.warn(`  [ons] Visit https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/`);
    console.warn(`        earningsandworkinghours/datasets/occupation4digitsoc2010ashetable14`);
    console.warn(`  [ons] Download "table14{year}.xlsx" and place at: ${CACHE_FILE}`);
    return null;
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(CACHE_FILE, buffer);
  console.log(`  [ons] saved (${(buffer.length / 1024 / 1024).toFixed(1)} MB)`);
  return CACHE_FILE;
}

async function fetchOns() {
  const filePath = await downloadFile();
  if (!filePath || !fs.existsSync(filePath)) {
    console.warn('  [ons] skipping — no data file available');
    return [];
  }

  let xlsx;
  try { xlsx = require('xlsx'); }
  catch { console.warn('  [ons] skipping — xlsx package not installed'); return []; }

  const workbook = xlsx.readFile(filePath, { cellText: false, cellDates: false });

  // Find the gross annual pay sheet
  // Sheet names vary: "All", "Annual Pay - Gross", etc.
  const sheetNames = workbook.SheetNames;
  console.log(`  [ons] sheets: ${sheetNames.join(', ')}`);

  // ASHE Table 14 structure:
  // Row 1-4: headers
  // Row 5+: data where col A = SOC code, col B = SOC label
  //         Columns alternate: [Number, P25, Median, P75, Mean] per geography

  // We look for a sheet with "Gross" and "Annual" in the name
  const targetSheet = sheetNames.find(n =>
    /gross/i.test(n) && /annual/i.test(n)
  ) ?? sheetNames[0];

  const sheet = workbook.Sheets[targetSheet];
  if (!sheet) { console.warn(`  [ons] sheet not found`); return []; }

  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  // Find the row that contains geography labels (row with "London", "UK" etc.)
  // and the column positions for p25/median/p75
  // This is heuristic parsing since ONS changes layout occasionally
  const observations = [];
  const now = new Date().toISOString();
  const sourceVersion = new Date().getFullYear().toString();

  // Simplified: find rows where col 0 is a 4-digit number (SOC code)
  for (const row of rows) {
    const rawSoc = String(row[0] ?? '').trim();
    if (!/^\d{4}$/.test(rawSoc)) continue;
    if (!TARGET_SOC_CODES.has(rawSoc)) continue;

    const label = String(row[1] ?? '').trim();

    // Column layout (typical ASHE Table 14 for 4-digit SOC):
    // UK columns first, then London, then regions
    // Each geography block: [Count, p25, Median, p75, Mean]
    // We try columns [2,3,4] = UK p25/median/p75 and [7,8,9] = London p25/median/p75
    // These column positions are approximate; adjust if ONS changes format

    const parseVal = (v) => {
      const n = parseFloat(String(v ?? '').replace(/,/g, ''));
      return isNaN(n) || n < 1000 ? null : n;
    };

    // UK national (cols 2-4 in zero-indexed from SOC code being col 0)
    const ukP25    = parseVal(row[3]);
    const ukMedian = parseVal(row[4]);
    const ukP75    = parseVal(row[5]);

    // London (typically cols 8-10, i.e. after [Count, p25, median, p75, mean] for UK)
    const ldnP25    = parseVal(row[8]);
    const ldnMedian = parseVal(row[9]);
    const ldnP75    = parseVal(row[10]);

    if (ukMedian) {
      for (const [metric, value] of [['p25', ukP25], ['p50', ukMedian], ['p75', ukP75]]) {
        if (!value) continue;
        observations.push({
          source: 'ons', source_version: sourceVersion,
          occupation_code: rawSoc, occupation_label: label,
          geography_code: 'K02000001', geography_label: 'United Kingdom',
          metric, value, currency: 'GBP',
          period: sourceVersion, fetched_at: now,
        });
      }
    }

    if (ldnMedian) {
      for (const [metric, value] of [['p25', ldnP25], ['p50', ldnMedian], ['p75', ldnP75]]) {
        if (!value) continue;
        observations.push({
          source: 'ons', source_version: sourceVersion,
          occupation_code: rawSoc, occupation_label: label,
          geography_code: 'E12000007', geography_label: 'London',
          metric, value, currency: 'GBP',
          period: sourceVersion, fetched_at: now,
        });
      }
    }
  }

  console.log(`  [ons] extracted ${observations.length} observations`);
  if (observations.length > 0) {
    db.saveObservations(observations);
  }
  return observations;
}

// Standalone run
if (require.main === module) {
  fetchOns()
    .then(obs => console.log(`\nGot ${obs.length} observations`))
    .catch(err => { console.error(err); process.exit(1); });
}

module.exports = { fetchOns, ONS_SOC_TO_ROLES, ONS_GEO_TO_CITY };
