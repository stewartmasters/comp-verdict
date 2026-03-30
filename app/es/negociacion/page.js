import { es, buildHubHreflangs, getHomePath, getHubPath, getNegPath, getSalaryPath, SITE_URL } from '../../../lib/page-helpers.js'
import HubPageContent from '../../../components/HubPageContent.jsx'
import SeoHeader from '../../../components/SeoHeader.jsx'
import SeoFooter from '../../../components/SeoFooter.jsx'

const locale = es
const hreflangs = buildHubHreflangs('negotiate')

export const metadata = {
  title: locale.negHubTitle,
  description: locale.negHubDesc,
  alternates: { canonical: SITE_URL + getHubPath(locale, 'negotiate') },
}

export default function EsNegociacionHubPage() {
  const homePath      = getHomePath(locale)
  const salaryHubPath = getHubPath(locale, 'salary')
  const negHubPath    = getHubPath(locale, 'negotiate')

  return (
    <>
      <SeoHeader homePath={homePath} salaryHubPath={salaryHubPath} negHubPath={negHubPath} locale={locale} hreflangs={hreflangs} />
      <HubPageContent type="negotiate" locale={locale} getSalaryPathFn={getSalaryPath} getNegPathFn={getNegPath} homePath={homePath} />
      <SeoFooter homePath={homePath} salaryHubPath={salaryHubPath} negHubPath={negHubPath} locale={locale} />
    </>
  )
}
