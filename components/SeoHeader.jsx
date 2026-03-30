export default function SeoHeader({ homePath, salaryHubPath, negHubPath, locale, hreflangs }) {
  const navSalary = locale.footerLinkSalary || 'Salaries'
  const navNeg    = locale.footerLinkNeg    || 'Negotiate'

  const langItems = ['en', 'es', 'de'].map((code, i) => {
    const link    = (hreflangs || []).find(h => h.hreflang === code)
    if (!link) return null
    const isActive = code === locale.htmlLang
    return (
      <span key={code} style={{ display: 'inline-flex', alignItems: 'center', gap: '1px' }}>
        {i > 0 && <span className="lang-sep">·</span>}
        {isActive
          ? <span className="lang-active">{code.toUpperCase()}</span>
          : <a href={link.href}>{code.toUpperCase()}</a>}
      </span>
    )
  }).filter(Boolean)

  return (
    <header className="site-header">
      <div className="site-header-inner wide">
        <a href={homePath} className="cv-brand" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span className="word">Comp</span><span className="accent">Verdict</span>
        </a>
        <nav className="site-nav">
          <a href={salaryHubPath} className="nav-text">{navSalary}</a>
          <a href={negHubPath} className="nav-text">{navNeg}</a>
          {langItems.length > 0 && (
            <div className="lang-links">{langItems}</div>
          )}
          <a href={homePath} className="nav-pill">Check this offer →</a>
        </nav>
      </div>
    </header>
  )
}
