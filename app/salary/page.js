import { en, buildHubHreflangs, getHomePath, getHubPath, getNegPath, getSalaryPath, SITE_URL } from '../../lib/page-helpers.js'
import HubPageContent from '../../components/HubPageContent.jsx'
import SeoHeader from '../../components/SeoHeader.jsx'
import SeoFooter from '../../components/SeoFooter.jsx'

const locale = en
const hreflangs = buildHubHreflangs('salary')

export const metadata = {
  title: locale.salaryHubTitle,
  description: locale.salaryHubDesc,
  alternates: {
    canonical: SITE_URL + getHubPath(locale, 'salary'),
  },
}

export default function SalaryHubPage() {
  const homePath     = getHomePath(locale)
  const salaryHubPath = getHubPath(locale, 'salary')
  const negHubPath   = getHubPath(locale, 'negotiate')

  return (
    <>
      <SeoHeader
        homePath={homePath}
        salaryHubPath={salaryHubPath}
        negHubPath={negHubPath}
        locale={locale}
        hreflangs={hreflangs}
      />
      <HubPageContent
        type="salary"
        locale={locale}
        getSalaryPathFn={getSalaryPath}
        getNegPathFn={getNegPath}
        homePath={homePath}
      />
      <SeoFooter homePath={homePath} salaryHubPath={salaryHubPath} negHubPath={negHubPath} locale={locale} />
    </>
  )
}
