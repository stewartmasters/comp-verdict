/**
 * CompVerdict SEO page generator.
 * Mirrors SalaryVerdict's seo-pages.ts structure but adapted for offer evaluation.
 *
 * Page types:
 *  - "role-city"     : [Role] salary in [City] — offer benchmark
 *  - "role-only"     : [Role] offer benchmarks across cities
 *  - "city-only"     : Offer benchmarks in [City]
 *  - "offer-question": Is [X] a good salary for [Role] in [City]?
 */

import { SALARY_ROLES, slug, getRange } from './helpers.js'
import en from '../i18n/en.js'

export { SALARY_ROLES, slug as slugify }

const YEAR = 2026

const LOCATION_CONTEXT = {
  'Barcelona':        'Barcelona is a vibrant tech hub with growing salaries — though pay still lags northern Europe, giving candidates negotiation room.',
  'Madrid':           'Madrid leads Spain as its primary business hub. Salaries are higher than Barcelona for most roles, though still below northern European levels.',
  'London':           'London is Europe\'s highest-paying market for most professional roles, with US-headquartered companies and financial institutions driving competition.',
  'Amsterdam':        'Amsterdam attracts international tech and product talent with salaries among the highest in continental Europe.',
  'Berlin':           'Berlin is Europe\'s startup capital. The salary market has matured significantly and international companies pay increasingly competitive rates.',
  'Munich':           'Munich offers Germany\'s highest salaries outside Berlin, driven by a dense automotive, finance, and tech cluster.',
  'Paris':            'Paris offers strong salaries — particularly in finance, luxury, and tech — backed by a growing startup ecosystem.',
  'Dublin':           'Dublin\'s US tech company headquarters have pushed salaries well above the European average for most professional roles.',
  'Lisbon':           'Lisbon is Europe\'s fastest-growing tech hub. Salaries are rising but remain below the EU average — creating negotiation opportunity.',
  'Frankfurt':        'Frankfurt is Germany\'s financial capital, with strong pay in finance, consulting, and tech operations roles.',
  'San Francisco':    'San Francisco remains one of the world\'s highest-paying tech markets. Equity and total comp expectations are significantly above base salary alone.',
  'New York':         'New York offers top-of-market salaries across finance, tech, and product — particularly in enterprise and fintech roles.',
  'Austin':           'Austin has emerged as a major US tech hub. Salaries trail San Francisco but have risen sharply as major companies expanded there.',
  'Toronto':          'Toronto is Canada\'s technology capital, with competitive salaries and a rapidly growing product and engineering talent market.',
  'Singapore':        'Singapore is Asia\'s most competitive tech market, with salaries comparable to European hubs and strong demand for senior talent.',
}

const ROLE_CONTEXT = {
  'Software Engineer':       'Software engineers command strong premiums across all markets. Demand consistently outpaces supply, giving candidates real negotiating leverage.',
  'Product Manager':         'Product manager salaries have risen sharply as companies invest in product-led growth. Experienced PMs with strong track records are in high demand.',
  'Data Scientist':          'Data scientists command top-of-market pay, particularly in finance, tech, and healthcare. Senior data science roles often include significant equity.',
  'Engineering Manager':     'Engineering managers earn a meaningful premium over ICs, particularly at growth-stage companies. Leadership and cross-functional scope drive compensation significantly.',
  'Frontend Engineer':       'Frontend engineers with strong React expertise are well compensated. Demand for polished user experiences has driven salaries close to backend equivalents.',
  'Backend Engineer':        'Backend engineers are core to most product teams. Experience with distributed systems or cloud infrastructure significantly increases earning potential.',
  'Full Stack Engineer':     'Full stack engineers are among the most versatile hires in tech. The ability to work across frontend and backend commands a premium at smaller product companies.',
  'DevOps Engineer':         'DevOps and platform engineers are among the highest earners in tech, with consistent demand across all markets. Remote work has further increased competition.',
  'Machine Learning Engineer': 'Machine learning engineers combine strong CS fundamentals with specialised ML knowledge, commanding some of the highest salaries in the industry.',
  'UX Designer':             'Senior UX designers and product designers at product-led companies can earn close to engineering equivalents. The market has matured significantly in the last few years.',
}

// Cities to generate pages for (primary markets)
export const SEO_CITIES = [
  'London', 'Berlin', 'Amsterdam', 'Paris', 'Dublin',
  'Barcelona', 'Madrid', 'Lisbon', 'Munich', 'Frankfurt',
  'San Francisco', 'New York', 'Austin', 'Toronto', 'Singapore',
]

export function getLocationContext(city) {
  return LOCATION_CONTEXT[city] || `${city} is an active market for professional roles.`
}

export function getRoleContext(role) {
  return ROLE_CONTEXT[role] || `${role}s are in demand across most markets.`
}

export function getIntroVariant(slug) {
  let hash = 0
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) | 0
  return Math.abs(hash) % 3
}

let _cache = null

export function generateSeoPages() {
  if (_cache) return _cache

  const pages = []

  // Role + City pages (primary: highest priority)
  for (const role of SALARY_ROLES) {
    for (const city of SEO_CITIES) {
      const data = getRange(role, city)
      if (!data) continue

      const { bands, symbol } = data
      const mid = bands.mid
      if (!mid) continue

      const s = `${slug(role)}-salary-${slug(city)}`
      const p50Fmt = symbol + Math.round(mid.p50 / 1000) + 'k'
      const p25Fmt = symbol + Math.round(mid.p25 / 1000) + 'k'
      const p75Fmt = symbol + Math.round(mid.p75 / 1000) + 'k'

      pages.push({
        slug: s,
        type: 'role-city',
        role,
        city,
        h1: `${role} Salary in ${city} (${YEAR}) — Offer Benchmark`,
        title: `${role} Salary in ${city} (${YEAR}) — Is Your Offer Good?`,
        description: `Is your ${role} offer in ${city} competitive? Mid-level range: ${p25Fmt}–${p75Fmt}, median ${p50Fmt}. Full breakdown by experience band. Check your offer instantly.`,
        mid,
        bands,
        symbol,
      })
    }
  }

  // Role-only hub pages
  for (const role of SALARY_ROLES) {
    pages.push({
      slug: `${slug(role)}-salary`,
      type: 'role-only',
      role,
      h1: `${role} Salary Benchmarks — Is Your Offer Good?`,
      title: `${role} Salary Benchmarks ${YEAR} — Offer Evaluation by City`,
      description: `${role} salary benchmarks across 15 cities. See if your offer is fair, weak, or strong for your city and experience level.`,
      mid: null,
      bands: null,
      symbol: null,
    })
  }

  _cache = pages
  return pages
}

export function getSeoPage(slugParam) {
  return generateSeoPages().find((p) => p.slug === slugParam) || null
}

export function getRelatedPages(page) {
  const all = generateSeoPages()
  if (page.type === 'role-city') {
    // Same role, other cities + same city, other roles
    const sameRole = all.filter(
      (p) => p.type === 'role-city' && p.role === page.role && p.city !== page.city
    ).slice(0, 5)
    const sameCity = all.filter(
      (p) => p.type === 'role-city' && p.city === page.city && p.role !== page.role
    ).slice(0, 5)
    return [...sameRole, ...sameCity].slice(0, 8)
  }
  return []
}
