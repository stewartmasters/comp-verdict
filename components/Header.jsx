'use client'

const NAV_LABELS = {
  en: { salary: 'Salaries', negotiate: 'Negotiate', cta: 'Check my offer →' },
  es: { salary: 'Salarios', negotiate: 'Negociar', cta: 'Analizar mi oferta →' },
  de: { salary: 'Gehälter', negotiate: 'Verhandeln', cta: 'Angebot prüfen →' },
}

const SALARY_PATH = { en: '/salary/', es: '/es/salarios/', de: '/de/gehalt/' }
const NEG_PATH    = { en: '/negotiate/', es: '/es/negociacion/', de: '/de/verhandlung/' }
const HOME_PATH   = { en: '/', es: '/es/', de: '/de/' }

export default function Header({ locale = 'en', currentPath = '' }) {
  const labels = NAV_LABELS[locale]

  function handleLangChange(e) {
    const dest = HOME_PATH[e.target.value]
    if (typeof window !== 'undefined') window.location.href = dest
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a href={HOME_PATH[locale]} className="cv-brand" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span className="word">Comp</span><span className="accent">Verdict</span>
        </a>
        <nav className="site-nav">
          <a href={SALARY_PATH[locale]} className="nav-text">{labels.salary}</a>
          <a href={NEG_PATH[locale]} className="nav-text">{labels.negotiate}</a>
          <div className="lang-select-wrap">
            <select
              defaultValue={locale}
              onChange={handleLangChange}
              aria-label="Language"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="de">DE</option>
            </select>
          </div>
          <a href={HOME_PATH[locale]} className="nav-pill">{labels.cta}</a>
        </nav>
      </div>
    </header>
  )
}
