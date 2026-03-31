'use strict';

/**
 * BLS OEWS (Occupational Employment and Wage Statistics) source
 *
 * DATA: U.S. Bureau of Labor Statistics, Occupational Employment and
 * Wage Statistics (OEWS) Program. Public domain, no scraping — these
 * are official government flat-file releases.
 * URL: https://download.bls.gov/pub/time.series/oe/
 *
 * We use the BLS time-series flat files (TSV) rather than the API or
 * Excel bulk downloads because:
 *  - They are plain text, no Excel parser needed
 *  - We can stream-parse them line-by-line without loading 100MB into RAM
 *  - They are the most complete and authoritative version
 *
 * Files used:
 *  oe.series      — series metadata (area, occupation, data type per series)
 *  oe.data.0.Current — latest values for all series
 *  oe.area        — CBSA area code ↔ label lookup
 *
 * Data type codes we care about:
 *  09 = Annual 25th percentile wage
 *  10 = Annual median wage
 *  11 = Annual 75th percentile wage
 *
 * All wages are in USD, annual gross.
 */

const fs      = require('fs');
const path    = require('path');
const readline = require('readline');
const db      = require('../db');

const CACHE_DIR = path.join(__dirname, '..', 'data', 'bls');
const BASE_URL  = 'https://download.bls.gov/pub/time.series/oe/';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

// ── SOC codes → CompVerdict roles (can match multiple roles) ──────────────────
// Source: https://www.bls.gov/oes/current/oes_stru.htm
const SOC_TO_ROLES = {
  '151252': ['Software Engineer', 'Backend Engineer'],
  '151254': ['Frontend Engineer'],
  '151255': ['Frontend Engineer', 'UX Designer'],
  '152051': ['Data Scientist', 'Machine Learning Engineer'],
  '151244': ['DevOps Engineer', 'Site Reliability Engineer'],
  '151299': ['Platform Engineer', 'DevOps Engineer'],
  '113021': ['Engineering Manager'],
  '151212': ['Security Engineer'],
  '151253': ['QA Engineer'],
};

const TARGET_SOC_CODES = new Set(Object.keys(SOC_TO_ROLES));

// ── CBSA MSA codes → CompVerdict cities ───────────────────────────────────────
// These are 7-digit BLS area codes (not FIPS directly, but close)
// Found by cross-referencing oe.area file with city names
const CBSA_TO_CITY = {
  'M41860': 'San Francisco',   // San Francisco-Oakland-Hayward, CA
  'M35620': 'New York',        // New York-Newark-Jersey City, NY-NJ-PA
  'M42660': 'Seattle',         // Seattle-Tacoma-Bellevue, WA
  'M12420': 'Austin',          // Austin-Round Rock, TX
  'M14460': 'Boston',          // Boston-Cambridge-Newton, MA-NH
  'M16980': 'Chicago',         // Chicago-Naperville-Elgin, IL-IN-WI
  'M31080': 'Los Angeles',     // Los Angeles-Long Beach-Anaheim, CA
  'M33100': 'Miami',           // Miami-Fort Lauderdale-Pompano Beach, FL
  'M19820': 'Detroit',         // Detroit-Warren-Dearborn, MI (fallback)
  'M38900': 'Portland',        // Portland-Vancouver-Hillsboro, OR-WA
};

const TARGET_AREA_CODES = new Set(Object.keys(CBSA_TO_CITY));

// Data type codes we want
const TARGET_DATA_TYPES = new Set(['09', '10', '11']);
const DATA_TYPE_TO_METRIC = { '09': 'p25', '10': 'p50', '11': 'p75' };

