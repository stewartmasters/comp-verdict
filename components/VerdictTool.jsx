'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ── Locale labels ──────────────────────────────────────────────────────────────
const LABELS = {
  en: {
    headline: 'Is this offer\nworth taking?',
    subhead: "Enter the package. We'll give you the verdict.",
    trust: ['✓ 39 cities', '10 roles', 'Updated Q1 2025', 'Free · No sign-up'],
    roleLabel: 'Role', rolePlaceholder: 'e.g. Software Engineer',
    cityLabel: 'City', cityPlaceholder: 'e.g. Barcelona',
    salaryLabel: 'Base Salary', salaryPlaceholder: '50,000',
    yoeLabel: 'Years of Experience', yoePlaceholder: 'e.g. 5',
    optional: 'Optional',
    bonusToggle: '+ Bonus', bonusLabel: 'Annual Bonus', bonusPlaceholder: '5,000',
    equityToggle: '+ Equity', equityLabel: 'Equity — annual value', equityPlaceholder: '10,000',
    cta: 'Get Verdict →',
    disclaimer: 'Based on aggregated market benchmarks. Results are estimates.',
    backBtn: '← Back',
    shareBtn: 'Share verdict',
    marketRange: 'Market Range',
    yourPosition: 'Your Position',
    negSignal: 'Negotiation Signal',
    copyScriptBtn: 'Copy script',
    compareBtn: 'Compare another offer',
    nextSteps: 'Next Steps',
    negScript: 'Negotiation Script',
    strongNextStepsBody: 'Your base is already strong. If you negotiate, focus on:',
    strongTips: [
      'Equity / RSUs — often more flexible than base salary',
      'Signing bonus — one-time, lower ongoing risk for the company',
      'Extra PTO or flexible remote arrangements',
      'Accelerated first review (e.g. 6-month instead of 12-month)',
    ],
    verdictLabel: 'Verdict',
    verdictWeak: 'This is a weak offer',
    verdictFair: 'This is a fair offer',
    verdictStrong: 'This is a strong offer',
    modalTitle: 'How CompVerdict works',
    methodology: 'Methodology ↗',
    confidenceHigh: 'High confidence',
    confidenceMed: 'Estimated range',
    basedOn: 'Based on market salary data',
    fallbackTpl: (city, fallback) => `No direct data for ${city}. Showing ${fallback} as the nearest reference.`,
    contextTpl: (role, city, yoeLabel, bandLabel) => `<strong style="color:var(--text-1);">${role}</strong> &nbsp;·&nbsp; <strong style="color:var(--text-1);">${city}</strong> &nbsp;·&nbsp; ${yoeLabel} &nbsp;·&nbsp; <span style="color:var(--text-3);">${bandLabel}</span>`,
    yoe1: '1 yr exp', yoeN: (n) => `${n} yrs exp`,
    rangeSub: (band, role, city) => `Typical range for ${band} ${role} in ${city}`,
    errorRole: 'Role not recognized. Pick one from the list.',
    errorCity: 'City not recognized. Pick one from the list.',
    errorSalary: 'Please enter a valid base salary.',
    errorNoData: "We don't have benchmark data for this combination yet.",
    cookieMsg: 'We use analytics cookies to understand how CompVerdict is used.',
    cookiePrivacy: 'Privacy Policy',
    cookieAccept: 'Accept',
    cookieDecline: 'Decline',
    privacyNote: 'Data is indicative. Results are based on aggregated market benchmarks, not guaranteed offers.',
    privacyLink: 'Privacy Policy',
    networkLabel: 'Verdict network',
    copied: 'Copied to clipboard',
  },
  es: {
    headline: '¿Vale la pena\nesta oferta?',
    subhead: 'Introduce el paquete. Te damos el veredicto.',
    trust: ['✓ 39 ciudades', '10 perfiles', 'Actualizado T1 2025', 'Gratis · Sin registro'],
    roleLabel: 'Puesto', rolePlaceholder: 'ej. Software Engineer',
    cityLabel: 'Ciudad', cityPlaceholder: 'ej. Barcelona',
    salaryLabel: 'Salario Base', salaryPlaceholder: '50.000',
    yoeLabel: 'Años de Experiencia', yoePlaceholder: 'ej. 5',
    optional: 'Opcional',
    bonusToggle: '+ Bonus', bonusLabel: 'Bonus Anual', bonusPlaceholder: '5.000',
    equityToggle: '+ Equity', equityLabel: 'Equity — valor anual', equityPlaceholder: '10.000',
    cta: 'Analizar mi oferta →',
    disclaimer: 'Basado en benchmarks de mercado agregados. Los resultados son estimaciones.',
    backBtn: '← Volver',
    shareBtn: 'Compartir veredicto',
    marketRange: 'Rango de Mercado',
    yourPosition: 'Tu Posición',
    negSignal: 'Señal de Negociación',
    copyScriptBtn: 'Copiar guión',
    compareBtn: 'Comparar otra oferta',
    nextSteps: 'Próximos Pasos',
    negScript: 'Guión de Negociación',
    strongNextStepsBody: 'Tu base ya es fuerte. Si negocias, concéntrate en:',
    strongTips: [
      'Equity / RSUs — a menudo más flexible que el salario base',
      'Bonus de incorporación — puntual, menor riesgo continuo para la empresa',
      'Días de vacaciones extra o trabajo remoto flexible',
      'Primera revisión acelerada (ej. a los 6 meses en lugar de 12)',
    ],
    verdictLabel: 'Veredicto',
    verdictWeak: 'Esta es una oferta débil',
    verdictFair: 'Esta es una oferta justa',
    verdictStrong: 'Esta es una oferta fuerte',
    modalTitle: 'Cómo funciona CompVerdict',
    methodology: 'Metodología ↗',
    confidenceHigh: 'Alta confianza',
    confidenceMed: 'Rango estimado',
    basedOn: 'Basado en datos de mercado',
    fallbackTpl: (city, fallback) => `Sin datos directos para ${city}. Mostrando ${fallback} como referencia más cercana.`,
    contextTpl: (role, city, yoeLabel, bandLabel) => `<strong style="color:var(--text-1);">${role}</strong> &nbsp;·&nbsp; <strong style="color:var(--text-1);">${city}</strong> &nbsp;·&nbsp; ${yoeLabel} &nbsp;·&nbsp; <span style="color:var(--text-3);">${bandLabel}</span>`,
    yoe1: '1 año exp', yoeN: (n) => `${n} años exp`,
    rangeSub: (band, role, city) => `Rango típico para ${band} ${role} en ${city}`,
    errorRole: 'Perfil no reconocido. Elige uno de la lista.',
    errorCity: 'Ciudad no reconocida. Elige una de la lista.',
    errorSalary: 'Introduce un salario base válido.',
    errorNoData: 'Aún no tenemos datos para esta combinación.',
    cookieMsg: 'Usamos cookies de analítica para entender cómo se usa CompVerdict.',
    cookiePrivacy: 'Política de privacidad',
    cookieAccept: 'Aceptar',
    cookieDecline: 'Rechazar',
    privacyNote: 'Los datos son orientativos. Los resultados se basan en benchmarks de mercado agregados.',
    privacyLink: 'Política de privacidad',
    networkLabel: 'Red Verdict',
    copied: 'Copiado al portapapeles',
  },
  de: {
    headline: 'Ist dieses Angebot\ndie Annahme wert?',
    subhead: 'Gib das Paket ein. Wir geben dir das Urteil.',
    trust: ['✓ 39 Städte', '10 Rollen', 'Aktualisiert Q1 2025', 'Kostenlos · Ohne Anmeldung'],
    roleLabel: 'Stelle', rolePlaceholder: 'z.B. Software Engineer',
    cityLabel: 'Stadt', cityPlaceholder: 'z.B. Berlin',
    salaryLabel: 'Grundgehalt', salaryPlaceholder: '50.000',
    yoeLabel: 'Jahre Berufserfahrung', yoePlaceholder: 'z.B. 5',
    optional: 'Optional',
    bonusToggle: '+ Bonus', bonusLabel: 'Jahresbonus', bonusPlaceholder: '5.000',
    equityToggle: '+ Equity', equityLabel: 'Equity — Jahreswert', equityPlaceholder: '10.000',
    cta: 'Angebot prüfen →',
    disclaimer: 'Basiert auf aggregierten Markt-Benchmarks. Ergebnisse sind Schätzungen.',
    backBtn: '← Zurück',
    shareBtn: 'Ergebnis teilen',
    marketRange: 'Marktspanne',
    yourPosition: 'Deine Position',
    negSignal: 'Verhandlungssignal',
    copyScriptBtn: 'Skript kopieren',
    compareBtn: 'Anderes Angebot vergleichen',
    nextSteps: 'Nächste Schritte',
    negScript: 'Verhandlungsskript',
    strongNextStepsBody: 'Dein Grundgehalt ist bereits stark. Wenn du verhandelst, konzentriere dich auf:',
    strongTips: [
      'Equity / RSUs — oft flexibler als das Grundgehalt',
      'Signing Bonus — einmalig, geringeres laufendes Risiko für das Unternehmen',
      'Zusätzliche Urlaubstage oder flexible Remote-Regelungen',
      'Vorgezogene erste Gehaltsüberprüfung (z.B. nach 6 statt 12 Monaten)',
    ],
    verdictLabel: 'Urteil',
    verdictWeak: 'Dies ist ein schwaches Angebot',
    verdictFair: 'Dies ist ein faires Angebot',
    verdictStrong: 'Dies ist ein starkes Angebot',
    modalTitle: 'Wie CompVerdict funktioniert',
    methodology: 'Methodik ↗',
    confidenceHigh: 'Hohe Konfidenz',
    confidenceMed: 'Geschätzte Spanne',
    basedOn: 'Basiert auf Marktdaten',
    fallbackTpl: (city, fallback) => `Keine direkten Daten für ${city}. Zeige ${fallback} als nächste Referenz.`,
    contextTpl: (role, city, yoeLabel, bandLabel) => `<strong style="color:var(--text-1);">${role}</strong> &nbsp;·&nbsp; <strong style="color:var(--text-1);">${city}</strong> &nbsp;·&nbsp; ${yoeLabel} &nbsp;·&nbsp; <span style="color:var(--text-3);">${bandLabel}</span>`,
    yoe1: '1 Jahr Erfahrung', yoeN: (n) => `${n} Jahre Erfahrung`,
    rangeSub: (band, role, city) => `Typische Spanne für ${band} ${role} in ${city}`,
    errorRole: 'Stelle nicht erkannt. Wähle eine aus der Liste.',
    errorCity: 'Stadt nicht erkannt. Wähle eine aus der Liste.',
    errorSalary: 'Bitte gib ein gültiges Grundgehalt ein.',
    errorNoData: 'Wir haben noch keine Benchmark-Daten für diese Kombination.',
    cookieMsg: 'Wir verwenden Analytics-Cookies, um die Nutzung von CompVerdict zu verstehen.',
    cookiePrivacy: 'Datenschutz',
    cookieAccept: 'Akzeptieren',
    cookieDecline: 'Ablehnen',
    privacyNote: 'Daten sind indikativ. Ergebnisse basieren auf aggregierten Markt-Benchmarks.',
    privacyLink: 'Datenschutz',
    networkLabel: 'Verdict-Netzwerk',
    copied: 'In die Zwischenablage kopiert',
  },
}

