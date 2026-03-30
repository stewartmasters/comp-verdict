import { generateSeoPages } from '../lib/seo-pages.js'
import { LOCALES, getSalaryPath, getNegPath, getHubPath, SITE_URL as LEGACY_SITE_URL } from '../lib/page-helpers.js'
import { SALARY_ROLES } from '../lib/helpers.js'

export const dynamic = 'force-static'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.compverdict.com'

export default function sitemap() {
  const seoPages = generateSeoPages()
  const now = new Date()

  // Static routes
  const staticRoutes = [
    { url: BASE_URL + '/',             lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: BASE_URL + '/es/',          lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: BASE_URL + '/de/',          lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: BASE_URL + '/methodology/', lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: BASE_URL + '/privacy/',     lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: BASE_URL + '/negotiate/',   lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: BASE_URL + '/salary/',      lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]

  // SEO offer/salary pages
  const salaryRoutes = seoPages.map((p) => ({
    url: `${BASE_URL}/salary/${p.slug}/`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: p.type === 'role-city' ? 0.9 : 0.7,
  }))

  // Multilingual salary pages (existing system — legacy)
  const legacySalaryRoutes = []
  for (const locale of LOCALES) {
    for (const role of SALARY_ROLES) {
      for (const city of locale.SALARY_CITIES) {
        legacySalaryRoutes.push({
          url: BASE_URL + getSalaryPath(locale, role, city),
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      }
    }
  }

  // Negotiate pages
  const negRoutes = []
  for (const locale of LOCALES) {
    for (const role of SALARY_ROLES) {
      for (const city of locale.NEGOTIATE_CITIES) {
        negRoutes.push({
          url: BASE_URL + getNegPath(locale, role, city),
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      }
    }
  }

  return [...staticRoutes, ...salaryRoutes, ...legacySalaryRoutes, ...negRoutes]
}
