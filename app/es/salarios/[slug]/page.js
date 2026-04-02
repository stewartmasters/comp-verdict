import { notFound } from 'next/navigation'
import {
  es, SALARY_ROLES, slug, buildSalaryPageProps, buildSalarySlugMap,
  getSalaryPath, getNegPath, getHomePath, getHubPath, SITE_URL
} from '../../../../lib/page-helpers.js'
import SalaryPageContent from '../../../../components/SalaryPageContent.jsx'
import Navigation from '../../../../components/Navigation.jsx'
import Footer from '../../../../components/Footer.jsx'
import PageTracker from '../../../../components/PageTracker.jsx'

export const dynamic = 'force-static'
export const dynamicParams = false

const locale = es
const slugMap = buildSalarySlugMap(locale)

export function generateStaticParams() {
  return SALARY_ROLES.flatMap(role =>
    locale.SALARY_CITIES.map(city => ({
      slug: `${slug(role)}-${locale.salarySlugWord}-${slug(city)}`,
    }))
  )
}

export async function generateMetadata({ params }) {
  const { slug: slugParam } = await params
  const match = slugMap[slugParam]
  if (!match) return {}
  const props = buildSalaryPageProps(locale, match.role, match.city)
  if (!props) return {}
  const languages = {}
  for (const h of props.hreflangs) languages[h.hreflang] = h.href
  return {
    title: props.title,
    description: props.description,
    alternates: { canonical: SITE_URL + props.canonPath, languages },
  }
}

export default async function EsSalaryPage({ params }) {
  const { slug: slugParam } = await params
  const match = slugMap[slugParam]
  if (!match) notFound()

  const props = buildSalaryPageProps(locale, match.role, match.city)
  if (!props) notFound()

  const homePath      = getHomePath(locale)
  const salaryHubPath = getHubPath(locale, 'salary')
  const negHubPath    = getHubPath(locale, 'negotiate')

  return (
    <>
      <Navigation />
      <PageTracker event="salary_page_view" role={match.role} city={match.city} locale="es" />
            <SalaryPageContent
        locale={locale} role={match.role} city={match.city}
        bands={props.bands} symbol={props.symbol} faqs={props.faqs}
        hreflangs={props.hreflangs} salaryHubPath={props.salaryHubPath}
        homePath={props.homePath} negPath={props.negPath}
        relatedCities={props.relatedCities} relatedRoles={props.relatedRoles}
        jsonLd={props.jsonLd} getSalaryPathFn={getSalaryPath} getNegPathFn={getNegPath}
      />
      <Footer locale="es" />
    </>
  )
}