// ── Engine helpers ─────────────────────────────────────────────────────────────
function fmt(v, sym) {
  v = Math.round(v)
  if (v >= 1000000) return sym + (v/1000000).toFixed(1) + 'M'
  if (v >= 10000)   return sym + Math.round(v/1000) + 'k'
  return sym + v.toLocaleString()
}

function yoeToBand(yoe) {
  const y = parseInt(yoe) || 0
  if (y <= 2)  return 'junior'
  if (y <= 5)  return 'mid'
  if (y <= 10) return 'senior'
  return 'staff'
}

function getRange(cvData, role, city, yoe) {
  const band     = yoeToBand(yoe)
  const cityMeta = cvData.cities[city]
  if (!cityMeta) return null

  let benchmarks  = cvData.benchmarks[city]
  let fallbackCity = null

  if (!benchmarks) {
    const marketDef = cvData.markets[cityMeta.market]?.defaultCity
    if (marketDef && cvData.benchmarks[marketDef]) {
      fallbackCity = marketDef
      benchmarks   = cvData.benchmarks[marketDef]
    }
  }
  if (!benchmarks) return null

  const bandData = benchmarks[band]
  if (!bandData) return null

  const roleConfig = cvData.roles[role] || { mul: 1.0 }
  const mul = roleConfig.override?.[cityMeta.market] ?? roleConfig.mul

  const p25 = Math.round(bandData.p25 * mul)
  const p50 = Math.round(bandData.p50 * mul)
  const p75 = Math.round(bandData.p75 * mul)
  const p10 = Math.round(p25 - 0.85 * (p50 - p25))
  const p90 = Math.round(p75 + 0.80 * (p75 - p50))

  return { p10, p25, p50, p75, p90, band, fallbackCity, symbol: cityMeta.symbol }
}

