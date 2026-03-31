'use client'

import { useState } from 'react'

const HOME_PATH   = { en: '/', es: '/es/', de: '/de/' }
const SALARY_PATH = { en: '/salary/', es: '/es/salarios/', de: '/de/gehalt/' }
const NEG_PATH    = { en: '/negotiate/', es: '/es/negociacion/', de: '/de/verhandlung/' }

const LABELS = {
  en: {
    desc:         'Is this offer worth taking? Enter your package and get an instant, data-backed verdict in 30 seconds. Free, no sign-up required.',
    dataNote:     'Based on official government benchmarks and structured market modelling.',
    popularHead:  'Popular guides',
    locationHead: 'By location',
    siteHead:     'Site',
    dataHead:     'Data',
    emailHead:    'Get offer tips',
    emailSub:     'Monthly offer insights. No spam, unsubscribe anytime.',
    emailPlaceholder: 'your@email.com',
    emailBtn:     'Subscribe',
    emailSent:    'Subscribed!',
    offerChecker: 'Offer checker',
    methodology:  'Methodology',
    allGuides:    'All offer guides',
    howWeCalc:    'How we calculate',
    privacy:      'Privacy policy',
    sitemap:      'Sitemap',
    networkLabel: 'The Verdict network:',
    copyright:    '© 2026 CompVerdict — Offer estimates are modelled from public benchmarks and do not represent guaranteed salaries.',
    popularGuides: [
      { label: 'Software Engineer · London',        href: '/salary/software-engineer-salary-london/' },
      { label: 'Product Manager · Berlin',          href: '/salary/product-manager-salary-berlin/' },
      { label: 'Data Scientist · Amsterdam',        href: '/salary/data-scientist-salary-amsterdam/' },
      { label: 'Software Engineer · Barcelona',     href: '/salary/software-engineer-salary-barcelona/' },
      { label: 'Engineering Manager · San Francisco', href: '/salary/engineering-manager-salary-san-francisco/' },
      { label: 'Finance Analyst · London',          href: '/salary/finance-analyst-salary-london/' },
      { label: 'UX Designer · Stockholm',           href: '/salary/ux-designer-salary-stockholm/' },
      { label: 'Marketing Manager · Amsterdam',     href: '/salary/marketing-manager-salary-amsterdam/' },
    ],
    locations: [
      { label: 'London offers',        href: '/salary/software-engineer-salary-london/' },
      { label: 'Berlin offers',        href: '/salary/software-engineer-salary-berlin/' },
      { label: 'Amsterdam offers',     href: '/salary/software-engineer-salary-amsterdam/' },
      { label: 'Paris offers',         href: '/salary/software-engineer-salary-paris/' },
      { label: 'Barcelona offers',     href: '/salary/software-engineer-salary-barcelona/' },
      { label: 'San Francisco offers', href: '/salary/software-engineer-salary-san-francisco/' },
    ],
  },
  es: {
    desc:         '¿Vale la pena esta oferta? Introduce tu paquete y obtén un veredicto basado en datos en 30 segundos. Gratis, sin registro.',
    dataNote:     'Basado en datos oficiales del gobierno y modelado estructurado de mercado.',
    popularHead:  'Guías populares',
    locationHead: 'Por ciudad',
    siteHead:     'Sitio',
    dataHead:     'Datos',
    emailHead:    'Consejos sobre ofertas',
    emailSub:     'Insights mensuales. Sin spam, cancela cuando quieras.',
    emailPlaceholder: 'tu@email.com',
    emailBtn:     'Suscribirse',
    emailSent:    '¡Suscrito!',
    offerChecker: 'Verificador de oferta',
    methodology:  'Metodología',
    allGuides:    'Todas las guías',
    howWeCalc:    'Cómo calculamos',
    privacy:      'Política de privacidad',
    sitemap:      'Sitemap',
    networkLabel: 'La red Verdict:',
    copyright:    '© 2026 CompVerdict — Las estimaciones se modelan a partir de datos públicos y no representan salarios garantizados.',
    popularGuides: [
      { label: 'Software Engineer · Barcelona',     href: '/es/salarios/software-engineer-salario-barcelona/' },
      { label: 'Product Manager · Madrid',          href: '/es/salarios/product-manager-salario-madrid/' },
      { label: 'Data Scientist · Barcelona',        href: '/es/salarios/data-scientist-salario-barcelona/' },
      { label: 'Software Engineer · Madrid',        href: '/es/salarios/software-engineer-salario-madrid/' },
      { label: 'Engineering Manager · Barcelona',   href: '/es/salarios/engineering-manager-salario-barcelona/' },
      { label: 'Finance Analyst · Madrid',          href: '/es/salarios/finance-analyst-salario-madrid/' },
      { label: 'Software Engineer · London',        href: '/es/salarios/software-engineer-salario-london/' },
      { label: 'Software Engineer · Berlin',        href: '/es/salarios/software-engineer-salario-berlin/' },
    ],
    locations: [
      { label: 'Ofertas en Barcelona',     href: '/es/salarios/software-engineer-salario-barcelona/' },
      { label: 'Ofertas en Madrid',        href: '/es/salarios/software-engineer-salario-madrid/' },
      { label: 'Ofertas en Londres',       href: '/es/salarios/software-engineer-salario-london/' },
      { label: 'Ofertas en Berlín',        href: '/es/salarios/software-engineer-salario-berlin/' },
      { label: 'Ofertas en Amsterdam',     href: '/es/salarios/software-engineer-salario-amsterdam/' },
      { label: 'Ofertas en San Francisco', href: '/es/salarios/software-engineer-salario-san-francisco/' },
    ],
  },
  de: {
    desc:         'Ist dieses Angebot die Annahme wert? Gib dein Paket ein und erhalte in 30 Sekunden ein datenbasiertes Urteil. Kostenlos, ohne Anmeldung.',
    dataNote:     'Basiert auf offiziellen Regierungsdaten und strukturiertem Marktmodelling.',
    popularHead:  'Beliebte Ratgeber',
    locationHead: 'Nach Stadt',
    siteHead:     'Seite',
    dataHead:     'Daten',
    emailHead:    'Angebots-Tipps erhalten',
    emailSub:     'Monatliche Einblicke. Kein Spam, jederzeit abmeldbar.',
    emailPlaceholder: 'deine@email.de',
    emailBtn:     'Abonnieren',
    emailSent:    'Abonniert!',
    offerChecker: 'Angebots-Prüfer',
    methodology:  'Methodik',
    allGuides:    'Alle Ratgeber',
    howWeCalc:    'So berechnen wir',
    privacy:      'Datenschutz',
    sitemap:      'Sitemap',
    networkLabel: 'Das Verdict-Netzwerk:',
    copyright:    '© 2026 CompVerdict — Schätzungen basieren auf öffentlichen Benchmarks und stellen keine garantierten Gehälter dar.',
    popularGuides: [
      { label: 'Software Engineer · Berlin',        href: '/de/gehalt/software-engineer-gehalt-berlin/' },
      { label: 'Product Manager · München',         href: '/de/gehalt/product-manager-gehalt-munich/' },
      { label: 'Data Scientist · Hamburg',          href: '/de/gehalt/data-scientist-gehalt-hamburg/' },
      { label: 'Software Engineer · München',       href: '/de/gehalt/software-engineer-gehalt-munich/' },
      { label: 'Engineering Manager · Berlin',      href: '/de/gehalt/engineering-manager-gehalt-berlin/' },
      { label: 'Finance Analyst · München',         href: '/de/gehalt/finance-analyst-gehalt-munich/' },
      { label: 'Software Engineer · London',        href: '/de/gehalt/software-engineer-gehalt-london/' },
      { label: 'Software Engineer · Amsterdam',     href: '/de/gehalt/software-engineer-gehalt-amsterdam/' },
    ],
    locations: [
      { label: 'Angebote in Berlin',         href: '/de/gehalt/software-engineer-gehalt-berlin/' },
      { label: 'Angebote in München',        href: '/de/gehalt/software-engineer-gehalt-munich/' },
      { label: 'Angebote in Hamburg',        href: '/de/gehalt/software-engineer-gehalt-hamburg/' },
      { label: 'Angebote in Frankfurt',      href: '/de/gehalt/software-engineer-gehalt-frankfurt/' },
      { label: 'Angebote in London',         href: '/de/gehalt/software-engineer-gehalt-london/' },
      { label: 'Angebote in Amsterdam',      href: '/de/gehalt/software-engineer-gehalt-amsterdam/' },
    ],
  },
}

