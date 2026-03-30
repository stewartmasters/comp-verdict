import { CV_DATA } from './cv-data.js'

export function slug(str) {
  return str.toLowerCase()
    .replace(/[()]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/-$/, '')
}

export function fmt(n, symbol) {
  if (!n) return symbol + '0'
  if (n >= 1000000) return symbol + (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000)    return symbol + Math.round(n / 1000) + 'k'
  return symbol + n.toLocaleString()
}

export function getRange(role, city) {
  const cityMeta = CV_DATA.cities[city]
  if (!cityMeta) return null

  let benchmarks = CV_DATA.benchmarks[city]
  if (!benchmarks) {
    const defaultCity = CV_DATA.markets[cityMeta.market]?.defaultCity
    if (defaultCity && CV_DATA.benchmarks[defaultCity]) {
      benchmarks = CV_DATA.benchmarks[defaultCity]
    }
  }
  if (!benchmarks) return null

  const roleConfig = CV_DATA.roles[role] || { mul: 1.0 }
  const mul = roleConfig.override?.[cityMeta.market] ?? roleConfig.mul
  const { symbol } = cityMeta

  const bands = {}
  for (const band of ['junior', 'mid', 'senior', 'staff']) {
    const b = benchmarks[band]
    if (!b) continue
    bands[band] = {
      p25: Math.round(b.p25 * mul),
      p50: Math.round(b.p50 * mul),
      p75: Math.round(b.p75 * mul),
    }
  }
  return { bands, symbol }
}

export const SALARY_ROLES = [
  // Engineering
  'Software Engineer',
  'Backend Engineer',
  'Frontend Engineer',
  'Full Stack Engineer',
  'Mobile Engineer',
  'iOS Engineer',
  'Android Engineer',
  'DevOps Engineer',
  'Site Reliability Engineer',
  'Platform Engineer',
  'Security Engineer',
  'QA Engineer',
  // Data & ML
  'Data Scientist',
  'Data Engineer',
  'Machine Learning Engineer',
  // Product & Management
  'Product Manager',
  'Engineering Manager',
  // Design
  'UX Designer',
  'UI Designer',
  'Product Designer',
  // Business
  'Marketing Manager',
  'Growth Manager',
  'Finance Analyst',
  'Operations Manager',
]

export const SITE_URL = 'https://www.compverdict.com'

export function localePrefix(locale) {
  return locale.code === 'en' ? '' : `/${locale.code}`
}

export function getSalaryPath(locale, role, city) {
  const pre = localePrefix(locale)
  return `${pre}/${locale.salarySection}/${slug(role)}-${locale.salarySlugWord}-${slug(city)}/`
}

export function getNegPath(locale, role, city) {
  const pre = localePrefix(locale)
  return `${pre}/${locale.negotiateSection}/${slug(role)}-${locale.negSlugWord}-${slug(city)}/`
}

export function getHubPath(locale, type) {
  const pre = localePrefix(locale)
  const section = type === 'salary' ? locale.salarySection : locale.negotiateSection
  return `${pre}/${section}/`
}

export function getHomePath(locale) {
  return locale.code === 'en' ? '/' : `/${locale.code}/`
}
