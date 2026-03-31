const SALARY_ROLES = [
  'Software Engineer', 'Product Manager', 'Data Scientist', 'Engineering Manager',
  'Frontend Engineer', 'Backend Engineer', 'Full Stack Engineer', 'DevOps Engineer',
  'Machine Learning Engineer', 'UX Designer',
]

export default function HubPageContent({ type, locale, getSalaryPathFn, getNegPathFn, homePath }) {
  const isSalary = type === 'salary'

  let sections
  if (isSalary) {
    sections = SALARY_ROLES.map(role => ({
      heading: role,
      links: locale.SALARY_CITIES.map(city => ({
        href: getSalaryPathFn(locale, role, city),
        label: locale.salaryLinkLabel(role, city),
      })),
    }))
  } else {
    sections = locale.NEGOTIATE_CITIES.map(city => ({
      heading: city,
      links: SALARY_ROLES.map(role => ({
        href: getNegPathFn(locale, role, city),
        label: locale.negLinkLabel(role, city),
      })),
    }))
  }

  const title   = isSalary ? locale.salaryHubTitle : locale.negHubTitle
  const lead    = isSalary ? locale.salaryHubLead  : locale.negHubLead
  const ctaTitle = isSalary ? locale.salaryCTATitle('Software Engineer') : locale.negCTATitle
  const ctaBody  = isSalary ? locale.salaryCTABody('Software Engineer')  : locale.negCTABody
  const ctaBtn   = isSalary ? locale.salaryCTABtn                        : locale.negCTABtn

  return (
    <main>
      <div className="wrap">
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
        {sections.map(s => (
          <div key={s.heading}>
            <h2>{s.heading}</h2>
            <ul className="tag-list">
              {s.links.map(link => (
                <li key={link.href}><a href={link.href}>{link.label}</a></li>
              ))}
            </ul>
          </div>
        ))}
        <div className="cta-box" style={{ marginTop: '48px' }}>
          <h2>{ctaTitle}</h2>
          <p>{ctaBody}</p>
          <a href={homePath} className="cta-btn">{ctaBtn}</a>
        </div>
      </div>
    </main>
  )
}
