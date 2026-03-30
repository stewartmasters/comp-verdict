'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ── Locale labels ──────────────────────────────────────────────────────────────
const LABELS = {
  en: {
    headline: 'Is this offer\nworth taking?',
    subhead: "Enter the package. We'll give you the verdict.",
    trust: ['✓ 44 cities', '24 roles', 'Updated Q1 2026', 'Free · No sign-up'],
    roleLabel: 'Role', rolePlaceholder: 'e.g. Software Engineer',
    cityLabel: 'City', cityPlaceholder: 'e.g. Barcelona',
    salaryLabel: 'Base Salary', salaryPlaceholder: '50,000',
    yoeLabel: 'Years of Experience', yoePlaceholder: 'e.g. 5',
    optional: 'Optional',
    bonusToggle: '+ Bonus', bonusLabel: 'Annual Bonus', bonusPlaceholder: '5,000',
    equityToggle: '+ Equity', equityLabel: 'Equity — annual value', equityPlaceholder: '10,000',
    cta: 'Check this offer →',
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
    basedOn: 'Gov. statistics + developer surveys',
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
    peerStmtWeak: 'Most similar candidates earn more than this',
    peerStmtFair: 'About half of similar candidates earn more',
    peerStmtStrong: "You're ahead of most similar candidates",
    peerStmtTop: "You're in the top tier for your role and market",
    riskLine: 'Accepting this offer may lock you below market for the next 2–3 years',
    negDeltaTitle: 'Negotiation range',
    negDeltaSub: 'you could reasonably ask for',
    actionCompare: 'Compare another offer',
    actionCompareSub: 'Different role, city, or package',
    actionHigher: 'Test a higher number',
    actionHigherSub: 'See how an increase changes the verdict',
    actionLifestyle: 'Impact on lifestyle',
    actionLifestyleSub: 'Does this salary work for your city?',
    actionMarket: 'Market pay for this role',
    actionMarketSub: 'Browse salary data by city',
    shareTitle: 'Share this verdict',
    percentileStmt: (pp) => {
      if (pp < 10) return `Bottom 10% for this role and market`
      if (pp < 25) return `${pp}th percentile`
      if (pp < 50) return `${pp}th percentile — below median`
      if (pp < 75) return `${pp}th percentile — above median`
      if (pp < 90) return `Top ${100-pp}% — strong`
      return `Top 10% — exceptional`
    },
  },
  es: {
    headline: '¿Vale la pena\nesta oferta?',
    subhead: 'Introduce el paquete. Te damos el veredicto.',
    trust: ['✓ 44 ciudades', '24 perfiles', 'Actualizado T1 2026', 'Gratis · Sin registro'],
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
    basedOn: 'Estadísticas oficiales + encuestas',
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
    peerStmtWeak: 'La mayoría de candidatos similares ganan más que esto',
    peerStmtFair: 'Alrededor de la mitad de candidatos similares ganan más',
    peerStmtStrong: 'Estás por delante de la mayoría de candidatos similares',
    peerStmtTop: 'Estás en el nivel más alto para tu perfil y mercado',
    riskLine: 'Aceptar esta oferta puede dejarte por debajo del mercado durante los próximos 2–3 años',
    negDeltaTitle: 'Margen de negociación',
    negDeltaSub: 'podrías razonablemente pedir',
    actionCompare: 'Comparar otra oferta',
    actionCompareSub: 'Distinto perfil, ciudad o paquete',
    actionHigher: 'Probar con un número más alto',
    actionHigherSub: 'Cómo cambiaría el veredicto',
    actionLifestyle: 'Impacto en estilo de vida',
    actionLifestyleSub: '¿Este salario funciona para tu ciudad?',
    actionMarket: 'Salarios de mercado para este perfil',
    actionMarketSub: 'Consulta datos salariales por ciudad',
    shareTitle: 'Comparte este veredicto',
    percentileStmt: (pp) => {
      if (pp < 10) return `Inferior al 10% del mercado`
      if (pp < 25) return `Percentil ${pp}`
      if (pp < 50) return `Percentil ${pp} — por debajo de la mediana`
      if (pp < 75) return `Percentil ${pp} — por encima de la mediana`
      if (pp < 90) return `Top ${100-pp}% — fuerte`
      return `Top 10% — excepcional`
    },
  },
  de: {
    headline: 'Ist dieses Angebot\ndie Annahme wert?',
    subhead: 'Gib das Paket ein. Wir geben dir das Urteil.',
    trust: ['✓ 44 Städte', '24 Rollen', 'Aktualisiert Q1 2026', 'Kostenlos · Ohne Anmeldung'],
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
    basedOn: 'Amtl. Statistiken + Entwicklerumfragen',
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
    peerStmtWeak: 'Die meisten vergleichbaren Kandidaten verdienen mehr',
    peerStmtFair: 'Etwa die Hälfte der vergleichbaren Kandidaten verdient mehr',
    peerStmtStrong: 'Du liegst vor den meisten vergleichbaren Kandidaten',
    peerStmtTop: 'Du gehörst zur Spitzengruppe für deine Rolle und deinen Markt',
    riskLine: 'Dieses Angebot anzunehmen riskiert, die nächsten 2–3 Jahre unter Marktniveau zu bleiben',
    negDeltaTitle: 'Verhandlungsspanne',
    negDeltaSub: 'könntest du realistisch fordern',
    actionCompare: 'Anderes Angebot vergleichen',
    actionCompareSub: 'Andere Stelle, Stadt oder Paket',
    actionHigher: 'Höhere Zahl testen',
    actionHigherSub: 'Wie ändert sich das Urteil?',
    actionLifestyle: 'Auswirkung auf Lebensstil',
    actionLifestyleSub: 'Funktioniert dieses Gehalt in deiner Stadt?',
    actionMarket: 'Marktgehälter für diese Stelle',
    actionMarketSub: 'Gehaltsdaten nach Stadt durchsuchen',
    shareTitle: 'Ergebnis teilen',
    percentileStmt: (pp) => {
      if (pp < 10) return `Untere 10% für diese Stelle`
      if (pp < 25) return `${pp}. Perzentil`
      if (pp < 50) return `${pp}. Perzentil — unter dem Median`
      if (pp < 75) return `${pp}. Perzentil — über dem Median`
      if (pp < 90) return `Top ${100-pp}% — stark`
      return `Top 10% — außergewöhnlich`
    },
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

function getOfferIdentity(pp) {
  if (pp < 20)  return { label: 'Leaving Money Behind',  sub: 'Bottom 20% for this role and market' }
  if (pp < 35)  return { label: 'Worth More Than This',  sub: 'Below median — there\'s real room here' }
  if (pp < 50)  return { label: 'Priced to Accept',      sub: 'At median — designed to feel fair' }
  if (pp < 65)  return { label: 'Quietly Competitive',   sub: 'Above median — a solid position' }
  if (pp < 80)  return { label: 'Quietly Ahead',         sub: 'Top 35% — stronger than most' }
  if (pp < 92)  return { label: 'Strong Offer',          sub: 'Top 20% — they want you' }
  return        { label: 'Top of Market',                sub: 'Top 10% — rare and genuine' }
}

function buildShareText(role, city, bandLabel, pp, vType) {
  const url = 'https://www.compverdict.com'
  const identity = getOfferIdentity(pp)
  const above = 100 - pp
  if (vType === 'weak') {
    return `Verdict: "${identity.label}"\n\nMy ${role} offer in ${city} sits in the bottom ${pp}% for a ${bandLabel}. Checked it with CompVerdict before signing.\n\nWorth doing if you have an offer → ${url}`
  } else if (vType === 'fair') {
    return `Verdict: "${identity.label}"\n\nMy ${role} offer in ${city} is ${pp}th percentile for a ${bandLabel}. Interesting benchmark tool if you have an offer in front of you.\n\n→ ${url}`
  } else {
    return `Verdict: "${identity.label}"\n\nMy ${role} offer in ${city} is top ${above}% for a ${bandLabel}. Free tool — worth checking before you accept any offer.\n\n→ ${url}`
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
    ? list.filter(x => x.toLowerCase().includes(value.toLowerCase())).slice(0, 12)
    : list

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

  const ROLE_GROUPS = [
    { label: 'Engineering', roles: ['Software Engineer','Backend Engineer','Frontend Engineer','Full Stack Engineer','Mobile Engineer','iOS Engineer','Android Engineer','DevOps Engineer','Site Reliability Engineer','Platform Engineer','Security Engineer','QA Engineer'] },
    { label: 'Data & ML', roles: ['Data Scientist','Data Engineer','Machine Learning Engineer'] },
    { label: 'Product & Management', roles: ['Product Manager','Engineering Manager'] },
    { label: 'Design', roles: ['UX Designer','UI Designer','Product Designer'] },
    { label: 'Business', roles: ['Marketing Manager','Growth Manager','Finance Analyst','Operations Manager'] },
  ]

  const CITY_GROUPS = [
    { label: 'United Kingdom', cities: ['London','Manchester','Edinburgh','Bristol','Remote (UK)'] },
    { label: 'Spain', cities: ['Barcelona','Madrid','Valencia','Seville','Bilbao','Remote (Spain)'] },
    { label: 'Germany', cities: ['Berlin','Munich','Hamburg','Frankfurt','Cologne','Stuttgart','Remote (Germany)'] },
    { label: 'Netherlands', cities: ['Amsterdam'] },
    { label: 'France', cities: ['Paris'] },
    { label: 'Ireland', cities: ['Dublin'] },
    { label: 'Portugal', cities: ['Lisbon'] },
    { label: 'Italy', cities: ['Milan'] },
    { label: 'Sweden', cities: ['Stockholm'] },
    { label: 'Denmark', cities: ['Copenhagen'] },
    { label: 'Switzerland', cities: ['Zurich','Geneva'] },
    { label: 'Poland', cities: ['Warsaw'] },
    { label: 'Czech Republic', cities: ['Prague'] },
    { label: 'Romania', cities: ['Bucharest'] },
    { label: 'Europe (Remote)', cities: ['Remote (Europe)'] },
    { label: 'United States', cities: ['San Francisco','New York','Seattle','Austin','Boston','Chicago','Los Angeles','Miami','Remote (US)'] },
    { label: 'Canada', cities: ['Toronto'] },
    { label: 'Australia', cities: ['Sydney'] },
    { label: 'Singapore', cities: ['Singapore'] },
    { label: 'UAE', cities: ['Dubai'] },
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
    window.GA_ID = 'G-PCW5JTQ8HY'
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
    const resolvedRole = ROLES.includes(role) ? role : null
    const resolvedCity = CITIES.includes(city) ? city : null
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

    let emoText
    if      (p < 15) emoText = "Most candidates in your position receive significantly better offers. This one needs work before you sign."
    else if (p < 25) emoText = "This offer is below what your profile commands. You have real room to negotiate."
    else if (p < 40) emoText = "In range, but not outstanding. A conversation about the top of the band is worth having."
    else if (p < 63) emoText = "Competitive, but there's still a gap between here and exceptional."
    else if (p < 80) emoText = "This is a solid offer. Your profile is valued at the right level."
    else if (p < 92) emoText = "This company is serious about getting you. The package reflects that."
    else             emoText = "Rare. You're being offered top-of-market compensation. Pay attention to this signal."

    // Peer statement
    let peerStmt
    if (pp < 25)      peerStmt = lbl.peerStmtWeak
    else if (pp < 50) peerStmt = lbl.peerStmtFair
    else if (pp < 80) peerStmt = lbl.peerStmtStrong
    else              peerStmt = lbl.peerStmtTop

    // Negotiation delta — numeric "+X to +Y" block
    let negDelta = null
    if (p < 75) {
      const low  = Math.max(0, Math.round(r.p50 - totalComp))
      const high = Math.max(0, Math.round(r.p75 - totalComp))
      if (high > 0) negDelta = { low, high, sym: r.symbol }
    }

    // Risk line — only for genuinely weak offers
    const showRisk = p < 25

    const confidence = getConfidence(cvData, resolvedCity)

    setResults({
      role: resolvedRole, city: resolvedCity, yoeLabel, bandLabel, yoeNum,
      salaryRaw, bonusRaw, equityRaw, totalComp,
      r, p, pp, vType, vTitle, vColor,
      posText, emoText, peerStmt, negDelta, showRisk, confidence,
      identity: getOfferIdentity(pp),
    })
    trackEvent('verdict_run', { role: resolvedRole, city: resolvedCity, verdict: vType, percentile: pp })
    setScreen('results')
    if (typeof window !== 'undefined') window.scrollTo(0, 0)
  }

  function goBack() {
    setScreen('input')
    if (typeof window !== 'undefined') window.scrollTo(0, 0)
  }

  function testHigher() {
    setSalary('')
    setBonus('')
    setEquity('')
    setShowBonus(false)
    setShowEquity(false)
    setResults(null)
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
              <select
                id="f-role"
                className="input-field"
                value={role}
                onChange={e => setRole(e.target.value)}
                aria-label={lbl.roleLabel}
              >
                <option value="">{lbl.rolePlaceholder}</option>
                {ROLE_GROUPS.map(({ label, roles: groupRoles }) => {
                  const available = groupRoles.filter(r => ROLES.includes(r))
                  if (!available.length) return null
                  return (
                    <optgroup key={label} label={label}>
                      {available.map(r => <option key={r} value={r}>{r}</option>)}
                    </optgroup>
                  )
                })}
              </select>
            </div>

            <div>
              <label className="field-label" htmlFor="f-city">{lbl.cityLabel}</label>
              <select
                id="f-city"
                className="input-field"
                value={city}
                onChange={e => { setCity(e.target.value); const meta = cvData.cities[e.target.value]; if (meta) setCurrSymbol(meta.symbol) }}
                aria-label={lbl.cityLabel}
              >
                <option value="">{lbl.cityPlaceholder}</option>
                {CITY_GROUPS.map(({ label, cities: groupCities }) => {
                  const available = groupCities.filter(c => CITIES.includes(c))
                  if (!available.length) return null
                  return (
                    <optgroup key={label} label={label}>
                      {available.map(c => <option key={c} value={c}>{c}</option>)}
                    </optgroup>
                  )
                })}
              </select>
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

          {/* Back + context */}
          <div style={{ marginBottom: '14px', paddingTop: '8px' }}>
            <button
              onClick={goBack}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '14px', padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.15s' }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--cv-primary)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--text-3)'}
            >{lbl.backBtn}</button>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-2)', margin: '0 0 14px', lineHeight: 1.5 }}
            dangerouslySetInnerHTML={{ __html: lbl.contextTpl(results.role, results.city, results.yoeLabel, results.bandLabel) }}
          />

          {results.r.fallbackCity && (
            <p style={{ display: 'block', fontSize: '11px', color: '#92400E', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '6px', padding: '7px 10px', margin: '0 0 12px', lineHeight: 1.5 }}>
              {lbl.fallbackTpl(results.city, results.r.fallbackCity)}
            </p>
          )}

          {/* 1. VERDICT CARD */}
          <div className={`verdict-card fade-in delay-1 verdict-${results.vType}`}>
            <div className="verdict-tag" style={{ color: results.vColor }}>
              <span className="verdict-tag-dot" style={{ background: results.vColor }} />
              {lbl.verdictLabel}
            </div>
            <div className="verdict-headline" style={{ color: results.vColor }}>{results.vTitle}</div>
            <div className="verdict-comp">
              Base: <strong style={{ color: 'var(--text-1)' }}>{fmt(results.salaryRaw, results.r.symbol)}</strong>
              {(results.bonusRaw > 0 || results.equityRaw > 0) && (
                <> &nbsp;·&nbsp; Total: <strong style={{ color: 'var(--text-1)' }}>{fmt(results.totalComp, results.r.symbol)}</strong></>
              )}
            </div>
            <p className="verdict-meta">{results.emoText}</p>
            {results.showRisk && (
              <p className="verdict-risk">{lbl.riskLine}</p>
            )}
          </div>

          {/* 2. PEER POSITION */}
          <div className="peer-block fade-in delay-2">
            <p className="peer-stmt">{results.peerStmt}</p>
            <span className="peer-pct-badge">{lbl.percentileStmt(results.pp)}</span>
          </div>

          {/* 3. NEGOTIATION DELTA */}
          {results.negDelta && (
            <div className="neg-delta-block fade-in delay-2">
              <div className="neg-delta-label">{lbl.negDeltaTitle}</div>
              <div className="neg-delta-amount">
                {results.negDelta.low > 1000
                  ? `+${fmt(results.negDelta.low, results.negDelta.sym)} – +${fmt(results.negDelta.high, results.negDelta.sym)}`
                  : `up to +${fmt(results.negDelta.high, results.negDelta.sym)}`
                }
              </div>
              <div className="neg-delta-sub">{lbl.negDeltaSub}</div>
            </div>
          )}

          {/* 4. MARKET RANGE */}
          <div className="stat-card fade-in delay-3">
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

          {/* 5. SHARE — identity card */}
          <div className="share-block fade-in delay-3">
            <div style={{ background: 'var(--surface-2,#f8fafc)', border: '1px solid var(--border,#e2e8f0)', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3,#94a3b8)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Your offer identity</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: results.vColor, lineHeight: 1.2, marginBottom: '4px' }}>{results.identity.label}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-2,#64748b)' }}>{results.identity.sub}</div>
            </div>
            <p className="share-block-title">{lbl.shareTitle}</p>
            <button className="share-btn-main" onClick={shareResult}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              {lbl.shareBtn}
            </button>
          </div>

          {/* 6. SCRIPT / NEXT STEPS */}
          <div className="stat-card fade-in delay-4">
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

          {/* 7. SECOND ACTIONS */}
          <div className="actions-grid fade-in delay-5">
            <button className="action-card" onClick={goBack}>
              <svg className="action-icon-svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 10H17M3 10l4-4M3 10l4 4"/>
              </svg>
              <span className="action-title">{lbl.actionCompare}</span>
              <span className="action-sub">{lbl.actionCompareSub}</span>
            </button>
            <button className="action-card" onClick={testHigher}>
              <svg className="action-icon-svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 16V4M4 10l6-6 6 6"/>
              </svg>
              <span className="action-title">{lbl.actionHigher}</span>
              <span className="action-sub">{lbl.actionHigherSub}</span>
            </button>
            <a href="https://www.spendverdict.com" target="_blank" rel="noopener" className="action-card">
              <svg className="action-icon-svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 10a7 7 0 1 0 14 0A7 7 0 0 0 3 10z"/><path d="M10 7v3l2 2"/>
              </svg>
              <span className="action-title">{lbl.actionLifestyle}</span>
              <span className="action-sub">{lbl.actionLifestyleSub}</span>
            </a>
            <a href="https://www.salaryverdict.com" target="_blank" rel="noopener" className="action-card">
              <svg className="action-icon-svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="12" width="3" height="5" rx="1"/><rect x="8.5" y="8" width="3" height="9" rx="1"/><rect x="14" y="4" width="3" height="13" rx="1"/>
              </svg>
              <span className="action-title">{lbl.actionMarket}</span>
              <span className="action-sub">{lbl.actionMarketSub}</span>
            </a>
          </div>

          <p style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '8px', lineHeight: 1.6 }}>
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
                CompVerdict draws from four primary sources, all publicly available and legally open for reuse:<br /><br />
                <strong>BLS OEWS</strong> (U.S. Bureau of Labor Statistics, Occupational Employment and Wage Statistics) — official wage percentiles by US metro area. Public domain.<br /><br />
                <strong>ONS ASHE</strong> (UK Office for National Statistics, Annual Survey of Hours and Earnings) — earnings by occupation and region. Open Government Licence v3.<br /><br />
                <strong>INE EES</strong> (Instituto Nacional de Estadística, Encuesta de Estructura Salarial) — national tech wage data for Spain with city-level adjustments. CC-BY.<br /><br />
                <strong>Stack Overflow Developer Survey</strong> — annual self-reported compensation by role, country, and experience level. Open Database Licence (ODbL).<br /><br />
                <strong>ECB exchange rates</strong> — European Central Bank daily rates used to convert all figures to local currency.
              </div>
            </div>
            <div className="modal-divider" />
            <div className="modal-section">
              <div className="modal-section-title">How benchmarks are built</div>
              <div className="modal-body">
                The <strong>Software Engineer</strong> role at mid-band level is the baseline for each market, established from the sources above. All other roles are derived as market-validated multipliers (e.g. a Product Manager in London earns ~1.14× a Software Engineer in London).<br /><br />
                When multiple sources cover the same market, government data (BLS/ONS/INE) is weighted 3× and survey data (Stack Overflow) is weighted 2×. This ensures official statistics anchor the benchmarks.
              </div>
            </div>
            <div className="modal-divider" />
            <div className="modal-section">
              <div className="modal-section-title">Experience bands</div>
              <div className="modal-body">
                Your years of experience maps to one of four bands:<br /><br />
                <strong>Junior</strong> (0–2 yrs) · <strong>Mid-level</strong> (3–5 yrs) · <strong>Senior</strong> (6–10 yrs) · <strong>Staff / Lead</strong> (11+ yrs)<br /><br />
                Government sources report aggregate distributions across all experience levels. We apply calibrated band-scaling ratios validated against known data points: Junior ≈ 57% of mid-band median · Senior ≈ 159% · Staff ≈ 208%.
              </div>
            </div>
            <div className="modal-divider" />
            <div className="modal-section">
              <div className="modal-section-title">Confidence levels</div>
              <div className="modal-body">
                <strong style={{ color: '#059669' }}>High confidence</strong> — Spain, UK, Germany: government data with explicit role and band breakdown, cross-validated against multiple sources.<br /><br />
                <strong style={{ color: '#D97706' }}>Estimated range</strong> — all other markets: derived from mid-level survey data using the calibrated scaling model. Treat as directional guidance, not a precise figure.
              </div>
            </div>
            <div className="modal-divider" />
            <div className="modal-section">
              <div className="modal-section-title">Limitations</div>
              <div className="modal-body">
                All figures are annual gross compensation before tax. Take-home pay varies significantly by country and tax bracket.<br /><br />
                CompVerdict does not model company size, industry vertical, or funding stage. Government surveys have a 12–18 month publication lag. Results are estimates for negotiation reference — not guaranteed market rates.
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
