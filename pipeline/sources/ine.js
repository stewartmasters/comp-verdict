'use strict';

/**
 * INE (Instituto Nacional de Estadística) — Spain wage data source
 *
 * DATA: Spanish National Statistics Institute.
 * Open data, CC-BY licence.
 * API docs: https://www.ine.es/dyngs/DAB/en/index.htm
 *
 * We use the Encuesta Anual de Estructura Salarial (EAES):
 * Annual wage structure survey published with ~18 month lag.
 *
 * INE JSON API:
 *   https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/{table_id}
 *
 * Relevant tables (search at https://www.ine.es/dyngs/INEbase/):
 *   - "Salario medio anual por ocupación (grupos principales CNO-11)"
 *     This gives median annual gross pay by CNO (Spanish occupation code).
 *
 * CNO-11 codes relevant to tech:
 *   21 — Computer professionals (Profesionales en ciencias e ingeniería)
 *   214 — ICT professionals
 *   2152 — Database and network professionals
 *   2153 — Systems administrators
 *   2166 — Graphic and multimedia designers → UX proxy
 *
 * The INE API is used for the national Spain average.
 * We apply a city adjustment factor (Barcelona +5%, Madrid +8%) derived
 * from regional wage data published in INE's Encuesta de Costes Laborales.
 *
 * Wages in EUR, annual gross.
 */

const fs   = require('fs');
const path = require('path');
const db   = require('../db');

const CACHE_DIR = path.join(__dirname, '..', 'data', 'ine');
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days

// INE table for "Salario medio por ocupación (CNO-11 2 dígitos)"
// Table 36866 = Actividad y ocupación (EAES quarterly indicators)
// We try multiple table IDs since INE renumbers them on updates
const INE_TABLE_IDS = [
  '10887',  // EES: Ganancia media anual por tipo de ocupación (groups)
  '36866',  // EAES: by occupation (quarterly)
  '10889',  // EES: by sector and occupation
];

// CNO-11 2-digit groups → CompVerdict roles
const CNO_TO_ROLES = {
  '21': ['Software Engineer', 'Backend Engineer', 'Data Engineer'],
  '214': ['Software Engineer', 'Backend Engineer', 'DevOps Engineer'],
  '215': ['Data Scientist', 'Machine Learning Engineer'],
  '216': ['UX Designer'],
  '12': ['Engineering Manager'],
};

// Spain regional adjustment multipliers (source: INE Encuesta Costes Laborales)
// Barcelona and Madrid tend to be 5–10% above the national average for ICT
const CITY_ADJUSTMENTS = {
  'Barcelona': 1.05,
  'Madrid':    1.09,
  'Valencia':  0.87,
  'Seville':   0.82,
  'Bilbao':    0.91,
  'Remote (Spain)': 1.02,
};

async function fetchTable(tableId) {
  const cacheFile = path.join(CACHE_DIR, `ine_table_${tableId}.json`);
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  const stat = fs.existsSync(cacheFile) ? fs.statSync(cacheFile) : null;
  if (stat && (Date.now() - stat.mtimeMs) < CACHE_TTL) {
    console.log(`  [ine] using cached table ${tableId}`);
    return JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  }

  const url = `https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/${tableId}`;
  console.log(`  [ine] fetching table ${tableId}...`);

  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    console.warn(`  [ine] table ${tableId} returned ${res.status}`);
    return null;
  }

  const json = await res.json();
  if (!Array.isArray(json) || json.length === 0) {
    console.warn(`  [ine] table ${tableId} returned no data`);
    return null;
  }

  fs.writeFileSync(cacheFile, JSON.stringify(json));
  return json;
}

async function fetchIne() {
  const now = new Date().toISOString();
  const observations = [];

  for (const tableId of INE_TABLE_IDS) {
    const data = await fetchTable(tableId);
    if (!data) continue;

    // INE JSON structure: array of series objects
    // Each series has: { Nombre, Data: [{ Anyo, Periodo, Valor }] }
    // We look for series whose name contains an occupation group

    for (const series of data) {
      const name = series.Nombre ?? '';

      // Find CNO code in the series name
      let cnoCode = null;
      for (const code of Object.keys(CNO_TO_ROLES)) {
        if (name.includes(`CNO ${code}`) || name.includes(` ${code} `) || name.includes(`(${code})`)) {
          cnoCode = code;
          break;
        }
      }
      if (!cnoCode) continue;

      // Get the most recent data point
      const dataPoints = (series.Data ?? [])
        .filter(d => d.Valor != null && d.Valor > 0)
        .sort((a, b) => b.Anyo - a.Anyo);

      if (!dataPoints.length) continue;

      const latest = dataPoints[0];
      const value  = parseFloat(latest.Valor);
      const period = String(latest.Anyo);

      if (isNaN(value) || value < 10000) continue; // sanity check: >€10k

      // National Spain median — apply city adjustments for each city
      for (const [city, multiplier] of Object.entries(CITY_ADJUSTMENTS)) {
        observations.push({
          source:           'ine',
          source_version:   period,
          occupation_code:  cnoCode,
          occupation_label: name.substring(0, 120),
          geography_code:   `ES_${city.replace(/[() ]/g, '_')}`,
          geography_label:  city,
          metric:           'p50',  // INE publishes mean/median, treat as p50
          value:            Math.round(value * multiplier),
          currency:         'EUR',
          period,
          fetched_at:       now,
        });
      }
    }

    if (observations.length > 0) break; // stop at first table that returned data
  }

  if (observations.length === 0) {
    console.warn('  [ine] no matching data found — check table IDs');
    console.warn('  [ine] Browse https://www.ine.es/dyngs/INEbase/ to find current table IDs');
    console.warn('        for "Encuesta Anual de Estructura Salarial por ocupación CNO-11"');
    return [];
  }

  console.log(`  [ine] extracted ${observations.length} observations`);
  db.saveObservations(observations);
  return observations;
}

// Standalone run
if (require.main === module) {
  fetchIne()
    .then(obs => console.log(`\nGot ${obs.length} observations`))
    .catch(err => { console.error(err); process.exit(1); });
}

module.exports = { fetchIne, CNO_TO_ROLES, CITY_ADJUSTMENTS };
