'use strict';

/**
 * Currency normalisation
 *
 * Converts salary values between currencies using ECB rates stored in the DB.
 * All conversions go via EUR as the pivot currency.
 *
 * For CompVerdict, salaries are stored in LOCAL currency (not EUR).
 * So the pipeline:
 *   1. Fetches a value in source currency (e.g., USD from BLS)
 *   2. Converts to EUR
 *   3. Converts EUR to the target local currency for that city
 *   4. Rounds to nearest 1k
 */

const db = require('../db');

// Currency code → data.js symbol mapping
const CURRENCY_TO_SYMBOL = {
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

// CompVerdict city → local currency code
const CITY_CURRENCY = {
  'Barcelona':        'EUR',
  'Madrid':           'EUR',
  'Valencia':         'EUR',
  'Seville':          'EUR',
  'Bilbao':           'EUR',
  'Remote (Spain)':   'EUR',
  'London':           'GBP',
  'Manchester':       'GBP',
  'Edinburgh':        'GBP',
  'Bristol':          'GBP',
  'Remote (UK)':      'GBP',
  'Berlin':           'EUR',
  'Munich':           'EUR',
  'Hamburg':          'EUR',
  'Frankfurt':        'EUR',
  'Cologne':          'EUR',
  'Stuttgart':        'EUR',
  'Remote (Germany)': 'EUR',
  'Amsterdam':        'EUR',
  'Paris':            'EUR',
  'Dublin':           'EUR',
  'Lisbon':           'EUR',
  'Milan':            'EUR',
  'Stockholm':        'SEK',
  'Copenhagen':       'DKK',
  'Zurich':           'CHF',
  'Geneva':           'CHF',
  'Warsaw':           'PLN',
  'Prague':           'CZK',
  'Bucharest':        'RON',
  'Remote (Europe)':  'EUR',
  'San Francisco':    'USD',
  'New York':         'USD',
  'Seattle':          'USD',
  'Austin':           'USD',
  'Boston':           'USD',
  'Chicago':          'USD',
  'Los Angeles':      'USD',
  'Miami':            'USD',
  'Remote (US)':      'USD',
  'Toronto':          'CAD',
  'Sydney':           'AUD',
  'Singapore':        'SGD',
  'Dubai':            'AED',
};

let _rates = null;

function getRates() {
  if (_rates) return _rates;
  _rates = db.getLatestRates();
  // Always include EUR→EUR
  _rates['EUR'] = 1.0;
  return _rates;
}

/**
 * Convert a value from sourceCurrency to targetCurrency
 * Both currency codes are ISO 4217 (USD, GBP, EUR, etc.)
 * Rates in DB are stored as: 1 EUR = {rate} targetCurrency
 */
function convert(value, sourceCurrency, targetCurrency) {
  if (sourceCurrency === targetCurrency) return value;
  const rates = getRates();

  // Convert source → EUR first
  let eur;
  if (sourceCurrency === 'EUR') {
    eur = value;
  } else {
    const sourceRate = rates[sourceCurrency];
    if (!sourceRate) throw new Error(`No ECB rate for ${sourceCurrency}`);
    eur = value / sourceRate; // divide because rate is EUR→X
  }

  // Convert EUR → target
  if (targetCurrency === 'EUR') return Math.round(eur);
  const targetRate = rates[targetCurrency];
  if (!targetRate) throw new Error(`No ECB rate for ${targetCurrency}`);
  return Math.round(eur * targetRate);
}

/**
 * Convert a salary value to the local currency for a given CompVerdict city
 */
function convertToCity(value, sourceCurrency, city) {
  const targetCurrency = CITY_CURRENCY[city];
  if (!targetCurrency) throw new Error(`Unknown city: ${city}`);
  return convert(value, sourceCurrency, targetCurrency);
}

/**
 * Get the currency code for a CompVerdict city
 */
function getCurrencyForCity(city) {
  return CITY_CURRENCY[city] ?? 'EUR';
}

/**
 * Reset cached rates (call after refreshing ECB data)
 */
function resetRatesCache() {
  _rates = null;
}

module.exports = {
  convert,
  convertToCity,
  getCurrencyForCity,
  CURRENCY_TO_SYMBOL,
  CITY_CURRENCY,
  resetRatesCache,
};
