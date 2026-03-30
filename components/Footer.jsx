import Link from 'next/link'

const OFFER_GUIDE_LINKS = [
  { href: '/salary/software-engineer-salary-london/', label: 'Software Engineer · London' },
  { href: '/salary/software-engineer-salary-berlin/', label: 'Software Engineer · Berlin' },
  { href: '/salary/product-manager-salary-london/', label: 'Product Manager · London' },
  { href: '/salary/data-scientist-salary-amsterdam/', label: 'Data Scientist · Amsterdam' },
  { href: '/salary/engineering-manager-salary-london/', label: 'Engineering Manager · London' },
  { href: '/salary/frontend-engineer-salary-berlin/', label: 'Frontend Engineer · Berlin' },
  { href: '/salary/devops-engineer-salary-london/', label: 'DevOps Engineer · London' },
  { href: '/salary/ux-designer-salary-amsterdam/', label: 'UX Designer · Amsterdam' },
]

const LOCATION_LINKS = [
  { href: '/salary/software-engineer-salary-london/', label: 'London' },
  { href: '/salary/software-engineer-salary-berlin/', label: 'Berlin' },
  { href: '/salary/software-engineer-salary-barcelona/', label: 'Barcelona' },
  { href: '/salary/product-manager-salary-amsterdam/', label: 'Amsterdam' },
  { href: '/salary/software-engineer-salary-paris/', label: 'Paris' },
  { href: '/salary/software-engineer-salary-dublin/', label: 'Dublin' },
]

export default function Footer({ locale = 'en' }) {
  // locale prop kept for backwards compat with es/de pages that pass it
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-100 bg-gray-50 mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="space-y-3">
            <div className="font-extrabold text-gray-900 text-base tracking-tight">
              Comp<span className="text-blue-600">Verdict</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Free offer evaluation for professionals. Find out if your job offer is fair, weak, or strong — in 30 seconds.
            </p>
            <p className="text-xs text-gray-400">
              Based on public benchmarks: BLS OEWS · ONS ASHE · INE EES · Stack Overflow Survey.
            </p>
            <div className="pt-1 space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">The Verdict network</p>
              <div className="flex items-center gap-3 text-sm flex-wrap">
                <a
                  href="https://www.salaryverdict.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Salary<span className="text-orange-500">Verdict</span>
                </a>
                <span className="text-gray-300">·</span>
                <a
                  href="https://www.spendverdict.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Spend<span className="text-violet-500">Verdict</span>
                </a>
              </div>
            </div>
          </div>

          {/* Popular offer guides */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Popular offer guides</p>
            <ul className="space-y-1.5">
              {OFFER_GUIDE_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* By location */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">By location</p>
            <ul className="space-y-1.5">
              {LOCATION_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                    {label} offers
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Site */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Site</p>
            <ul className="space-y-1.5">
              {[
                { href: '/', label: 'Offer checker' },
                { href: '/salary/software-engineer-salary-london/', label: 'All offer guides' },
                { href: '/negotiate/', label: 'Negotiation guides' },
                { href: '/methodology/', label: 'Methodology' },
                { href: '/privacy/', label: 'Privacy policy' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-2 space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Data sources</p>
              <p className="text-xs text-gray-400">BLS OEWS · ONS ASHE</p>
              <p className="text-xs text-gray-400">INE EES · Stack Overflow</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {year} CompVerdict — Salary estimates are modelled from public benchmarks and do not represent guaranteed earnings.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link href="/methodology/" className="hover:text-blue-600 transition-colors">How we calculate</Link>
            <span>·</span>
            <Link href="/privacy/" className="hover:text-blue-600 transition-colors">Privacy</Link>
            <span>·</span>
            <Link href="/sitemap.xml" className="hover:text-blue-600 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
