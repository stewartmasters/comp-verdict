import { fmt } from '../lib/helpers.js'

export default function NegotiatePageContent({
  locale, role, city, bands, symbol,
  hreflangs, negHubPath, homePath, salaryPath,
  relatedRoles, relatedCities, jsonLd,
  getNegPathFn, getSalaryPathFn,
}) {
  const mid    = bands.mid
  const senior = bands.senior

  const leverage = locale.CITY_LEVERAGE[city] || [
    locale.negFallbackLeverage1 || "Research the full market range before any negotiation conversation",
    locale.negFallbackLeverage2 || "Use market data or competing offers as anchors — not personal financial needs",
    locale.negFallbackLeverage3 || "Negotiate the full package: base, bonus, equity, and benefits as separate levers",
    locale.negFallbackLeverage4 || "Always follow up verbal agreements in writing before making a decision",
  ]

  const steps = locale.negSteps(role, city, mid.p50, mid.p25, mid.p75, senior?.p50 || 0, symbol)

  const tableRows = Object.entries(locale.BAND_LABELS).map(([band, label]) => {
    const b = bands[band]
    if (!b) return null
    return (
      <tr key={band}>
        <td className="td-band">{label}</td>
        <td>{fmt(b.p25, symbol)}</td>
        <td><strong>{fmt(b.p50, symbol)}</strong></td>
        <td>{fmt(b.p75, symbol)}</td>
      </tr>
    )
  }).filter(Boolean)

  const [nth0, nth1, nth2, nth3] = locale.negTableHeaders
  const cityDescFull = locale.CITY_DESC[city] || ''

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <div className="wrap">
          <p className="breadcrumb">
            <a href={negHubPath}>{locale.negBreadcrumb1}</a> &rsaquo; {city} &rsaquo; {role}
          </p>
          <h1>{locale.negH1Tpl(role, city)}</h1>
          <p className="lead">{locale.negLead(city)}</p>

          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-label">{locale.negStatFloor}</div>
              <div className="stat-val">{fmt(mid.p25, symbol)}</div>
              <div className="stat-sub">{locale.negStatFloorSub}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">{locale.negStatMedian}</div>
              <div className="stat-val">{fmt(mid.p50, symbol)}</div>
              <div className="stat-sub">{locale.negStatMedianSub}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">{locale.negStatStrong}</div>
              <div className="stat-val">{fmt(mid.p75, symbol)}</div>
              <div className="stat-sub">{locale.negStatStrongSub}</div>
            </div>
          </div>

          <h2>{locale.negLeverageTitle(city)}</h2>
          <ul className="leverage-list">
            {leverage.map((l, i) => (
              <li key={i}><span className="check">&#10003;</span>{l}</li>
            ))}
          </ul>

          <h2>{locale.negTableTitle(role, city)}</h2>
          <table>
            <thead>
              <tr>
                <th>{nth0}</th><th>{nth1}</th><th>{nth2}</th><th>{nth3}</th>
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
          </table>

          <h2>{locale.negPlaybookTitle}</h2>
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={i}>
                <div>
                  <p className="step-title">{s.title}</p>
                  <p className="step-body">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <h2>{locale.negContextTitle(city)}</h2>
          <div className="context-box">
            <p>{cityDescFull || `${city} — ${role}.`}</p>
          </div>

          <div className="cta-box">
            <h2>{locale.negCTATitle}</h2>
            <p>{locale.negCTABody}</p>
            <a href={homePath} className="cta-btn">{locale.negCTABtn}</a>
          </div>

          {salaryPath && (
            <p><a href={salaryPath}>{locale.negSalaryLink(role, city)}</a></p>
          )}

          <h2>{locale.negRelRolesTitle(city)}</h2>
          <ul className="tag-list">
            {relatedRoles.map(r => (
              <li key={r}><a href={getNegPathFn(locale, r, city)}>{locale.negRelRoleLink(r, city)}</a></li>
            ))}
          </ul>

          <h2>{locale.negRelCitiesTitle(role)}</h2>
          <ul className="tag-list">
            {relatedCities.map(c => (
              <li key={c}><a href={getNegPathFn(locale, role, c)}>{locale.negRelCityLink(role, c)}</a></li>
            ))}
          </ul>
        </div>
      </main>
    </>
  )
}
