'use client'

const SALARY_PATH  = { en: '/salary/', es: '/es/salarios/', de: '/de/gehalt/' }
const NEG_PATH     = { en: '/negotiate/', es: '/es/negociacion/', de: '/de/verhandlung/' }
const HOME_PATH    = { en: '/', es: '/es/', de: '/de/' }

const FOOTER_LABELS = {
  en: {
    desc: 'Is this offer worth taking? Enter your package and get a data-backed verdict in seconds. Free, no sign-up required.',
    dataNote: 'Sources: BLS OEWS · ONS ASHE · INE EES · Stack Overflow Survey · ECB rates · Updated Q1 2025',
    toolsHead: 'Tools',
    guidesHead: 'Popular guides',
    offerEval: 'Offer evaluator',
    salaryBench: 'Salary benchmarks',
    negGuides: 'Negotiation guides',
    privacy: 'Privacy Policy',
    networkLabel: 'The Verdict network:',
    copyright: '© 2025 CompVerdict — Salary data is indicative, not guaranteed.',
    sitemap: 'Sitemap',
  },
  es: {
    desc: '¿Vale la pena esta oferta? Introduce tu paquete y obtén un veredicto basado en datos en segundos. Gratis, sin registro.',
    dataNote: 'Fuentes: BLS OEWS · ONS ASHE · INE EES · Stack Overflow Survey · Tipos ECB · Actualizado T1 2025',
    toolsHead: 'Herramientas',
    guidesHead: 'Guías populares',
    offerEval: 'Evaluador de oferta',
    salaryBench: 'Benchmarks salariales',
    negGuides: 'Guías de negociación',
    privacy: 'Política de privacidad',
    networkLabel: 'La red Verdict:',
    copyright: '© 2025 CompVerdict — Los datos salariales son orientativos.',
    sitemap: 'Sitemap',
  },
  de: {
    desc: 'Ist dieses Angebot die Annahme wert? Gib dein Paket ein und erhalte in Sekunden ein datenbasiertes Urteil. Kostenlos, ohne Anmeldung.',
    dataNote: 'Quellen: BLS OEWS · ONS ASHE · INE EES · Stack Overflow Survey · EZB-Kurse · Aktualisiert Q1 2025',
    toolsHead: 'Tools',
    guidesHead: 'Beliebte Ratgeber',
    offerEval: 'Angebots-Prüfer',
    salaryBench: 'Gehalts-Benchmarks',
    negGuides: 'Verhandlungsratgeber',
    privacy: 'Datenschutz',
    networkLabel: 'Das Verdict-Netzwerk:',
    copyright: '© 2025 CompVerdict — Gehaltsdaten sind indikativ.',
    sitemap: 'Sitemap',
  },
}

export default function Footer({ locale = 'en' }) {
  const l = FOOTER_LABELS[locale]
  const homePath    = HOME_PATH[locale]
  const salaryPath  = SALARY_PATH[locale]
  const negPath     = NEG_PATH[locale]

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-top">
          <a href={homePath} className="cv-brand" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '6px' }}>
            <span className="word">Comp</span><span className="accent">Verdict</span>
          </a>
          <p className="footer-brand-desc">{l.desc}</p>
          <p className="footer-data-note">{l.dataNote}</p>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <p className="footer-col-head">{l.toolsHead}</p>
            <a href={homePath}>{l.offerEval}</a>
            <a href={salaryPath}>{l.salaryBench}</a>
            <a href={negPath}>{l.negGuides}</a>
          </div>
          <div className="footer-col">
            <p className="footer-col-head">{l.guidesHead}</p>
            <a href="/salary/software-engineer-salary-london/">SE salary · London</a>
            <a href="/salary/software-engineer-salary-barcelona/">SE salary · Barcelona</a>
            <a href="/salary/software-engineer-salary-berlin/">SE salary · Berlin</a>
            <a href="/salary/software-engineer-salary-san-francisco/">SE salary · San Francisco</a>
            <a href="/negotiate/software-engineer-negotiation-london/">Negotiate · London</a>
          </div>
        </div>

        <div className="footer-network-row">
          <span className="footer-net-label">{l.networkLabel}</span>
          <a href="https://www.salaryverdict.com" target="_blank" rel="noopener" style={{ fontSize: '13px', fontWeight: 700, textDecoration: 'none', color: '#111827' }}>
            Salary<span style={{ color: '#f97316' }}>Verdict</span>
          </a>
          <span className="footer-net-sep">·</span>
          <a href="https://www.spendverdict.com" target="_blank" rel="noopener" style={{ fontSize: '13px', fontWeight: 700, textDecoration: 'none', color: '#111827' }}>
            Spend<span style={{ color: '#a78bfa' }}>Verdict</span>
          </a>
          <span className="footer-net-sep">·</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>
            Comp<span style={{ color: '#2563EB' }}>Verdict</span>
          </span>
        </div>

        <div className="footer-trust-row">
          <p className="footer-trust-note">Built using official government salary data and verified market benchmarks</p>
          <div className="footer-trust-logos" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'logo-ons',      w: 60, title: 'UK Office for National Statistics' },
              { id: 'logo-ine',      w: 60, title: 'Spain Instituto Nacional de Estadística' },
              { id: 'logo-destatis', w: 76, title: 'Germany Federal Statistical Office' },
              { id: 'logo-bls',      w: 60, title: 'US Bureau of Labor Statistics' },
              { id: 'logo-so',       w: 84, title: 'Stack Overflow Developer Survey' },
            ].map(src => (
              <svg
                key={src.id}
                width={src.w}
                height={24}
                title={src.title}
                aria-label={src.title}
                style={{ opacity: 0.65, filter: 'grayscale(1)', transition: 'opacity 0.15s' }}
                onMouseOver={e => e.currentTarget.style.opacity = '1'}
                onMouseOut={e => e.currentTarget.style.opacity = '0.65'}
              >
                <use href={`/logos/trust-logos.svg#${src.id}`} />
              </svg>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">{l.copyright}</p>
          <div className="footer-bottom-links">
            <a href="/privacy/">{l.privacy}</a>
            <span className="footer-bottom-sep">·</span>
            <a href="/sitemap.xml">{l.sitemap}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
