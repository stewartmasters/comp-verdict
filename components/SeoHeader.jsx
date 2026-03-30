export default function SeoHeader({ homePath, salaryHubPath, negHubPath, locale, hreflangs }) {
  const navSalary = locale.footerLinkSalary || 'Salary Benchmarks'
  const navNeg    = locale.footerLinkNeg    || 'Negotiation Guides'
  const navTool   = locale.footerLinkTool   || 'Try CompVerdict'

  const langNames = { en: 'EN', es: 'ES', de: 'DE' }
  const langSwitcher = ['en', 'es', 'de'].map(code => {
    const link = (hreflangs || []).find(h => h.hreflang === code)
    if (!link) return null
    const isActive = code === locale.htmlLang
    return isActive
      ? <span key={code} className="lang-active">{langNames[code]}</span>
      : <a key={code} href={link.href}>{langNames[code]}</a>
  }).filter(Boolean)

  const withSeps = langSwitcher.reduce((acc, el, i) => {
    if (i > 0) acc.push(<span key={`s${i}`} style={{ color: '#e5e7eb', padding: '0 2px' }}>·</span>)
    acc.push(el)
    return acc
  }, [])

  return (
    <header>
      <div className="wrap">
        <div className="header-inner">
          <div className="header-left">
            <div className="brand">
              <a href={homePath} style={{ color: 'inherit', textDecoration: 'none' }}>
                Comp<span>Verdict</span>
              </a>
            </div>
            <nav className="nav-links">
              <a href={salaryHubPath}>{navSalary}</a>
              <a href={negHubPath}>{navNeg}</a>
              <a href={homePath} className="nav-cta">{navTool} →</a>
            </nav>
          </div>
          {withSeps.length > 0 && (
            <div className="lang-sw">{withSeps}</div>
          )}
        </div>
      </div>
    </header>
  )
}
