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
  'Hamburg':          'Hamburg is Germany\'s second-largest city and a major hub for media, logistics, and growing tech companies, with salaries close to the German average.',
  'Paris':            'Paris offers strong salaries — particularly in finance, luxury, and tech — backed by a growing startup ecosystem.',
  'Dublin':           'Dublin\'s US tech company headquarters have pushed salaries well above the European average for most professional roles.',
  'Lisbon':           'Lisbon is Europe\'s fastest-growing tech hub. Salaries are rising but remain below the EU average — creating negotiation opportunity.',
  'Frankfurt':        'Frankfurt is Germany\'s financial capital, with strong pay in finance, consulting, and tech operations roles.',
  'Milan':            'Milan is Italy\'s economic capital, with the highest salaries in the country across tech, finance, and design. International companies drive premium compensation.',
  'Stockholm':        'Stockholm is Scandinavia\'s tech capital, home to Spotify, Klarna, and a dense startup ecosystem. Salaries are strong and benefits packages often include generous equity.',
  'Copenhagen':       'Copenhagen offers high salaries backed by Denmark\'s strong labour market. The tech and life sciences sectors lead compensation, with a healthy work-life balance culture.',
  'Zurich':           'Zurich is one of the world\'s highest-paying cities. Finance and tech roles command exceptional salaries, with total comp packages that rival San Francisco.',
  'Warsaw':           'Warsaw is Central Europe\'s fastest-growing tech hub. Salaries are rising quickly and offer strong purchasing power relative to western European markets.',
  'San Francisco':    'San Francisco remains one of the world\'s highest-paying tech markets. Equity and total comp expectations are significantly above base salary alone.',
  'New York':         'New York offers top-of-market salaries across finance, tech, and product — particularly in enterprise and fintech roles.',
  'Austin':           'Austin has emerged as a major US tech hub. Salaries trail San Francisco but have risen sharply as major companies expanded there.',
  'Seattle':          'Seattle is home to Amazon, Microsoft, and a dense tech employer base. Salaries and equity packages are consistently among the highest in the US.',
  'Boston':           'Boston\'s concentration of biotech, fintech, and enterprise software companies drives strong salaries, particularly for technical and analytical roles.',
  'Chicago':          'Chicago offers competitive salaries across finance, tech, and operations — with a lower cost of living than coastal US cities giving offers strong real-world value.',
  'Toronto':          'Toronto is Canada\'s technology capital, with competitive salaries and a rapidly growing product and engineering talent market.',
  'Sydney':           'Sydney is Australia\'s highest-paying market, with strong salaries in tech, finance, and product roles. The market is competitive and increasingly global.',
  'Singapore':        'Singapore is Asia\'s most competitive tech market, with salaries comparable to European hubs and strong demand for senior talent.',
  'Dubai':            'Dubai offers tax-free salaries that significantly increase take-home pay. The market is growing rapidly across tech, finance, and operations roles.',
}

const ROLE_CONTEXT = {
  // Engineering
  'Software Engineer':          'Software engineers command strong premiums across all markets. Demand consistently outpaces supply, giving candidates real negotiating leverage.',
  'Backend Engineer':           'Backend engineers are core to most product teams. Experience with distributed systems or cloud infrastructure significantly increases earning potential.',
  'Frontend Engineer':          'Frontend engineers with strong React expertise are well compensated. Demand for polished user experiences has driven salaries close to backend equivalents.',
  'Full Stack Engineer':        'Full stack engineers are among the most versatile hires in tech. The ability to work across frontend and backend commands a premium at smaller product companies.',
  'Mobile Engineer':            'Mobile engineers are in consistent demand across both iOS and Android platforms. Cross-platform experience with React Native or Flutter adds meaningful earning potential.',
  'iOS Engineer':               'iOS engineers with Swift expertise command strong salaries, particularly at consumer product companies where mobile is the primary surface.',
  'Android Engineer':           'Android engineers are in steady demand across consumer and enterprise markets. Kotlin expertise and experience with large-scale apps drives premium compensation.',
  'DevOps Engineer':            'DevOps and platform engineers are among the highest earners in tech, with consistent demand across all markets. Remote work has further increased competition.',
  'Site Reliability Engineer':  'SREs combine software engineering with operations expertise, commanding salaries at or above standard software engineering rates at most companies.',
  'Platform Engineer':          'Platform engineers who build internal developer tooling and infrastructure are increasingly valued, with salaries that rival senior IC engineering roles.',
  'Security Engineer':          'Security engineers are in high demand across all sectors. Specialisations in cloud security, AppSec, or threat modelling command significant premiums.',
  'QA Engineer':                'QA engineers with test automation expertise earn meaningfully more than manual testers. The shift to shift-left testing has elevated the role\'s strategic importance.',
  // Data & ML
  'Data Scientist':             'Data scientists command top-of-market pay, particularly in finance, tech, and healthcare. Senior data science roles often include significant equity.',
  'Data Engineer':              'Data engineers who build and maintain data pipelines are in strong demand. Cloud platform expertise (Spark, Airflow, dbt) significantly boosts earning potential.',
  'Machine Learning Engineer':  'Machine learning engineers combine strong CS fundamentals with specialised ML knowledge, commanding some of the highest salaries in the industry.',
  // Product & Management
  'Product Manager':            'Product manager salaries have risen sharply as companies invest in product-led growth. Experienced PMs with strong track records are in high demand.',
  'Engineering Manager':        'Engineering managers earn a meaningful premium over ICs, particularly at growth-stage companies. Leadership and cross-functional scope drive compensation significantly.',
  // Design
  'UX Designer':                'Senior UX designers and product designers at product-led companies can earn close to engineering equivalents. The market has matured significantly in the last few years.',
  'UI Designer':                'UI designers with strong visual systems and component library experience are well compensated at product companies. Figma proficiency is now table stakes.',
  'Product Designer':           'Product designers who can own end-to-end design — from research through to delivery — command a premium. The role has converged with UX in most product companies.',
  // Business
  'Marketing Manager':          'Marketing managers with digital and performance marketing expertise command competitive salaries. B2B SaaS and fintech are among the highest-paying verticals.',
  'Growth Manager':             'Growth managers who can own acquisition, activation, and retention metrics are in high demand, particularly at product-led companies. Data fluency commands a premium.',
  'Finance Analyst':            'Finance analysts with FP&A or investment analysis experience are well compensated across sectors. CFA progress and modelling skills significantly increase earning potential.',
  'Operations Manager':         'Operations managers at tech and scale-up companies increasingly command competitive salaries, particularly where they own cross-functional delivery or process improvement.',
}

// Cities to generate pages for (primary markets)
export const SEO_CITIES = [
  // UK & Ireland
  'London', 'Dublin',
  // Germany
  'Berlin', 'Munich', 'Frankfurt', 'Hamburg',
  // Western Europe
  'Amsterdam', 'Paris', 'Lisbon',
  // Southern Europe
  'Barcelona', 'Madrid', 'Milan',
  // Northern Europe
  'Stockholm', 'Copenhagen',
  // Switzerland & CEE
  'Zurich', 'Warsaw',
  // North America
  'San Francisco', 'New York', 'Austin', 'Seattle', 'Boston', 'Chicago', 'Toronto',
  // APAC & Middle East
  'Singapore', 'Sydney', 'Dubai',
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
