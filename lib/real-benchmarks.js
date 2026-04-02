/**
 * real-benchmarks.js — Salary benchmarking engine backed by real data.
 *
 * Replaces the multiplier approach for roles/cities where real statistical
 * data exists (ONS ASHE, Eurostat SES, Destatis VSE, INE EES, etc.).
 *
 * For roles or cities not yet in the dataset, returns null so callers can
 * fall back to the existing multiplier approach.
 *
 * Data source: data/normalized/records.json
 * Refreshed from salary-verdict whenever the pipeline runs:
 *   cp ../salary-verdict/data/normalized/records.json data/normalized/records.json
 */

import recordsRaw from '../data/normalized/records.json'

const ALL_RECORDS = recordsRaw.records

// ─── Role label → normalized slug ────────────────────────────────────────────
// Maps comp-verdict display labels to salary-verdict normalized slugs.
// Roles not in this map have no real-data coverage — will use multiplier fallback.

const ROLE_SLUG_MAP = {
  'Software Engineer':         'software-engineer',
  'Backend Engineer':          'backend-developer',
  'Frontend Engineer':         'frontend-developer',
  'Full Stack Engineer':       'full-stack-developer',
  'DevOps Engineer':           'devops-engineer',
  'Site Reliability Engineer': 'devops-engineer',
  'Platform Engineer':         'devops-engineer',
  'QA Engineer':               'qa-engineer',
  'Data Scientist':            'data-scientist',
  'Data Engineer':             'data-scientist',    // closest available
  'Machine Learning Engineer': 'data-scientist',
  'Product Manager':           'product-manager',
  'Designer':                  'designer',
  'UX Designer':               'designer',
  'UI Designer':               'designer',
  'Product Designer':          'designer',
  'Marketing Manager':         'marketing-manager',
  'Finance Analyst':           'finance-analyst',
  'Operations Manager':        'operations-manager',
  'Business Analyst':          'business-analyst',
  'Sales Manager':             'sales-manager',
  'HR Manager':                'hr-manager',
  'Project Manager':           'project-manager',
}

// ─── City label → { slug, countryCode } ──────────────────────────────────────
// Maps comp-verdict display city labels to location slugs used in records.
// Cities not in this map fall back to multiplier approach.

const CITY_SLUG_MAP = {
  'London':      { slug: 'london',    country: 'GB' },
  'Berlin':      { slug: 'berlin',    country: 'DE' },
  'Munich':      { slug: null,        country: 'DE' },  // country-level DE fallback
  'Frankfurt':   { slug: null,        country: 'DE' },
  'Hamburg':     { slug: null,        country: 'DE' },
  'Barcelona':   { slug: 'barcelona', country: 'ES' },
  'Madrid':      { slug: 'madrid',    country: 'ES' },
  'Amsterdam':   { slug: 'amsterdam', country: 'NL' },
  'Paris':       { slug: 'paris',     country: 'FR' },
  'Dublin':      { slug: 'dublin',    country: 'IE' },
  'Zurich':      { slug: 'zurich',    country: 'CH' },
  'Stockholm':   { slug: 'stockholm', country: 'SE' },
  'Milan':       { slug: 'milan',     country: 'IT' },
  'Lisbon':      { slug: 'lisbon',    country: 'PT' },
  'Warsaw':      { slug: 'warsaw',    country: 'PL' },
}

// ─── Experience curve ─────────────────────────────────────────────────────────
// Non-linear growth curve — matches salary-verdict exactly.

const EXP_CURVE = [
  [0, 0.58], [1, 0.68], [2, 0.78], [3, 0.87],
  [4, 0.94], [5, 1.00], [6, 1.08], [7, 1.15],
  [9, 1.24], [10, 1.30], [12, 1.38], [15, 1.48], [20, 1.62],
]

function experienceMultiplier(years) {
  const clamped = Math.max(0, Math.min(20, years))
  if (clamped <= EXP_CURVE[0][0]) return EXP_CURVE[0][1]
  if (clamped >= EXP_CURVE[EXP_CURVE.length - 1][0]) return EXP_CURVE[EXP_CURVE.length - 1][1]
  for (let i = 0; i < EXP_CURVE.length - 1; i++) {
    const [x0, y0] = EXP_CURVE[i]
    const [x1, y1] = EXP_CURVE[i + 1]
    if (clamped >= x0 && clamped <= x1) {
      const t = (clamped - x0) / (x1 - x0)
      const ease = t * t * (3 - 2 * t)
      return y0 + ease * (y1 - y0)
    }
  }
  return 1.0
}

// Maps seniority label → midpoint years (used for cross-band adjustments)
const SENIORITY_MIDPOINTS = { junior: 1, mid: 4.5, senior: 9, lead: 15, unknown: 4.5 }

function adjustForExperience(baseSalary, recordSeniority, targetYears) {
  const recordMid = SENIORITY_MIDPOINTS[recordSeniority] ?? 4.5
  return baseSalary * (experienceMultiplier(targetYears) / experienceMultiplier(recordMid))
}

// ─── Weighted percentile ──────────────────────────────────────────────────────

