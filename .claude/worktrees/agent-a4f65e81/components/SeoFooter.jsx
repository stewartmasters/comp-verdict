export default function SeoFooter({ homePath, salaryHubPath, negHubPath, locale }) {
  const navSalary = locale.footerLinkSalary || 'Salary Benchmarks'
  const navNeg    = locale.footerLinkNeg    || 'Negotiation Guides'
  const navTool   = locale.footerLinkTool   || 'Try CompVerdict'

  return (
    <footer>
      <div className="wrap">
        <div className="footer-network">
          <div className="footer-brand-sv">
            <div className="footer-brand-name">
              <a href="https://www.salaryverdict.com" target="_blank" rel="noopener">SalaryVerdict</a>
            </div>
            <p className="footer-brand-desc">Free salary benchmarks for tech roles across Europe and the US.</p>
          </div>
          <div className="footer-brand-spv">
            <div className="footer-brand-name">
              <a href="https://www.spendverdict.com" target="_blank" rel="noopener">SpendVerdict</a>
            </div>
            <p className="footer-brand-desc">Know if your monthly spending is normal for your city.</p>
          </div>
          <div className="footer-brand-cv">
            <div className="footer-brand-name"><span>CompVerdict</span></div>
            <p className="footer-brand-desc">Is this offer worth taking? Get a data-backed verdict in seconds.</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-note">{locale.footerNote}</p>
          <div className="footer-links">
            <a href={homePath}>{navTool}</a>
            <a href={salaryHubPath}>{navSalary}</a>
            <a href={negHubPath}>{navNeg}</a>
            <a href="/privacy/">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
