export default function SeoFooter({ homePath, salaryHubPath, negHubPath, locale }) {
  const navSalary = locale.footerLinkSalary || 'Salary Benchmarks'
  const navNeg    = locale.footerLinkNeg    || 'Negotiation Guides'
  const navTool   = locale.footerLinkTool   || 'Try CompVerdict'

  return (
    <footer>
      <div className="wrap">

        <div className="seo-footer-top">
          <a href={homePath} className="cv-brand" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '8px' }}>
            <span className="word">Comp</span><span className="accent">Verdict</span>
          </a>
          <p className="seo-footer-desc">Is this offer worth taking? Enter your package and get a data-backed verdict in seconds. Free, no sign-up required.</p>
        </div>

        <div className="seo-footer-links">
          <a href={homePath}>{navTool}</a>
          <a href={salaryHubPath}>{navSalary}</a>
          <a href={negHubPath}>{navNeg}</a>
          <a href="/privacy/">Privacy Policy</a>
          <a href="/sitemap.xml">Sitemap</a>
        </div>

        <div className="seo-footer-network">
          <span className="seo-footer-net-label">Verdict network</span>
          <a href="https://www.salaryverdict.com" target="_blank" rel="noopener" className="seo-footer-net-link" style={{ '--net-color': '#f97316' }}>
            Salary<span style={{ color: '#f97316' }}>Verdict</span>
          </a>
          <span className="seo-footer-net-sep">·</span>
          <a href="https://www.spendverdict.com" target="_blank" rel="noopener" className="seo-footer-net-link" style={{ '--net-color': '#a78bfa' }}>
            Spend<span style={{ color: '#a78bfa' }}>Verdict</span>
          </a>
          <span className="seo-footer-net-sep">·</span>
          <span className="seo-footer-net-link">
            Comp<span style={{ color: 'var(--cv-primary)' }}>Verdict</span>
          </span>
        </div>

        <p className="seo-footer-copy">{locale.footerNote}</p>
      </div>
    </footer>
  )
}
