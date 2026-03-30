import {
  es, SALARY_ROLES, slug, buildNegPageProps, buildNegSlugMap,
  getSalaryPath, getNegPath, getHomePath, getHubPath, SITE_URL
} from '../../../../lib/page-helpers.js'
import NegotiatePageContent from '../../../../components/NegotiatePageContent.jsx'
import SeoHeader from '../../../../components/SeoHeader.jsx'
import SeoFooter from '../../../../components/SeoFooter.jsx'

const locale = es
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

export default async function EsNegociacioPage({ params }) {
  const { slug: slugParam } = await params
  const match = slugMap[slugParam]
  if (!match) return <div>Page not found</div>

  const props = buildNegPageProps(locale, match.role, match.city)
  if (!props) return <div>Data not available</div>

  const homePath      = getHomePath(locale)
  const salaryHubPath = getHubPath(locale, 'salary')
  const negHubPath    = getHubPath(locale, 'negotiate')

  return (
    <>
      <SeoHeader homePath={homePath} salaryHubPath={salaryHubPath} negHubPath={negHubPath} locale={locale} hreflangs={props.hreflangs} />
      <NegotiatePageContent
        locale={locale} role={match.role} city={match.city}
        bands={props.bands} symbol={props.symbol}
        hreflangs={props.hreflangs} negHubPath={props.negHubPath}
        homePath={props.homePath} salaryPath={props.salaryPath}
        relatedRoles={props.relatedRoles} relatedCities={props.relatedCities}
        jsonLd={props.jsonLd} getNegPathFn={getNegPath} getSalaryPathFn={getSalaryPath}
      />
      <SeoFooter homePath={homePath} salaryHubPath={salaryHubPath} negHubPath={negHubPath} locale={locale} />
    </>
  )
}
