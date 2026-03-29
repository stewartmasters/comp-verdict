'use strict';

/**
 * Export calibrated benchmarks → data.js
 *
 * Reads the latest calibrated_benchmarks from the pipeline DB and merges
 * them with the existing data.js. For any role/city/band where the pipeline
 * has data, the pipeline value replaces the manual value. For everything
 * else, the existing manual data is kept.
 *
 * This means data.js always has complete coverage — pipeline data augments
 * rather than replaces.
 */

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');
const db   = require('./db');

const DATA_JS_PATH = path.join(__dirname, '..', 'data.js');

// ── Load existing CV_DATA ─────────────────────────────────────────────────────
function loadExistingData() {
  const src     = fs.readFileSync(DATA_JS_PATH, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox);
  return sandbox.window.CV_DATA;
}

// ── Currency code → data.js symbol ────────────────────────────────────────────
// Matches the symbols in data.js cities metadata
const CURRENCY_CODE_TO_SYMBOL = {
  EUR: '€',
  GBP: '£',
  USD: '$',
  CHF: 'CHF ',
  CAD: 'CA$',
  AUD: 'A$',
  SGD: 'S$',
  DKK: 'kr ',
  SEK: 'kr ',
  PLN: 'zł ',
  CZK: 'Kč ',
  RON: 'lei ',
  AED: 'AED ',
};

// ── Format a number the same way data.js does ─────────────────────────────────
function round(n) { return Math.round(n / 500) * 500; }  // round to nearest 500

// ── Main export function ──────────────────────────────────────────────────────
async function exportToDataJs(dataVersion) {
  console.log(`\n[export] building data.js from version ${dataVersion}...`);

  const existing = loadExistingData();
  const rows = db.getBenchmarks(dataVersion);
  console.log(`[export] ${rows.length} calibrated benchmark rows to merge`);

  if (rows.length === 0) {
    console.warn('[export] no calibrated data — data.js unchanged');
    return;
  }

  // Build a map: role → city → band → {p25,p50,p75}
  const pipeline = {};
  for (const row of rows) {
    if (!pipeline[row.role]) pipeline[row.role] = {};
    if (!pipeline[row.role][row.city]) pipeline[row.role][row.city] = {};
    pipeline[row.role][row.city][row.band] = {
      p25: round(row.p25),
      p50: round(row.p50),
      p75: round(row.p75),
    };
  }

  // The SE baseline benchmarks drive everything in the existing model.
  // We update the 'benchmarks' object for each city where we have SE data,
  // then let the role multipliers in the tool compute other role salaries.
  //
  // If we have enough per-role data, we can also update role multipliers.
  // For now: focus on updating the SE baseline per city/band.

  const SE_ROLE = 'Software Engineer';
  let updatedCities = 0;

  for (const [city, bands] of Object.entries(pipeline[SE_ROLE] ?? {})) {
    if (!existing.benchmarks[city]) {
      console.warn(`  [export] city "${city}" not in existing data.js — skipping`);
      continue;
    }

    let changed = false;
    for (const [band, vals] of Object.entries(bands)) {
      const existing_band = existing.benchmarks[city][band];
      if (!existing_band) continue;

      const deltaP50 = Math.abs(vals.p50 - existing_band.p50) / existing_band.p50;

      // Sanity check: reject if pipeline value is >50% different from existing
      // This catches bad data or mapping errors
      if (deltaP50 > 0.50) {
        console.warn(
          `  [export] SKIPPED ${city}/${band}: pipeline p50=${vals.p50} vs existing p50=${existing_band.p50} (${(deltaP50*100).toFixed(0)}% delta > 50% threshold)`
        );
        continue;
      }

      existing.benchmarks[city][band] = vals;
      changed = true;
    }

    if (changed) updatedCities++;
  }

  // Also update role multipliers if we have sufficient role coverage
  // (requires at least 5 roles with data for a city to compute relative multipliers)
  const MULTIPLIER_THRESHOLD = 5;

  for (const [city] of Object.entries(existing.benchmarks)) {
    const cityData = pipeline[SE_ROLE]?.[city];
    if (!cityData?.mid) continue;

    const seP50 = cityData.mid.p50;
    if (!seP50) continue;

    let rolesWithData = 0;
    for (const role of Object.keys(existing.roles)) {
      if (pipeline[role]?.[city]?.mid?.p50) rolesWithData++;
    }

    if (rolesWithData < MULTIPLIER_THRESHOLD) continue;

    // Update role multipliers for this market
    const marketCode = existing.cities[city]?.market;
    if (!marketCode) continue;

    for (const role of Object.keys(existing.roles)) {
      const roleMidP50 = pipeline[role]?.[city]?.mid?.p50;
      if (!roleMidP50 || !seP50) continue;

      const newMul = Math.round((roleMidP50 / seP50) * 100) / 100;

      // Only update override for this market, not the global multiplier
      // (global multiplier update requires data from multiple markets)
      if (Math.abs(newMul - (existing.roles[role].mul ?? 1.0)) > 0.15) continue; // >15% off

      if (!existing.roles[role].override) existing.roles[role].override = {};
      existing.roles[role].override[marketCode] = newMul;
    }
  }

  // Update version and last_updated timestamp
  existing.version = dataVersion;
  existing.last_updated = new Date().toISOString().split('T')[0];
  existing.pipeline_run = new Date().toISOString();

  // ── Serialise to data.js ──────────────────────────────────────────────────
  const output = serialiseDataJs(existing);
  fs.writeFileSync(DATA_JS_PATH, output, 'utf8');

  console.log(`[export] updated ${updatedCities} cities in data.js`);
  console.log(`[export] wrote ${(Buffer.byteLength(output) / 1024).toFixed(0)} KB to data.js`);
  return updatedCities;
}

function serialiseDataJs(data) {
  // Pretty-print the data object in the same style as the original data.js
  const j = JSON.stringify(data, null, 2);

  return `/**
 * CompVerdict — Benchmark Dataset
 * Version: ${data.version}
 * Last updated: ${data.last_updated}
 * Pipeline run: ${data.pipeline_run ?? 'manual'}
 *
 * METHODOLOGY
 * -----------
 * Baseline role: Software Engineer
 * Baseline band: Mid (3–5 YoE)
 * Sources: BLS OEWS (US), ONS ASHE (UK), INE EES (Spain),
 *          Stack Overflow Developer Survey (global)
 * Currency: local, annual gross (pre-tax)
 *
 * All other roles derived via role multipliers applied to the SE baseline.
 * Experience bands derived from aggregate percentiles using calibration model.
 * See pipeline/calibrate.js for methodology.
 */

window.CV_DATA = ${j};
`;
}

// ── Standalone run ─────────────────────────────────────────────────────────
if (require.main === module) {
  const version = process.argv[2] ?? `${new Date().getFullYear()}-Q${Math.ceil((new Date().getMonth()+1)/3)}`;
  exportToDataJs(version)
    .then(n => console.log(`\nExport complete — ${n} cities updated`))
    .catch(err => { console.error(err); process.exit(1); });
}

module.exports = { exportToDataJs };
