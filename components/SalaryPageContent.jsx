import { fmt } from '../lib/helpers.js'

export default function SalaryPageContent({
  locale, role, city, bands, symbol,
  faqs, hreflangs, salaryHubPath, homePath, negPath,
  relatedCities, relatedRoles, jsonLd,
  getSalaryPathFn, getNegPathFn,
}) {
  const mid    = bands.mid
  const senior = bands.senior

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

  const [th0, th1, th2, th3] = locale.salaryTableHeaders
  const cityDescFull = locale.CITY_DESC[city] || ''

  const seniorJump = senior
    ? Math.round(((senior.p50 - mid.p50) / mid.p50) * 100)
    : null
  const juniorJump = bands.junior
    ? Math.round(((mid.p50 - bands.junior.p50) / bands.junior.p50) * 100)
    : null
  const cityDescFirst = cityDescFull ? cityDescFull.split('.')[0] + '.' : `${city} has an active tech hiring market.`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <div className="wrap">
          <p className="breadcrumb">
            <a href={salaryHubPath}>{locale.salaryBreadcrumb1}</a> &rsaquo; {city} &rsaquo; {role}
          </p>
          <h1>{locale.salaryH1Tpl(role, city)}</h1>
          <p className="lead">
            {locale.ROLE_DESC[role] || `${role} — ${city}.`}
          </p>

          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-label">25th Percentile</div>
              <div className="stat-val">{fmt(mid.p25, symbol)}</div>
              <div className="stat-sub">{locale.negStatFloorSub || 'Mid-level p25'}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">{locale.negStatMedian || 'Median'}</div>
              <div className="stat-val">{fmt(mid.p50, symbol)}</div>
              <div className="stat-sub">{locale.negStatMedianSub || 'Mid-level p50'}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">75th Percentile</div>
              <div className="stat-val">{fmt(mid.p75, symbol)}</div>
              <div className="stat-sub">{locale.negStatStrongSub || 'Mid-level p75'}</div>
            </div>
          </div>

          <h2>{locale.salaryTableTitle(role, city)}</h2>
          <table>
            <thead>
              <tr>
                <th>{th0}</th><th>{th1}</th><th>{th2}</th><th>{th3}</th>
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
          </table>

          <h2>{locale.salaryContextTitle(city)}</h2>
          <div className="context-box">
            <p>{cityDescFull || `${city} — ${role}.`}</p>
          </div>

          <div className="cta-box">
            <h2>{locale.salaryCTATitle(role)}</h2>
            <p>{locale.salaryCTABody(role)}</p>
            <a href={homePath} className="cta-btn">{locale.salaryCTABtn}</a>
          </div>

          {negPath && (
            <>
              <h2>{locale.salaryNegTitle(role, city)}</h2>
              <p>{locale.salaryNegBody(role, city)}</p>
              <p><a href={negPath}>{locale.salaryNegLink(role, city)}</a></p>
            </>
          )}

          <h2>{locale.salaryFaqTitle}</h2>
          {faqs.map((f, i) => (
            <div key={i}>
              <h3>{f.q}</h3>
              <p style={{ color: '#374151', fontSize: '15px' }}>{f.a}</p>
            </div>
          ))}

          <h2>{locale.salaryRelCitiesTitle(role)}</h2>
          <ul className="tag-list">
            {relatedCities.map(c => (
              <li key={c}><a href={getSalaryPathFn(locale, role, c)}>{locale.salaryLinkLabel(role, c)}</a></li>
            ))}
          </ul>

          <h2>{locale.salaryRelRolesTitle(city)}</h2>
          <ul className="tag-list">
            {relatedRoles.map(r => (
              <li key={r}><a href={getSalaryPathFn(locale, r, city)}>{locale.salaryLinkLabel(r, city)}</a></li>
            ))}
          </ul>
        </div>
      </main>
    </>
  )
}
