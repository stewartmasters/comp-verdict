import { CV_DATA } from './cv-data.js'
import en from '../i18n/en.js'
import es from '../i18n/es.js'
import de from '../i18n/de.js'
import {
  slug, getRange, getSalaryPath, getNegPath, getHubPath, getHomePath,
  SALARY_ROLES, SITE_URL
} from './helpers.js'

export const LOCALES = [en, es, de]
export const EN = en

export { slug, getRange, getSalaryPath, getNegPath, getHubPath, getHomePath, SALARY_ROLES, SITE_URL, CV_DATA }
export { en, es, de }

export function buildSalaryHreflangs(role, city) {
  const links = []
  for (const loc of LOCALES) {
    if (!loc.SALARY_CITIES.includes(city)) continue
    links.push({ hreflang: loc.htmlLang, href: SITE_URL + getSalaryPath(loc, role, city) })
  }
  if (EN.SALARY_CITIES.includes(city)) {
    links.push({ hreflang: 'x-default', href: SITE_URL + getSalaryPath(EN, role, city) })
  }
  return links
}

export function buildNegHreflangs(role, city) {
  const links = []
  for (const loc of LOCALES) {
    if (!loc.NEGOTIATE_CITIES.includes(city)) continue
    links.push({ hreflang: loc.htmlLang, href: SITE_URL + getNegPath(loc, role, city) })
  }
  if (EN.NEGOTIATE_CITIES.includes(city)) {
    links.push({ hreflang: 'x-default', href: SITE_URL + getNegPath(EN, role, city) })
  }
  return links
}

export function buildHubHreflangs(type) {
  return [
    ...LOCALES.map(loc => ({ hreflang: loc.htmlLang, href: SITE_URL + getHubPath(loc, type) })),
    { hreflang: 'x-default', href: SITE_URL + getHubPath(EN, type) },
  ]
}

export function buildSalaryPageProps(locale, role, city) {
  const data = getRange(role, city)
  if (!data) return null
  const { bands, symbol } = data
  const mid = bands.mid
  const senior = bands.senior
  if (!mid) return null

  const canonPath = getSalaryPath(locale, role, city)
  const title       = locale.salaryTitleTpl(role, city)
  const description = locale.salaryDescTpl(role, city, mid.p25, mid.p50, mid.p75, symbol)

  const seniorJump = senior
    ? Math.round(((senior.p50 - mid.p50) / mid.p50) * 100) : null
  const juniorJump = bands.junior
    ? Math.round(((mid.p50 - bands.junior.p50) / bands.junior.p50) * 100) : null
  const cityDescFull = locale.CITY_DESC[city] || ''
  const cityDescFirst = cityDescFull ? cityDescFull.split('.')[0] + '.' : `${city} has an active tech hiring market.`

  const faqs = [
    {
      q: locale.faqQ1(role, city),
      a: locale.faqA1(role, city, bands.junior?.p25 || 0, mid.p50, senior?.p50 || 0, symbol),
    },
    {
      q: locale.faqQ2(role, city),
      a: locale.faqA2(role, city, mid.p50, mid.p75, senior?.p50 || 0, symbol),
    },
    {
      q: locale.faqQ3(role, city),
      a: locale.faqA3(role, city, seniorJump, juniorJump),
    },
    {
      q: locale.faqQ4(role, city),
      a: locale.faqA4(role, city, mid.p50, symbol, cityDescFirst),
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const hreflangs    = buildSalaryHreflangs(role, city)
  const relatedRoles = SALARY_ROLES.filter(r => r !== role).slice(0, 6)
  const relatedCities = locale.SALARY_CITIES.filter(c => c !== city).slice(0, 8)
  const negPath = locale.NEGOTIATE_CITIES.includes(city) ? getNegPath(locale, role, city) : null

  return {
    title, description, canonPath, bands, symbol, faqs, jsonLd, hreflangs,
    salaryHubPath: getHubPath(locale, 'salary'),
    homePath: getHomePath(locale),
    negPath, relatedRoles, relatedCities,
  }
}

export function buildNegPageProps(locale, role, city) {
  const data = getRange(role, city)
  if (!data) return null
  const { bands, symbol } = data
  const mid = bands.mid
  const senior = bands.senior
  if (!mid) return null

  const canonPath   = getNegPath(locale, role, city)
  const title       = locale.negTitleTpl(role, city)
  const description = locale.negDescTpl(role, city, mid.p25, mid.p50, mid.p75, symbol)

  const steps = locale.negSteps(role, city, mid.p50, mid.p25, mid.p75, senior?.p50 || 0, symbol)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description,
    step: steps.map(s => ({
      '@type': 'HowToStep',
      name: s.title,
      text: s.body,
    })),
  }

  const hreflangs    = buildNegHreflangs(role, city)
  const relatedRoles = SALARY_ROLES.filter(r => r !== role).slice(0, 5)
  const relatedCities = locale.NEGOTIATE_CITIES.filter(c => c !== city)
  const salaryPath  = locale.SALARY_CITIES.includes(city) ? getSalaryPath(locale, role, city) : null

  return {
    title, description, canonPath, bands, symbol, jsonLd, hreflangs,
    negHubPath: getHubPath(locale, 'negotiate'),
    homePath: getHomePath(locale),
    salaryPath, relatedRoles, relatedCities,
  }
}

// Reverse lookup: slug -> {role, city}
export function buildSalarySlugMap(locale) {
  const map = {}
  for (const role of SALARY_ROLES) {
    for (const city of locale.SALARY_CITIES) {
      const s = `${slug(role)}-${locale.salarySlugWord}-${slug(city)}`
      map[s] = { role, city }
    }
  }
  return map
}

export function buildNegSlugMap(locale) {
  const map = {}
  for (const role of SALARY_ROLES) {
    for (const city of locale.NEGOTIATE_CITIES) {
      const s = `${slug(role)}-${locale.negSlugWord}-${slug(city)}`
      map[s] = { role, city }
    }
  }
  return map
}
