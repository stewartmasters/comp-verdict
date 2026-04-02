import { notFound } from 'next/navigation'
import {
  de, SALARY_ROLES, slug, buildNegPageProps, buildNegSlugMap,
  getSalaryPath, getNegPath, getHomePath, getHubPath, SITE_URL
} from '../../../../lib/page-helpers.js'
import NegotiatePageContent from '../../../../components/NegotiatePageContent.jsx'
import Navigation from '../../../../components/Navigation.jsx'
import Footer from '../../../../components/Footer.jsx'
import PageTracker from '../../../../components/PageTracker.jsx'

export const dynamic = 'force-static'
export const dynamicParams = false

const locale = de
const slugMap = buildNegSlugMap(locale)

export function generateStaticParams() {
  return SALARY_ROLES.flatMap(role =>
    locale.NEGOTIATE_CITIES.map(city => ({
      slug: `${slug(role)}-${locale.negSlugWord}-${slug(city)}`,
    }))
  )
}

export async function generateMetadata({ params }) {
  const { slug: slugParam } = await params
  const match = slugMap[slugParam]
  if (!match) return {}
  const props = buildNegPageProps(locale, match.role, match.city)
  if (!props) return {}
  const languages = {}
  for (const h of props.hreflangs) languages[h.hreflang] = h.href
  return {
    title: props.title,
    description: props.description,
    alternates: { canonical: SITE_URL + props.canonPath, languages },
  }
}

export default async function DeVerhandlungPage({ params }) {
  const { slug: slugParam } = await params
  const match = slugMap[slugParam]
  if (!match) notFound()

  const props = buildNegPageProps(locale, match.role, match.city)
  if (!props) notFound()

  const homePath      = getHomePath(locale)
  const salaryHubPath = getHubPath(locale, 'salary')
  const negHubPath    = getHubPath(locale, 'negotiate')

  return (
    <>
      <Navigation />
      <PageTracker event="negotiate_page_view" role={match.role} city={match.city} locale="de" />
            <NegotiatePageContent
        locale={locale} role={match.role} city={match.city}
        bands={props.bands} symbol={props.symbol}
        hreflangs={props.hreflangs} negHubPath={props.negHubPath}
        homePath={props.homePath} salaryPath={props.salaryPath}
        relatedRoles={props.relatedRoles} relatedCities={props.relatedCities}
        jsonLd={props.jsonLd} getNegPathFn={getNegPath} getSalaryPathFn={getSalaryPath}
      />
      <Footer locale="de" />
    </>
  )
}
