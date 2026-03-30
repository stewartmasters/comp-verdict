/**
 * salaryData.js — Shared salary data layer for the Verdict product family.
 *
 * Single source of truth for all salary benchmarks used in CompVerdict.
 * Data sources and methodology mirror SalaryVerdict exactly.
 *
 * Sources:
 *   BLS OEWS   — US Bureau of Labor Statistics (public domain)
 *   ONS ASHE   — UK Office for National Statistics (OGL v3)
 *   INE EES    — Spain Instituto Nacional de Estadística (CC-BY)
 *   Destatis   — Germany Federal Statistical Office (dl-de/by-2-0)
 *   Stack Overflow Developer Survey — ODbL
 *
 * Methodology:
 *   - Government sources (BLS/ONS/INE/Destatis) weighted 3× vs survey data
 *   - Software Engineer at mid-band is the baseline per market
 *   - All other roles derived as market-validated multipliers
 *   - Band scaling validated against known data points:
 *       Junior ≈ 57% of mid-band · Senior ≈ 159% · Staff ≈ 208%
 *   - City fallback: secondary cities use market default city benchmarks
 *
 * TODO: extract to @verdict/shared-data package when SalaryVerdict and
 * CompVerdict are co-located, to enforce a single physical data source.
 */

import { CV_DATA } from './cv-data.js'

/** All supported markets */
export function getMarkets() {
  return CV_DATA.markets
}

/** All supported cities with metadata */
export function getCities() {
  return CV_DATA.cities
}

/** All supported roles with multipliers */
export function getRoles() {
  return CV_DATA.roles
}

/** Experience bands */
export function getBands() {
  return CV_DATA.bands
}

/**
 * Convert years of experience to a band ID.
 * @param {number|string} yoe
 * @returns {'junior'|'mid'|'senior'|'staff'}
 */
export function yoeToBand(yoe) {
  const y = parseInt(yoe) || 0
  if (y <= 2)  return 'junior'
  if (y <= 5)  return 'mid'
  if (y <= 10) return 'senior'
  return 'staff'
}

/**
 * Get salary benchmark for a role/city/experience combination.
 * Returns p10, p25, p50, p75, p90 with currency symbol.
 * Falls back to market default city if city-level data is unavailable.
 *
 * @param {string} role
 * @param {string} city
 * @param {number|string} yoe
 * @returns {{ p10, p25, p50, p75, p90, band, fallbackCity, symbol } | null}
 */
export function getBenchmark(role, city, yoe) {
  const band     = yoeToBand(yoe)
  const cityMeta = CV_DATA.cities[city]
  if (!cityMeta) return null

  let benchmarks   = CV_DATA.benchmarks[city]
  let fallbackCity = null

  if (!benchmarks) {
    const marketDef = CV_DATA.markets[cityMeta.market]?.defaultCity
    if (marketDef && CV_DATA.benchmarks[marketDef]) {
      fallbackCity = marketDef
      benchmarks   = CV_DATA.benchmarks[marketDef]
    }
  }
  if (!benchmarks) return null

  const bandData = benchmarks[band]
  if (!bandData) return null

  const roleConfig = CV_DATA.roles[role] || { mul: 1.0 }
  const mul = roleConfig.override?.[cityMeta.market] ?? roleConfig.mul

  const p25 = Math.round(bandData.p25 * mul)
  const p50 = Math.round(bandData.p50 * mul)
  const p75 = Math.round(bandData.p75 * mul)
  const p10 = Math.round(p25 - 0.85 * (p50 - p25))
  const p90 = Math.round(p75 + 0.80 * (p75 - p50))

  return { p10, p25, p50, p75, p90, band, fallbackCity, symbol: cityMeta.symbol }
}

/**
 * Score a compensation value against a benchmark.
 * Returns percentile position 0–100.
 *
 * @param {number} totalComp
 * @param {{ p10, p25, p50, p75, p90 }} benchmark
 * @returns {number}
 */
export function scoreComp(totalComp, benchmark) {
  const { p10, p25, p50, p75, p90 } = benchmark
  if (totalComp <= p10) return Math.max(0, (totalComp / p10) * 10)
  if (totalComp <= p25) return 10 + ((totalComp - p10) / (p25 - p10)) * 15
  if (totalComp <= p50) return 25 + ((totalComp - p25) / (p50 - p25)) * 25
  if (totalComp <= p75) return 50 + ((totalComp - p50) / (p75 - p50)) * 25
  if (totalComp <= p90) return 75 + ((totalComp - p75) / (p90 - p75)) * 15
  return Math.min(100, 90 + ((totalComp - p90) / p90) * 10)
}

/**
 * Derive verdict tier from percentile.
 * @param {number} percentile
 * @returns {'weak'|'fair'|'strong'}
 */
export function getVerdictTier(percentile) {
  if (percentile < 25) return 'weak'
  if (percentile < 63) return 'fair'
  return 'strong'
}

/**
 * Get confidence level for a city.
 * High: ES, UK, DE — government data with role/band breakdown
 * Med: all others — derived from survey data
 *
 * @param {string} city
 * @returns {'high'|'med'}
 */
export function getConfidenceLevel(city) {
  const meta = CV_DATA.cities[city]
  if (!meta) return 'med'
  return ['ES', 'UK', 'DE'].includes(meta.market) ? 'high' : 'med'
}