// ── File download + caching ───────────────────────────────────────────────────
async function downloadFile(filename) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const cachePath = path.join(CACHE_DIR, filename);

  const stat = fs.existsSync(cachePath) ? fs.statSync(cachePath) : null;
  if (stat && (Date.now() - stat.mtimeMs) < CACHE_TTL) {
    console.log(`  [bls] using cached ${filename} (${(stat.size / 1024 / 1024).toFixed(1)} MB)`);
    return cachePath;
  }

  const url = BASE_URL + filename;
  console.log(`  [bls] downloading ${url}`);

  const res = await fetch(url, { signal: AbortSignal.timeout(120_000) });
  if (!res.ok) throw new Error(`BLS download failed: ${res.status} ${url}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(cachePath, buffer);
  console.log(`  [bls] saved ${filename} (${(buffer.length / 1024 / 1024).toFixed(1)} MB)`);
  return cachePath;
}

// ── Stream-parse a BLS TSV flat file ─────────────────────────────────────────
async function* parseTsv(filePath) {
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });

  let headers = null;
  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const cols = trimmed.split('\t').map(c => c.trim());
    if (!headers) { headers = cols; continue; }
    const row = {};
    for (let i = 0; i < headers.length; i++) row[headers[i]] = cols[i] ?? '';
    yield row;
  }
}

// ── Main fetch function ───────────────────────────────────────────────────────
async function fetchBls() {
  // Step 1: load series file to build a map of series_id → {area, soc, datatype}
  const seriesFile = await downloadFile('oe.series');
  const seriesMap = new Map(); // series_id → {area_code, occupation_code, data_type_code}

  console.log('  [bls] indexing series...');
  for await (const row of parseTsv(seriesFile)) {
    const { series_id, area_code, occupation_code, data_type_code } = row;
    if (!series_id) continue;

    // Normalise codes (BLS sometimes pads or uses different formats)
    const areaCode = area_code?.trim().toUpperCase();
    const occCode  = occupation_code?.trim().replace('-', '');
    const dtCode   = data_type_code?.trim();

    if (
      TARGET_AREA_CODES.has(areaCode) &&
      TARGET_SOC_CODES.has(occCode) &&
      TARGET_DATA_TYPES.has(dtCode)
    ) {
      seriesMap.set(series_id.trim(), { areaCode, occCode, dtCode });
    }
  }

  console.log(`  [bls] matched ${seriesMap.size} series IDs`);
  if (seriesMap.size === 0) {
    // Fallback: try alternate area code format without 'M' prefix
    console.warn('  [bls] WARNING: no series matched — area codes may differ in this release');
    console.warn('        Check oe.area file for correct format');
  }

  // Step 2: load current data for matched series
  const dataFile = await downloadFile('oe.data.0.Current');
  const observations = [];
  const now = new Date().toISOString();
  let lineCount = 0;

  // Also collect area labels from oe.area for logging
  const areaLabels = new Map();
  const areaFile = await downloadFile('oe.area');
  for await (const row of parseTsv(areaFile)) {
    const { area_code, area_name } = row;
    if (area_code) areaLabels.set(area_code.trim().toUpperCase(), area_name?.trim() ?? '');
  }

  console.log('  [bls] scanning data file...');
  for await (const row of parseTsv(dataFile)) {
    const sid = row.series_id?.trim();
    if (!sid || !seriesMap.has(sid)) continue;

    const { areaCode, occCode, dtCode } = seriesMap.get(sid);
    const rawValue = row.value?.trim();

    // BLS suppresses some values with '-' or '**'
    if (!rawValue || rawValue === '-' || rawValue.startsWith('*') || rawValue === '.') continue;

    const value = parseFloat(rawValue);
    if (isNaN(value) || value <= 0) continue;

    // Use latest period
    const period = row.year ? `${row.year}` : null;

    observations.push({
      source:           'bls',
      source_version:   period,
      occupation_code:  occCode,
      occupation_label: null, // will be looked up via SOC_TO_ROLES key
      geography_code:   areaCode,
      geography_label:  areaLabels.get(areaCode) ?? CBSA_TO_CITY[areaCode] ?? areaCode,
      metric:           DATA_TYPE_TO_METRIC[dtCode],
      value,
      currency:         'USD',
      sample_n:         null,
      period,
      fetched_at:       now,
    });
    lineCount++;
  }

  console.log(`  [bls] extracted ${observations.length} observations`);
  if (observations.length > 0) {
    const added = db.saveObservations(observations);
    console.log(`  [bls] saved ${added} rows`);
  }
  return observations;
}

// Standalone run
if (require.main === module) {
  fetchBls()
    .then(obs => {
      const byCityOcc = {};
      for (const o of obs) {
        const key = `${CBSA_TO_CITY[o.geography_code]} / SOC ${o.occupation_code}`;
        if (!byCityOcc[key]) byCityOcc[key] = {};
        byCityOcc[key][o.metric] = `$${o.value.toLocaleString()}`;
      }
      console.log('\nSample results:');
      for (const [k, v] of Object.entries(byCityOcc).slice(0, 10)) {
        console.log(`  ${k}:`, v);
      }
    })
    .catch(err => { console.error(err); process.exit(1); });
}

module.exports = { fetchBls, SOC_TO_ROLES, CBSA_TO_CITY };
