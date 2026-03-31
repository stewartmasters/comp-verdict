'use strict';

/**
 * City/geography normalisation
 *
 * Maps external geography codes (CBSA, NUTS, country names) to
 * CompVerdict city names.
 *
 * When a source only provides national data (e.g., Stack Overflow country-level,
 * INE national averages), we distribute it to relevant cities using adjustment
 * multipliers derived from regional wage surveys.
 */

// ── BLS CBSA codes → CompVerdict cities ──────────────────────────────────────
const BLS_CBSA_TO_CITY = {
  'M41860': 'San Francisco',
  'M35620': 'New York',
  'M42660': 'Seattle',
  'M12420': 'Austin',
  'M14460': 'Boston',
  'M16980': 'Chicago',
  'M31080': 'Los Angeles',
  'M33100': 'Miami',
};

// ── ONS geography codes → CompVerdict cities ─────────────────────────────────
const ONS_GEO_TO_CITY = {
  'K02000001': null,             // UK overall — used for UK national benchmarks
  'E12000007': 'London',        // London
  'E92000001': 'Remote (UK)',   // England — proxy for remote/national UK
  'K03000001': 'Remote (UK)',   // Great Britain
};

// ── Stack Overflow country → CompVerdict cities ───────────────────────────────
// When SO data is at country level, we distribute to relevant cities.
// The weight represents how much of the country's tech employment is in each city.
const SO_COUNTRY_TO_CITIES = {
  'United States of America': [
    { city: 'San Francisco', weight: 0.22, adjustment: 1.28 },
    { city: 'New York',      weight: 0.18, adjustment: 1.16 },
    { city: 'Seattle',       weight: 0.12, adjustment: 1.22 },
    { city: 'Austin',        weight: 0.08, adjustment: 0.96 },
    { city: 'Boston',        weight: 0.08, adjustment: 1.02 },
    { city: 'Los Angeles',   weight: 0.10, adjustment: 1.08 },
    { city: 'Chicago',       weight: 0.07, adjustment: 0.94 },
    { city: 'Miami',         weight: 0.05, adjustment: 0.87 },
    { city: 'Remote (US)',   weight: 0.10, adjustment: 1.0  },
  ],
  'United Kingdom': [
    { city: 'London',       weight: 0.55, adjustment: 1.28 },
    { city: 'Manchester',   weight: 0.12, adjustment: 0.82 },
    { city: 'Edinburgh',    weight: 0.08, adjustment: 0.84 },
    { city: 'Bristol',      weight: 0.07, adjustment: 0.81 },
    { city: 'Remote (UK)', weight: 0.18, adjustment: 1.0  },
  ],
  'Germany': [
    { city: 'Berlin',            weight: 0.25, adjustment: 0.93 },
    { city: 'Munich',            weight: 0.22, adjustment: 1.12 },
    { city: 'Hamburg',           weight: 0.12, adjustment: 1.05 },
    { city: 'Frankfurt',         weight: 0.11, adjustment: 1.08 },
    { city: 'Cologne',           weight: 0.09, adjustment: 0.99 },
    { city: 'Stuttgart',         weight: 0.07, adjustment: 1.02 },
    { city: 'Remote (Germany)', weight: 0.14, adjustment: 1.0  },
  ],
  'Spain': [
    { city: 'Barcelona',      weight: 0.35, adjustment: 1.05 },
    { city: 'Madrid',         weight: 0.40, adjustment: 1.09 },
    { city: 'Valencia',       weight: 0.08, adjustment: 0.87 },
    { city: 'Seville',        weight: 0.04, adjustment: 0.82 },
    { city: 'Bilbao',         weight: 0.04, adjustment: 0.91 },
    { city: 'Remote (Spain)', weight: 0.09, adjustment: 1.02 },
  ],
  'France': [
    { city: 'Paris', weight: 1.0, adjustment: 1.0 },
  ],
  'Netherlands': [
    { city: 'Amsterdam', weight: 1.0, adjustment: 1.0 },
  ],
  'Ireland': [
    { city: 'Dublin', weight: 1.0, adjustment: 1.0 },
  ],
  'Canada': [
    { city: 'Toronto', weight: 1.0, adjustment: 1.0 },
  ],
  'Singapore': [
    { city: 'Singapore', weight: 1.0, adjustment: 1.0 },
  ],
  'Australia': [
    { city: 'Sydney', weight: 1.0, adjustment: 1.0 },
  ],
  'Portugal': [
    { city: 'Lisbon', weight: 1.0, adjustment: 1.0 },
  ],
  'Switzerland': [
    { city: 'Zurich', weight: 0.6, adjustment: 0.97 },
    { city: 'Geneva', weight: 0.4, adjustment: 1.03 },
  ],
  'Sweden': [
    { city: 'Stockholm', weight: 1.0, adjustment: 1.0 },
  ],
  'Denmark': [
    { city: 'Copenhagen', weight: 1.0, adjustment: 1.0 },
  ],
  'Poland': [
    { city: 'Warsaw', weight: 1.0, adjustment: 1.0 },
  ],
};

// ── INE geography codes → CompVerdict cities ─────────────────────────────────
// INE data is national Spain by default; we apply per-city adjustments
const INE_GEO_TO_CITIES = {
  ES: [
    { city: 'Barcelona',      adjustment: 1.05 },
    { city: 'Madrid',         adjustment: 1.09 },
    { city: 'Valencia',       adjustment: 0.87 },
    { city: 'Seville',        adjustment: 0.82 },
    { city: 'Bilbao',         adjustment: 0.91 },
    { city: 'Remote (Spain)', adjustment: 1.02 },
  ],
};

/**
 * Resolve a source geography code to CompVerdict city names + adjustments
 * Returns: [{ city, adjustment }]
 */
function resolveCities(source, geographyCode, geographyLabel) {
  switch (source) {
    case 'bls': {
      const city = BLS_CBSA_TO_CITY[geographyCode];
      return city ? [{ city, adjustment: 1.0 }] : [];
    }

    case 'ons': {
      const city = ONS_GEO_TO_CITY[geographyCode];
      if (city === null) return []; // UK national — handled separately
      return city ? [{ city, adjustment: 1.0 }] : [];
    }

    case 'ine': {
      // INE geography codes are ES_{city_name}
      const cityName = geographyLabel;
      if (cityName && INE_GEO_TO_CITIES.ES) {
        const match = INE_GEO_TO_CITIES.ES.find(e => e.city === cityName);
        return match ? [match] : [];
      }
      return [];
    }

    case 'stackoverflow': {
      const country = geographyLabel;
      return SO_COUNTRY_TO_CITIES[country] ?? [];
    }

    default:
      return [];
  }
}

module.exports = {
  BLS_CBSA_TO_CITY,
  ONS_GEO_TO_CITY,
  SO_COUNTRY_TO_CITIES,
  INE_GEO_TO_CITIES,
  resolveCities,
};