function weightedPercentile(points, pct) {
  if (points.length === 0) return 0
  const sorted = [...points].sort((a, b) => a.value - b.value)
  const total = sorted.reduce((s, p) => s + p.weight, 0)
  let cumulative = 0
  for (const p of sorted) {
    cumulative += p.weight
    if (cumulative >= total * pct) return p.value
  }
  return sorted[sorted.length - 1].value
}

// ─── Core computation ─────────────────────────────────────────────────────────

/**
 * Compute a p25/p50/p75 estimate for a role × location × target experience band.
 *
 * @param {string} roleSlug       normalized role slug (e.g. "software-engineer")
 * @param {string|null} citySlug  city slug (e.g. "london") or null for country-level only
 * @param {string} countryCode    ISO-2 country code (e.g. "GB")
 * @param {number} targetYears    midpoint years for the experience band
 * @returns {{ p25: number, p50: number, p75: number, recordCount: number } | null}
 */
function computeForBand(roleSlug, citySlug, countryCode, targetYears) {
  const roleRecords = ALL_RECORDS.filter(r => r.role_normalized === roleSlug)

  // City-level records (exact country match required)
  const cityRecords = citySlug
    ? roleRecords.filter(r => r.city_slug === citySlug && (r.country_code === countryCode || r.country_code === 'EU'))
    : []

  // Country-level records
  const countryRecords = roleRecords.filter(
    r => r.region_scope === 'country' && r.country_code === countryCode && r.city_slug === null
  )

  // Europe-wide fallback only if no other records
  const needsFallback = cityRecords.length === 0 && countryRecords.length === 0
  const fallbackRecords = needsFallback
    ? roleRecords.filter(r => r.region_scope === 'europe' || r.country_code === 'EU')
    : []

  const candidates = [...cityRecords, ...countryRecords, ...fallbackRecords]
    .filter(r => r.currency !== undefined) // valid records only

  if (candidates.length === 0) return null

  // Build weighted salary points
  const points = []

  for (const r of candidates) {
    const geoWeight = (citySlug && r.city_slug === citySlug) ? 1.0
                    : r.region_scope === 'country' ? 0.7
                    : 0.3

    const weight = r.source_confidence * r.freshness_score * geoWeight * r.normalization_confidence
    if (weight <= 0) continue

    const base = r.salary_median ?? (r.salary_min != null && r.salary_max != null ? (r.salary_min + r.salary_max) / 2 : r.salary_min ?? r.salary_max)
    if (base == null) continue

    const adjusted = r.seniority_normalized === 'unknown'
      ? base
      : adjustForExperience(base, r.seniority_normalized, targetYears)

    points.push({ value: adjusted, weight })

    if (r.salary_min != null && r.salary_min !== base) {
      const adjMin = adjustForExperience(r.salary_min, r.seniority_normalized, targetYears)
      points.push({ value: adjMin, weight: weight * 0.5 })
    }
    if (r.salary_max != null && r.salary_max !== base) {
      const adjMax = adjustForExperience(r.salary_max, r.seniority_normalized, targetYears)
      points.push({ value: adjMax, weight: weight * 0.5 })
    }
  }

  if (points.length === 0) return null

  return {
    p25: Math.round(weightedPercentile(points, 0.25) / 1000) * 1000,
    p50: Math.round(weightedPercentile(points, 0.50) / 1000) * 1000,
    p75: Math.round(weightedPercentile(points, 0.75) / 1000) * 1000,
    recordCount: candidates.length,
  }
}

// ─── Band midpoint years ──────────────────────────────────────────────────────
// Comp-verdict band definitions → representative midpoint for querying real data

const BAND_MIDPOINTS = {
  junior: 1,
  mid:    4,
  senior: 8,
  staff:  15,
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Get all-band benchmark from real data for a given comp-verdict role + city label.
 *
 * Returns null if the role or city is not covered by the real dataset —
 * callers should fall back to the multiplier approach.
 *
 * @param {string} roleLabel  e.g. "Software Engineer"
 * @param {string} cityLabel  e.g. "London"
 * @returns {{ bands: object, currency: string, recordCount: number } | null}
 */
export function getRealBenchmark(roleLabel, cityLabel) {
  const roleSlug = ROLE_SLUG_MAP[roleLabel]
  const cityMeta = CITY_SLUG_MAP[cityLabel]

  // No real data for this role or city — caller uses multiplier fallback
  if (!roleSlug || !cityMeta) return null

  const bands = {}
  let totalRecords = 0

  for (const [band, midpointYears] of Object.entries(BAND_MIDPOINTS)) {
    const result = computeForBand(roleSlug, cityMeta.slug, cityMeta.country, midpointYears)
    if (!result) return null  // If any band fails, fall back entirely — partial data is worse than consistent data
    bands[band] = { p25: result.p25, p50: result.p50, p75: result.p75 }
    totalRecords = Math.max(totalRecords, result.recordCount)
  }

  // Determine currency from country code
  const currency = cityMeta.country === 'GB' ? 'GBP'
                 : cityMeta.country === 'CH' ? 'CHF'
                 : 'EUR'

  return { bands, currency, recordCount: totalRecords }
}
