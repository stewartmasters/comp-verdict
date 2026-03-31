import {
  LOCALES, SALARY_ROLES, slug, getSalaryPath, getNegPath, getHubPath, getHomePath,
  SITE_URL
} from '../lib/page-helpers.js'

export default function sitemap() {
  const urls = []
  const today = new Date().toISOString().split('T')[0]

  // Home pages
  urls.push({
    url: SITE_URL + '/',
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 1.0,
  })
  urls.push({
    url: SITE_URL + '/es/',
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 0.9,
  })
  urls.push({
    url: SITE_URL + '/de/',
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 0.9,
  })

  // Hub pages
  for (const locale of LOCALES) {
    urls.push({
      url: SITE_URL + getHubPath(locale, 'salary'),
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.8,
    })
    urls.push({
      url: SITE_URL + getHubPath(locale, 'negotiate'),
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  }

  // Salary pages
  for (const locale of LOCALES) {
    for (const role of SALARY_ROLES) {
      for (const city of locale.SALARY_CITIES) {
        urls.push({
          url: SITE_URL + getSalaryPath(locale, role, city),
          lastModified: today,
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      }
    }
  }

  // Negotiate pages
  for (const locale of LOCALES) {
    for (const role of SALARY_ROLES) {
      for (const city of locale.NEGOTIATE_CITIES) {
        urls.push({
          url: SITE_URL + getNegPath(locale, role, city),
          lastModified: today,
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      }
    }
  }

  // Privacy
  urls.push({
    url: SITE_URL + '/privacy/',
    lastModified: today,
    changeFrequency: 'monthly',
    priority: 0.3,
  })

  return urls
}
