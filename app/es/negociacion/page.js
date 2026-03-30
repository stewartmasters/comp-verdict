import { es, buildHubHreflangs, getHomePath, getHubPath, getNegPath, getSalaryPath, SITE_URL } from '../../../lib/page-helpers.js'
import HubPageContent from '../../../components/HubPageContent.jsx'
import Navigation from '../../../components/Navigation.jsx'
import Footer from '../../../components/Footer.jsx'

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
      <Navigation />
            <HubPageContent type="negotiate" locale={locale} getSalaryPathFn={getSalaryPath} getNegPathFn={getNegPath} homePath={homePath} salaryHubPath={salaryHubPath} negHubPath={negHubPath} />
      <Footer locale="es" />
    </>
  )
}