function scorePct(val, p10, p25, p50, p75, p90) {
  if (val <= p10) return Math.max(0, (val/p10)*10)
  if (val <= p25) return 10 + ((val-p10)/(p25-p10))*15
  if (val <= p50) return 25 + ((val-p25)/(p50-p25))*25
  if (val <= p75) return 50 + ((val-p50)/(p75-p50))*25
  if (val <= p90) return 75 + ((val-p75)/(p90-p75))*15
  return Math.min(100, 90 + ((val-p90)/p90)*10)
}

function closestMatch(input, list) {
  if (!input) return null
  const v = input.toLowerCase().trim()
  return list.find(x => x.toLowerCase() === v) ||
         list.find(x => x.toLowerCase().startsWith(v)) ||
         list.find(x => x.toLowerCase().includes(v)) ||
         null
}

function getConfidence(cvData, city) {
  const meta = cvData.cities[city]
  if (!meta) return 'med'
  return ['ES','UK','DE'].includes(meta.market) ? 'high' : 'med'
}

function buildShareText(role, city, bandLabel, pp, vType) {
  const url = 'https://comp-verdict.netlify.app'
  const above = 100 - pp
  if (vType === 'weak') {
    return `Just checked my ${role} offer in ${city} with CompVerdict.\n\nVerdict: weak offer — bottom ${pp}% for a ${bandLabel}. Time to negotiate.\n\nCheck yours → ${url}`
  } else if (vType === 'fair') {
    return `Ran my ${role} offer in ${city} through CompVerdict.\n\nFair offer — ${pp}th percentile for a ${bandLabel}. Could be better.\n\nIs yours better? → ${url}`
  } else {
    return `CompVerdict: my ${role} offer in ${city} is in the top ${above}% for a ${bandLabel}. Strong offer. 💪\n\nCheck yours → ${url}`
  }
}