export default function Footer({ locale = 'en' }) {
  const l = LABELS[locale]
  const homePath   = HOME_PATH[locale]
  const salaryPath = SALARY_PATH[locale]
  const negPath    = NEG_PATH[locale]

  const [email, setEmail]   = useState('')
  const [sent, setSent]     = useState(false)
  const [sending, setSending] = useState(false)

  async function handleSubscribe(e) {
    e.preventDefault()
    if (!email || sending) return
    setSending(true)
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'form-name': 'footer-subscribe', email, locale }).toString(),
      })
    } catch (_) {}
    setSent(true)
    setSending(false)
  }

  return (
    <footer className="border-t border-gray-100 bg-white mt-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* Top grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-1 space-y-3">
            <a href={homePath} className="font-extrabold text-gray-900 text-base tracking-tight inline-block">
              Comp<span className="text-blue-600">Verdict</span>
            </a>
            <p className="text-xs text-gray-500 leading-relaxed">{l.desc}</p>
            <p className="text-xs text-gray-400 leading-relaxed">{l.dataNote}</p>
          </div>

          {/* Popular guides */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{l.popularHead}</p>
            {l.popularGuides.map(({ label, href }) => (
              <a key={href} href={href} className="block text-xs text-gray-600 hover:text-gray-900 transition-colors leading-relaxed">
                {label}
              </a>
            ))}
          </div>

          {/* By location */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{l.locationHead}</p>
            {l.locations.map(({ label, href }) => (
              <a key={href} href={href} className="block text-xs text-gray-600 hover:text-gray-900 transition-colors leading-relaxed">
                {label}
              </a>
            ))}
          </div>

          {/* Site + Data */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{l.siteHead}</p>
            <a href={homePath} className="block text-xs text-gray-600 hover:text-gray-900 transition-colors">{l.offerChecker}</a>
            <a href="/methodology/" className="block text-xs text-gray-600 hover:text-gray-900 transition-colors">{l.methodology}</a>
            <a href={salaryPath} className="block text-xs text-gray-600 hover:text-gray-900 transition-colors">{l.allGuides}</a>
            <div className="pt-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{l.dataHead}</p>
              <p className="text-xs text-gray-400">Eurostat · ONS · Destatis · INE · BLS · INSEE · CBS · ABS · OECD</p>
            </div>
          </div>
        </div>

        {/* Email subscription */}
        <div className="border-t border-gray-100 pt-8 mb-8">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{l.emailHead}</p>
          {sent ? (
            <p className="text-sm text-green-600 font-medium">{l.emailSent}</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-3 flex-wrap">
              <input
                type="email"
                required
                placeholder={l.emailPlaceholder}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 min-w-[200px] px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white text-gray-900"
              />
              <button
                type="submit"
                disabled={sending}
                className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {l.emailBtn}
              </button>
            </form>
          )}
          <p className="text-xs text-gray-400 mt-2">{l.emailSub}</p>
        </div>

        {/* Verdict network */}
        <div className="border-t border-gray-100 pt-6 mb-6 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-500 text-xs">{l.networkLabel}</span>
          <span className="font-bold text-gray-900 text-xs">Comp<span className="text-blue-600">Verdict</span></span>
          <span className="text-gray-300">·</span>
          <a href="https://www.salaryverdict.com" target="_blank" rel="noopener noreferrer" className="font-bold text-xs text-gray-900 hover:opacity-75 transition-opacity">
            Salary<span className="text-orange-500">Verdict</span>
          </a>
          <span className="text-gray-300">·</span>
          <a href="https://www.spendverdict.com" target="_blank" rel="noopener noreferrer" className="font-bold text-xs text-gray-900 hover:opacity-75 transition-opacity">
            Spend<span className="text-violet-500">Verdict</span>
          </a>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 pt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-gray-400 leading-relaxed max-w-xl">{l.copyright}</p>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <a href="/methodology/" className="text-gray-400 hover:text-gray-700 transition-colors no-underline">{l.howWeCalc}</a>
            <span className="text-gray-200">·</span>
            <a href="/privacy/" className="text-gray-400 hover:text-gray-700 transition-colors no-underline">{l.privacy}</a>
            <span className="text-gray-200">·</span>
            <a href="/sitemap.xml" className="text-gray-400 hover:text-gray-700 transition-colors no-underline">{l.sitemap}</a>
          </div>
        </div>
      </div>

      {/* Hidden Netlify form for footer email subscription */}
      <form name="footer-subscribe" data-netlify="true" hidden aria-hidden="true">
        <input type="email" name="email" />
        <input type="hidden" name="locale" />
      </form>
    </footer>
  )
}
