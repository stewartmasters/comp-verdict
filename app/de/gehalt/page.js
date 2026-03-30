import { de, buildHubHreflangs, getHomePath, getHubPath, getNegPath, getSalaryPath, SITE_URL } from '../../../lib/page-helpers.js'
import HubPageContent from '../../../components/HubPageContent.jsx'
import Navigation from '../../../components/Navigation.jsx'
import Footer from '../../../components/Footer.jsx'

const locale = de
const hreflangs = buildHubHreflangs('salary')

export const metadata = {
  title: locale.salaryHubTitle,
  description: locale.salaryHubDesc,
  alternates: { canonical: SITE_URL + getHubPath(locale, 'salary') },
}

export default function DeGehaltHubPage() {
  const homePath      = getHomePath(locale)
  const salaryHubPath = getHubPath(locale, 'salary')
  const negHubPath    = getHubPath(locale, 'negotiate')

  return (
    <>
      <Navigation />
            <HubPageContent type="salary" locale={locale} getSalaryPathFn={getSalaryPath} getNegPathFn={getNegPath} homePath={homePath} salaryHubPath={salaryHubPath} negHubPath={negHubPath} />
      <Footer locale="de" />
    </>
  )
}
