#!/usr/bin/env node
'use strict';

/**
 * CompVerdict Data Pipeline — Main Orchestrator
 *
 * Usage:
 *   node pipeline.js [--sources=bls,ecb,ons,ine,so] [--version=2025-Q2] [--export-only]
 *
 * Sources run in this order:
 *   1. ecb   — exchange rates (always run first, needed for conversion)
 *   2. bls   — US BLS OEWS (Software Developers, major MSAs)
 *   3. ons   — UK ONS ASHE (ICT occupations, London + UK national)
 *   4. ine   — Spain INE EES (tech worker wages, national + city adjustments)
 *   5. so    — Stack Overflow Developer Survey (global, if CSV present)
 *
 * After ingestion, calibration converts aggregate data → experience bands.
 * Export merges calibrated benchmarks into the root data.js file.
 */

const db         = require('./db');
const calibrate  = require('./calibrate');
const { exportToDataJs } = require('./export');

// Source modules (each exports a named async function)
const SOURCES = {
  ecb: () => require('./sources/ecb').fetchRates(),
  bls: () => require('./sources/bls').fetchBls(),
  ons: () => require('./sources/ons').fetchOns(),
  ine: () => require('./sources/ine').fetchIne(),
  so:  () => require('./sources/stackoverflow').fetchStackOverflow(),
};

// ── CLI arg parsing ───────────────────────────────────────────────────────────
function parseArgs(argv) {
  const args = { sources: Object.keys(SOURCES), exportOnly: false, version: null };
  for (const arg of argv.slice(2)) {
    if (arg.startsWith('--sources=')) {
      args.sources = arg.replace('--sources=', '').split(',').map(s => s.trim());
    } else if (arg === '--export-only') {
      args.exportOnly = true;
    } else if (arg.startsWith('--version=')) {
      args.version = arg.replace('--version=', '');
    }
  }
  return args;
}

function currentDataVersion() {
  const now = new Date();
  const q   = Math.ceil((now.getMonth() + 1) / 3);
  return `${now.getFullYear()}-Q${q}`;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const args        = parseArgs(process.argv);
  const dataVersion = args.version ?? currentDataVersion();

  console.log('═══════════════════════════════════════════════════════');
  console.log(' CompVerdict Data Pipeline');
  console.log(`  version  : ${dataVersion}`);
  console.log(`  sources  : ${args.exportOnly ? '(skip — export only)' : args.sources.join(', ')}`);
  console.log('═══════════════════════════════════════════════════════');

  const runId = db.startRun(args.sources);
  let totalObservations = 0;
  let totalBenchmarks   = 0;
  let runError          = null;

  try {
    if (!args.exportOnly) {
      // Always run ECB first to ensure fresh exchange rates
      if (!args.sources.includes('ecb')) {
        console.log('\n[pipeline] fetching exchange rates (always required)...');
        await SOURCES.ecb().catch(e => console.warn(`  ECB failed: ${e.message}`));
      }

      // Run each requested source
      for (const sourceName of args.sources) {
        const fn = SOURCES[sourceName];
        if (!fn) {
          console.warn(`\n[pipeline] unknown source "${sourceName}" — skipping`);
          continue;
        }

        const lastRun = db.getLastRunTime(sourceName === 'ecb' ? 'ecb' : sourceName);
        const hoursSinceLastRun = lastRun
          ? (Date.now() - new Date(lastRun).getTime()) / (1000 * 60 * 60)
          : Infinity;

        // Skip re-fetching if data is fresh enough
        // ECB: 24h, BLS: 168h (7 days), others: 720h (30 days)
        const TTL_HOURS = { ecb: 24, bls: 168, ons: 720, ine: 720, so: 8760 };
        if (hoursSinceLastRun < (TTL_HOURS[sourceName] ?? 168)) {
          console.log(
            `\n[pipeline] ${sourceName}: data is fresh (${hoursSinceLastRun.toFixed(0)}h old) — skipping fetch`
          );
          continue;
        }

        console.log(`\n[pipeline] fetching ${sourceName}...`);
        const startMs = Date.now();
        try {
          const obs = await fn();
          const n   = Array.isArray(obs) ? obs.length : 0;
          totalObservations += n;
          console.log(`  ✓ ${sourceName}: ${n} observations (${Date.now() - startMs}ms)`);
        } catch (e) {
          console.error(`  ✗ ${sourceName} failed: ${e.message}`);
          // Continue — one source failure shouldn't stop the pipeline
        }
      }
    }

    // Calibrate: aggregate observations → experience bands
    console.log('\n[pipeline] calibrating...');
    totalBenchmarks = await calibrate.calibrate(dataVersion);

    // Export: merge calibrated benchmarks into data.js
    console.log('\n[pipeline] exporting to data.js...');
    const updatedCities = await exportToDataJs(dataVersion);

    db.completeRun(runId, {
      observationsAdded: totalObservations,
      benchmarksUpdated: totalBenchmarks,
    });

    console.log('\n═══════════════════════════════════════════════════════');
    console.log(` Pipeline complete`);
    console.log(`  observations: ${totalObservations}`);
    console.log(`  benchmarks  : ${totalBenchmarks}`);
    console.log(`  cities updated in data.js: ${updatedCities}`);
    console.log(`  data version: ${dataVersion}`);
    console.log('═══════════════════════════════════════════════════════\n');

  } catch (e) {
    runError = e.message;
    db.completeRun(runId, { observationsAdded: totalObservations, error: e.message });
    console.error('\n[pipeline] FATAL ERROR:', e);
    process.exit(1);
  }
}

main();