function buildNegScript(role, city, bandLabel, r) {
  const target = fmt(r.p75, r.symbol)
  const range  = `${fmt(r.p50, r.symbol)}–${fmt(r.p75, r.symbol)}`
  return `Hi [Name],\n\nThank you for the offer — I'm genuinely excited about this role.\n\nI've looked at current market data for ${role}s in ${city} at ${bandLabel} level. The typical range runs ${range}, and I'd like to discuss getting closer to ${target}.\n\nIs there flexibility on the base?\n\nBest,\n[Your name]`
}

function getPeerComparison(pp, role, city) {
  const above = 100 - pp
  if (pp < 25)  return `Roughly <strong>${above}%</strong> of ${role}s in ${city} earn more than this.`
  if (pp < 50)  return `About <strong>${above}%</strong> of ${role}s in ${city} earn more than this.`
  if (pp < 75)  return `You earn more than roughly <strong>${pp}%</strong> of ${role}s in ${city}.`
  return `Fewer than <strong>${above}%</strong> of ${role}s in ${city} earn more.`
}

// ── Autocomplete component ─────────────────────────────────────────────────────
function Autocomplete({ id, value, onChange, onPick, list, placeholder, label }) {
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const wrapRef = useRef(null)

  const filtered = value
    ? list.filter(x => x.toLowerCase().includes(value.toLowerCase())).slice(0, 9)
    : list.slice(0, 9)

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function pick(val) {
    onPick(val)
    setOpen(false)
    setActiveIdx(-1)
  }

  function handleKeyDown(e) {
    if (!open) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, filtered.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)) }
    else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIdx >= 0 && filtered[activeIdx]) pick(filtered[activeIdx])
      else if (filtered.length > 0) pick(filtered[0])
    } else if (e.key === 'Escape') { setOpen(false) }
  }

  return (
    <div ref={wrapRef} className="input-wrap">
      <input
        id={id}
        type="text"
        className="input-field"
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); setActiveIdx(-1) }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        aria-label={label}
        aria-autocomplete="list"
        aria-expanded={open && filtered.length > 0}
      />
      {open && filtered.length > 0 && (
        <div className="ac-dropdown">
          {filtered.map((item, i) => (
            <div
              key={item}
              className={`ac-item${i === activeIdx ? ' active' : ''}`}
              onMouseDown={e => { e.preventDefault(); pick(item) }}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Range bar ──────────────────────────────────────────────────────────────────
function RangeBar({ r, userVal, percentile, vColor }) {
  const [dotPos, setDotPos] = useState(2)

  const pos = useCallback((v) => Math.max(2, Math.min(98, ((v - r.p10) / (r.p90 - r.p10)) * 100)), [r])

  useEffect(() => {
    const timer = setTimeout(() => setDotPos(pos(userVal)), 80)
    return () => clearTimeout(timer)
  }, [userVal, pos])

  const ticks = [[r.p25,'25th'],[r.p50,'Median'],[r.p75,'75th']]

  return (
    <div className="range-wrap">
      <div className="range-bar" style={{ position: 'relative' }}>
        {ticks.map(([v, lbl]) => {
          const p = pos(v)
          return (
            <div key={lbl}>
              <div className="range-tick" style={{ left: p + '%' }} />
              <div className="range-tick-label" style={{ left: p + '%' }}>
                {fmt(v, r.symbol)}<br /><span style={{ color: 'var(--text-3)' }}>{lbl}</span>
              </div>
            </div>
          )
        })}
        <div
          className="range-user-label"
          style={{ left: dotPos + '%', color: vColor }}
        >You</div>
        <div
          className="range-user-dot"
          style={{
            left: dotPos + '%',
            background: '#fff',
            boxShadow: `0 0 0 3px ${vColor}66, 0 2px 8px rgba(15,23,42,0.18)`,
          }}
        />
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function VerdictTool({ cvData, locale = 'en' }) {
  const lbl = LABELS[locale]

  const ROLES  = Object.keys(cvData.roles)
  const CITIES = [
    'Barcelona','Madrid','Valencia','Seville','Bilbao','Remote (Spain)',
    'London','Manchester','Edinburgh','Bristol','Remote (UK)',
    'Berlin','Munich','Hamburg','Frankfurt','Cologne','Stuttgart','Remote (Germany)',
    'Amsterdam','Paris','Dublin','Lisbon','Milan','Stockholm','Copenhagen',
    'Zurich','Geneva','Warsaw','Prague','Bucharest','Remote (Europe)',
    'San Francisco','New York','Seattle','Austin','Boston',
    'Chicago','Los Angeles','Miami','Remote (US)','Toronto',
    'Sydney','Singapore','Dubai',
  ]

  // Screen state
  const [screen, setScreen]       = useState('input')
  // Input state
  const [role, setRole]           = useState('')
  const [city, setCity]           = useState('')
  const [salary, setSalary]       = useState('')
  const [yoe, setYoe]             = useState('')
  const [bonus, setBonus]         = useState('')
  const [equity, setEquity]       = useState('')
  const [showBonus, setShowBonus] = useState(false)
  const [showEquity, setShowEquity] = useState(false)
  const [error, setError]         = useState('')
  const [currSymbol, setCurrSymbol] = useState('€')
  // Results state
  const [results, setResults]     = useState(null)
  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  // Toast
  const [toastMsg, setToastMsg]   = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  // Cookie
  const [showCookie, setShowCookie] = useState(false)

  // GA
  useEffect(() => {
    if (typeof window === 'undefined') return
    window.GA_ID = 'G-XXXXXXXXXX'
    window.loadGA = function() {
      if (window._gaLoaded) return
      window._gaLoaded = true
      const s = document.createElement('script')
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + window.GA_ID
      s.async = true
      document.head.appendChild(s)
      window.dataLayer = window.dataLayer || []
      function gtag() { window.dataLayer.push(arguments) }
      window.gtag = gtag
      gtag('js', new Date())
      gtag('config', window.GA_ID)
    }
    if (localStorage.getItem('cv_consent') === '1') window.loadGA()
    if (localStorage.getItem('cv_consent') === null) setShowCookie(true)
  }, [])

  // Close modal on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') setIsModalOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Body overflow when modal open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = isModalOpen ? 'hidden' : ''
    }
  }, [isModalOpen])

  function trackEvent(name, params) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', name, params || {})
    }
  }

  function showToast(msg) {
    setToastMsg(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2200)
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text)
      showToast(lbl.copied)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.cssText = 'position:fixed;opacity:0;'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      showToast(lbl.copied)
    }
  }

  function handleCityPick(val) {
    setCity(val)
    const meta = cvData.cities[val]
    if (meta) setCurrSymbol(meta.symbol)
  }

  function toggleBonus() {
    if (showBonus) { setBonus(''); setShowBonus(false) }
    else setShowBonus(true)
  }
  function toggleEquity() {
    if (showEquity) { setEquity(''); setShowEquity(false) }
    else setShowEquity(true)
  }

  function runVerdict() {
    const resolvedRole = closestMatch(role, ROLES)
    const resolvedCity = closestMatch(city, CITIES)
    const salaryRaw    = parseFloat(salary)
    const bonusRaw     = parseFloat(bonus) || 0
    const equityRaw    = parseFloat(equity) || 0

    if (!resolvedRole) { setError(lbl.errorRole); return }
    if (!resolvedCity) { setError(lbl.errorCity); return }
    if (!salaryRaw || isNaN(salaryRaw) || salaryRaw <= 0) { setError(lbl.errorSalary); return }
    setError('')

    const r = getRange(cvData, resolvedRole, resolvedCity, yoe)
    if (!r) { setError(lbl.errorNoData); return }

    const totalComp = salaryRaw + bonusRaw + equityRaw
    const p = scorePct(totalComp, r.p10, r.p25, r.p50, r.p75, r.p90)

    const yoeNum    = parseInt(yoe) || 0
    const bandConf  = cvData.bands.find(b => b.id === r.band)
    const bandLabel = bandConf ? bandConf.label : ''
    const yoeLabel  = yoeNum === 1 ? lbl.yoe1 : lbl.yoeN(yoeNum)

    let vType, vTitle, vColor
    if (p < 25)      { vType='weak';   vTitle=lbl.verdictWeak;   vColor='#ef4444' }
    else if (p < 63) { vType='fair';   vTitle=lbl.verdictFair;   vColor='#f59e0b' }
    else             { vType='strong'; vTitle=lbl.verdictStrong; vColor='#10b981' }

    const pp = Math.round(p)
    let posText
    if      (pp < 10) posText = `You're in the bottom 10% for this role and market`
    else if (pp < 25) posText = `You're in the bottom 25%`
    else if (pp < 40) posText = `You're slightly below the median`
    else if (pp < 60) posText = `You're near the market median`
    else if (pp < 75) posText = `You're in the top 40% — above median`
    else if (pp < 90) posText = `You're in the top 25%`
    else              posText = `You're in the top 10% — exceptional`

    let negText = null
    if      (p < 25) negText = `You could reasonably ask for ${fmt(r.p50,r.symbol)}–${fmt(r.p75,r.symbol)}`
    else if (p < 50) negText = `Push toward ${fmt(r.p75,r.symbol)} — that's mid-market for this profile`
    else if (p < 75) negText = `Consider targeting ${fmt(r.p90,r.symbol)} if you have leverage`

    let emoText
    if      (p < 15) emoText = "Most candidates in your position receive significantly better offers. This one needs work before you sign."
    else if (p < 25) emoText = "This offer is below what your profile commands. You have real room to negotiate."
    else if (p < 40) emoText = "In range, but not outstanding. A conversation about the top of the band is worth having."
    else if (p < 63) emoText = "Competitive, but there's still a gap between here and exceptional."
    else if (p < 80) emoText = "This is a solid offer. Your profile is valued at the right level."
    else if (p < 92) emoText = "This company is serious about getting you. The package reflects that."
    else             emoText = "Rare. You're being offered top-of-market compensation. Pay attention to this signal."

    const confidence = getConfidence(cvData, resolvedCity)

    setResults({
      role: resolvedRole, city: resolvedCity, yoeLabel, bandLabel, yoeNum,
      salaryRaw, bonusRaw, equityRaw, totalComp,
      r, p, pp, vType, vTitle, vColor,
      posText, negText, emoText, confidence,
    })
    trackEvent('verdict_run', { role: resolvedRole, city: resolvedCity, verdict: vType, percentile: pp })
    setScreen('results')
    if (typeof window !== 'undefined') window.scrollTo(0, 0)
  }

  function goBack() {
    setScreen('input')
    if (typeof window !== 'undefined') window.scrollTo(0, 0)
  }

  function shareResult() {
    if (!results) return
    const { role: r2, city: c2, bandLabel: bl, pp: pp2, vType: vt } = results
    const text = buildShareText(r2, c2, bl, pp2, vt)
    trackEvent('share_result', { role: r2, city: c2, verdict: vt })
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ text }).catch(() => copyText(text))
    } else {
      copyText(text)
    }
  }

  function copyScript() {
    if (!results) return
    const { role: r2, city: c2, bandLabel: bl, r: rangeData } = results
    trackEvent('copy_script', { role: r2, city: c2 })
    copyText(buildNegScript(r2, c2, bl, rangeData))
  }

  function cookieAccept() {
    localStorage.setItem('cv_consent', '1')
    setShowCookie(false)
    if (typeof window !== 'undefined' && typeof window.loadGA === 'function') window.loadGA()
  }
  function cookieDecline() {
    localStorage.setItem('cv_consent', '0')
    setShowCookie(false)
  }

  return (
    <>
      {/* ── INPUT SCREEN ── */}
      {screen === 'input' && (
        <div className="screen">
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, margin: '0 0 11px', color: 'var(--text-1)' }}>
              {lbl.headline.split('\n').map((line, i) => (
                <span key={i}>{line}{i < lbl.headline.split('\n').length - 1 ? <br /> : null}</span>
              ))}
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.55, margin: 0 }}>{lbl.subhead}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '28px', flexWrap: 'wrap' }}>
            {lbl.trust.map((t, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {i > 0 && <span style={{ fontSize: '11px', color: 'var(--border)' }}>·</span>}
                <span style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 500 }}>{t}</span>
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label className="field-label" htmlFor="f-role">{lbl.roleLabel}</label>
              <Autocomplete
                id="f-role"
                value={role}
                onChange={setRole}
                onPick={setRole}
                list={ROLES}
                placeholder={lbl.rolePlaceholder}
                label={lbl.roleLabel}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="f-city">{lbl.cityLabel}</label>
              <Autocomplete
                id="f-city"
                value={city}
                onChange={setCity}
                onPick={handleCityPick}
                list={CITIES}
                placeholder={lbl.cityPlaceholder}
                label={lbl.cityLabel}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="f-salary">{lbl.salaryLabel}</label>
              <div className="input-wrap">
                <span className="currency-prefix">{currSymbol}</span>
                <input
                  id="f-salary"
                  type="number"
                  className="input-field input-with-prefix"
                  placeholder={lbl.salaryPlaceholder}
                  min="1"
                  value={salary}
                  onChange={e => setSalary(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="field-label" htmlFor="f-yoe">{lbl.yoeLabel}</label>
              <input
                id="f-yoe"
                type="number"
                className="input-field"
                placeholder={lbl.yoePlaceholder}
                min="0"
                max="40"
                value={yoe}
                onChange={e => setYoe(e.target.value)}
              />
            </div>

            <div style={{ marginTop: '2px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '10px' }}>{lbl.optional}</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button className={`toggle-pill${showBonus ? ' on' : ''}`} onClick={toggleBonus}>
                  {showBonus ? '− Bonus' : lbl.bonusToggle}
                </button>
                <button className={`toggle-pill${showEquity ? ' on' : ''}`} onClick={toggleEquity}>
                  {showEquity ? '− Equity' : lbl.equityToggle}
                </button>
              </div>
            </div>

            {showBonus && (
              <div>
                <label className="field-label" htmlFor="f-bonus">{lbl.bonusLabel}</label>
                <div className="input-wrap">
                  <span className="currency-prefix">{currSymbol}</span>
                  <input
                    id="f-bonus"
                    type="number"
                    className="input-field input-with-prefix"
                    placeholder={lbl.bonusPlaceholder}
                    min="0"
                    value={bonus}
                    onChange={e => setBonus(e.target.value)}
                  />
                </div>
              </div>
            )}

            {showEquity && (
              <div>
                <label className="field-label" htmlFor="f-equity">{lbl.equityLabel}</label>
                <div className="input-wrap">
                  <span className="currency-prefix">{currSymbol}</span>
                  <input
                    id="f-equity"
                    type="number"
                    className="input-field input-with-prefix"
                    placeholder={lbl.equityPlaceholder}
                    min="0"
                    value={equity}
                    onChange={e => setEquity(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {error && <div className="error-msg">{error}</div>}

          <div style={{ marginTop: '28px' }}>
            <button className="btn-primary" onClick={runVerdict}>{lbl.cta}</button>
          </div>

          <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-3)', marginTop: '18px', lineHeight: 1.5 }}>{lbl.disclaimer}</p>
        </div>
      )}

      {/* ── RESULTS SCREEN ── */}
      {screen === 'results' && results && (
        <div className="screen">
          <div style={{ marginBottom: '20px', paddingTop: '8px' }}>
            <button
              onClick={goBack}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '14px', padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.15s' }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--cv-primary)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--text-3)'}
            >{lbl.backBtn}</button>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-2)', margin: '0 0 6px', lineHeight: 1.5 }}
            dangerouslySetInnerHTML={{ __html: lbl.contextTpl(results.role, results.city, results.yoeLabel, results.bandLabel) }}
          />

          {results.r.fallbackCity && (
            <p style={{ display: 'block', fontSize: '11px', color: '#92400E', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '6px', padding: '7px 10px', margin: '0 0 14px', lineHeight: 1.5 }}>
              {lbl.fallbackTpl(results.city, results.r.fallbackCity)}
            </p>
          )}

          {/* Verdict card */}
          <div className={`verdict-card fade-in delay-1 verdict-${results.vType}`}>
            <div className="verdict-tag" style={{ color: results.vColor }}>
              <span className="verdict-tag-dot" style={{ background: results.vColor }} />
              {lbl.verdictLabel}
            </div>
            <div className="verdict-headline" style={{ color: results.vColor }}>{results.vTitle}</div>
            <div className="verdict-comp">
              Base: <strong style={{ color: 'var(--text-1)' }}>{fmt(results.salaryRaw, results.r.symbol)}</strong>
              {(results.bonusRaw > 0 || results.equityRaw > 0) && (
                <> &nbsp;·&nbsp; Total comp: <strong style={{ color: 'var(--text-1)' }}>{fmt(results.totalComp, results.r.symbol)}</strong></>
              )}
            </div>
          </div>

          {/* Share */}
          <button className="share-btn fade-in delay-2" onClick={shareResult}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            {lbl.shareBtn}
          </button>

          {/* Market Range */}
          <div className="stat-card fade-in delay-2">
            <div className="stat-label">{lbl.marketRange}</div>
            <div className="stat-value" style={{ marginBottom: '3px' }}>{fmt(results.r.p25, results.r.symbol)} – {fmt(results.r.p75, results.r.symbol)}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '10px' }}>
              {lbl.rangeSub(results.bandLabel, results.role, results.r.fallbackCity || results.city)}
            </div>
            <RangeBar r={results.r} userVal={results.totalComp} percentile={results.pp} vColor={results.vColor} />
            <div className="trust-row">
              <div className={`confidence-badge confidence-${results.confidence}`}>
                <span className="dot" /><span>{results.confidence === 'high' ? lbl.confidenceHigh : lbl.confidenceMed}</span>
              </div>
              <span className="trust-source">{lbl.basedOn}</span>
              <button className="methodology-link" onClick={() => setIsModalOpen(true)}>{lbl.methodology}</button>
            </div>
          </div>

          {/* Position */}
          <div className="stat-card fade-in delay-3">
            <div className="stat-label">{lbl.yourPosition}</div>
            <div className="stat-value">{results.posText}</div>
            <p className="peer-line" dangerouslySetInnerHTML={{ __html: getPeerComparison(results.pp, results.role, results.city) }} />
          </div>

          {/* Negotiation signal */}
          {results.negText && (
            <div className="stat-card fade-in delay-4">
              <div className="stat-label">{lbl.negSignal}</div>
              <div className="stat-value">{results.negText}</div>
            </div>
          )}

          {/* Script / Next steps */}
          <div className="stat-card fade-in delay-5">
            {results.vType === 'strong' ? (
              <>
                <div className="stat-label">{lbl.nextSteps}</div>
                <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.6, margin: '0 0 12px' }}>{lbl.strongNextStepsBody}</p>
                <ul className="tips-list">
                  {lbl.strongTips.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
              </>
            ) : (
              <>
                <div className="stat-label">{lbl.negScript}</div>
                <pre className="script-pre">{buildNegScript(results.role, results.city, results.bandLabel, results.r)}</pre>
                <button className="copy-script-btn" onClick={copyScript}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  {lbl.copyScriptBtn}
                </button>
              </>
            )}
          </div>

          {/* Emotional */}
          <div className="fade-in delay-6" style={{ padding: '14px 2px 6px' }}>
            <p style={{ fontSize: '15px', color: 'var(--text-2)', fontStyle: 'italic', lineHeight: 1.65, margin: 0 }}>{results.emoText}</p>
          </div>

          <div className="divider" />

          <div>
            <button className="btn-ghost" onClick={goBack}>{lbl.compareBtn}</button>
          </div>

          {/* Network */}
          <div className="network-bar fade-in delay-6">
            <span className="network-label">{lbl.networkLabel}</span>
            <a href="https://www.salaryverdict.com" target="_blank" rel="noopener" style={{ fontSize: '12px', fontWeight: 600, textDecoration: 'none', color: '#f97316', letterSpacing: '-0.01em' }}>SalaryVerdict</a>
            <span className="network-sep">·</span>
            <a href="https://www.spendverdict.com" target="_blank" rel="noopener" style={{ fontSize: '12px', fontWeight: 600, textDecoration: 'none', color: '#a78bfa', letterSpacing: '-0.01em' }}>SpendVerdict</a>
            <span className="network-sep">·</span>
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--cv-primary)' }}>CompVerdict</span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '14px', lineHeight: 1.6 }}>
            {lbl.privacyNote} <a href="/privacy/" style={{ color: 'var(--text-3)' }}>{lbl.privacyLink}</a>
          </p>
        </div>
      )}

      {/* ── METHODOLOGY MODAL ── */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{lbl.modalTitle}</span>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <div className="modal-section">
              <div className="modal-section-title">Data sources</div>
              <div className="modal-body">
                Benchmarks are aggregated from public salary surveys: <strong>Stack Overflow Developer Survey</strong>, <strong>Glassdoor</strong>, <strong>LinkedIn Salary</strong>, <strong>Levels.fyi</strong>, and regional labour market reports. Data is reviewed quarterly.
              </div>
            </div>
            <div className="modal-divider" />
            <div className="modal-section">
              <div className="modal-section-title">Experience bands</div>
              <div className="modal-body">
                Your years of experience maps to one of four bands:<br /><br />
                <strong>Junior</strong> (0–2 yrs) · <strong>Mid-level</strong> (3–5 yrs) · <strong>Senior</strong> (6–10 yrs) · <strong>Staff / Lead</strong> (11+ yrs)<br /><br />
                Each band has its own p25/p50/p75 range. This avoids false precision from continuous YoE multipliers.
              </div>
            </div>
            <div className="modal-divider" />
            <div className="modal-section">
              <div className="modal-section-title">Role adjustments</div>
              <div className="modal-body">
                All roles are benchmarked relative to <strong>Software Engineer</strong> as the baseline. Multipliers are applied per role — and in some cases, per market. For example, a Product Manager commands a larger premium in London (1.14×) than in Barcelona (1.03×), reflecting genuine market differences.
              </div>
            </div>
            <div className="modal-divider" />
            <div className="modal-section">
              <div className="modal-section-title">Confidence levels</div>
              <div className="modal-body">
                <strong style={{ color: '#059669' }}>High confidence</strong> — Spain, UK, Germany: explicitly benchmarked per role, city, and band from multiple sources.<br /><br />
                <strong style={{ color: '#D97706' }}>Estimated range</strong> — all other markets: derived from mid-level survey data using consistent band scaling ratios. Treat as directional.
              </div>
            </div>
            <div className="modal-divider" />
            <div className="modal-section">
              <div className="modal-section-title">Limitations</div>
              <div className="modal-body">
                CompVerdict does not account for company size, industry vertical, funding stage, or individual negotiation outcomes. Salary data reflects gross annual compensation before tax. Results are estimates — use them as a starting point for negotiation, not a ceiling or floor.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── COPY TOAST ── */}
      <div className={`copy-toast${toastVisible ? ' show' : ''}`}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        {toastMsg}
      </div>

      {/* ── COOKIE BANNER ── */}
      {showCookie && (
        <div id="cookie-banner">
          <p style={{ margin: 0, lineHeight: 1.5 }}>
            {lbl.cookieMsg} <a href="/privacy/">{lbl.cookiePrivacy}</a>
          </p>
          <div className="cookie-btns">
            <button className="cookie-btn-decline" onClick={cookieDecline}>{lbl.cookieDecline}</button>
            <button className="cookie-btn-accept" onClick={cookieAccept}>{lbl.cookieAccept}</button>
          </div>
        </div>
      )}
    </>
  )
}
