'use strict';

/**
 * ECB Exchange Rate source
 *
 * Uses the ECB Statistical Data Warehouse API (SDMX-JSON).
 * No API key required. Free, public, updated daily.
 * Docs: https://data.ecb.europa.eu/help/api/data
 *
 * Returns: EUR as base, rates for all currencies we need.
 * EUR is already 1.0 (no conversion needed).
 */

const db = require('../db');

// Currencies we need beyond EUR
// Format: quote currency code
const TARGET_CURRENCIES = [
  'USD',  // US, Canada (CA$ loosely tied)
  'GBP',  // UK
  'CHF',  // Switzerland
  'CAD',  // Canada
  'AUD',  // Australia
  'SGD',  // Singapore
  'DKK',  // Denmark (kr)
  'SEK',  // Sweden (kr)
  'PLN',  // Poland (zł)
  'CZK',  // Czechia (Kč)
  'RON',  // Romania (lei)
  'AED',  // UAE
];

const ECB_URL = (currencies) =>
  `https://data-api.ecb.europa.eu/service/data/EXR/D.${currencies.join('+')}.EUR.SP00.A` +
  `?format=jsondata&lastNObservations=1`;

async function fetchRates() {
  const url = ECB_URL(TARGET_CURRENCIES);
  console.log(`  [ecb] fetching ${url}`);

  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) throw new Error(`ECB API returned ${res.status}: ${await res.text()}`);

  const json = await res.json();

  // SDMX-JSON structure:
  // json.dataSets[0].series["0:n:0:0:0"].observations["0"] = [rate_value]
  // The series key encodes the dimension positions.
  // Dimension 1 (index 1) = currency (0-indexed into dimension values)

  const structure   = json.structure;
  const dimensions  = structure.dimensions.series;
  const currDim     = dimensions.find(d => d.keyPosition === 1); // CURRENCY dimension
  const currValues  = currDim.values.map(v => v.id);             // ['USD','GBP',...]

  const dataset = json.dataSets[0];
  const rates   = [];
  const now     = new Date().toISOString();

  for (const [seriesKey, seriesData] of Object.entries(dataset.series)) {
    const keyParts   = seriesKey.split(':');
    const currIndex  = parseInt(keyParts[1], 10);
    const quoteCurr  = currValues[currIndex];
    const obsValues  = Object.values(seriesData.observations ?? {});
    if (!obsValues.length) continue;

    const rate = obsValues[0][0]; // [value, quality_flag?]
    if (rate == null || rate === 'NaN') continue;

    rates.push({ base: 'EUR', quote: quoteCurr, rate: parseFloat(rate), source: 'ecb' });
  }

  // Add EUR → EUR trivially
  rates.push({ base: 'EUR', quote: 'EUR', rate: 1.0, source: 'ecb' });

  console.log(`  [ecb] got rates for: ${rates.map(r => r.quote).join(', ')}`);
  db.saveExchangeRates(rates, now);
  return rates;
}

// Standalone run
if (require.main === module) {
  fetchRates()
    .then(rates => console.log('\nRates:', rates))
    .catch(err  => { console.error(err); process.exit(1); });
}

module.exports = { fetchRates };
