import Link from 'next/link'
import { SALARY_ROLES, slug } from '../../lib/helpers.js'
import { en, getNegPath } from '../../lib/page-helpers.js'
import Navigation from '../../components/Navigation.jsx'
import Footer from '../../components/Footer.jsx'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.compverdict.com'

export const metadata = {
  title: 'Salary Negotiation Guides by Role & City — CompVerdict',
  description:
    'Negotiation scripts and market data for 24 roles across 8 cities. Know your number before you negotiate — get the range, the script, and the confidence to push back.',
  alternates: { canonical: BASE_URL + '/negotiate/' },
}

const NEGOTIATE_CITIES = en.NEGOTIATE_CITIES

// Role categories matching the salary hub
const ROLE_CATEGORIES = [
  {
    label: 'Engineering',
    roles: ['Software Engineer', 'Backend Engineer', 'Frontend Engineer', 'Full Stack Engineer',
            'Mobile Engineer', 'iOS Engineer', 'Android Engineer', 'DevOps Engineer',
            'Site Reliability Engineer', 'Platform Engineer', 'Security Engineer', 'QA Engineer'],
  },
  {
    label: 'Data & ML',
    roles: ['Data Scientist', 'Data Engineer', 'Machine Learning Engineer'],
  },
  {
    label: 'Product & Management',
    roles: ['Product Manager', 'Engineering Manager'],
  },
  {
    label: 'Design',
    roles: ['UX Designer', 'UI Designer', 'Product Designer'],
  },
  {
    label: 'Business',
    roles: ['Marketing Manager', 'Growth Manager', 'Finance Analyst', 'Operations Manager'],
  },
]

export default function NegotiateHubPage() {
  return (
    <>
      <Navigation />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-600">Negotiate</span>
        </nav>

        <header className="mb-12 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Salary Negotiation Guides
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl">
            Knowing the market range is the foundation of any successful negotiation. These guides give you the data and the playbook — by role and city.
          </p>
          <Link
            href="/#offer-tool"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            Check this offer first &rarr;
          </Link>
        </header>

        {/* Browse by city */}
        <section className="space-y-10 mb-16">
          <h2 className="text-xl font-bold text-gray-900">Browse by city</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {NEGOTIATE_CITIES.map((city) => (
              <div key={city} className="space-y-2">
                <h3 className="text-sm font-bold text-gray-700 px-1">{city}</h3>
                <div className="space-y-1.5">
                  {SALARY_ROLES.slice(0, 5).map((role) => {
                    const href = getNegPath(en, role, city)
                    return (
                      <Link
                        key={role}
                        href={href}
                        className="block text-xs text-gray-600 hover:text-blue-600 hover:underline transition-colors px-1 leading-relaxed"
                      >
                        {role}
                      </Link>
                    )
                  })}
                  <Link
                    href={getNegPath(en, 'Software Engineer', city)}
                    className="block text-xs text-blue-500 font-semibold hover:underline px-1 mt-1"
                  >
                    All roles in {city} &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Browse by role */}
        <section className="space-y-8 mb-16 border-t border-gray-100 pt-12">
          <h2 className="text-xl font-bold text-gray-900">Browse by role</h2>
          {ROLE_CATEGORIES.map(({ label, roles }) => (
            <div key={label}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{label}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {roles.map((role) => {
                  // Link to first negotiate city for that role
                  const href = getNegPath(en, role, NEGOTIATE_CITIES[0])
                  return (
                    <Link
                      key={role}
                      href={href}
                      className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all"
                    >
                      <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {role}
                      </span>
                      <span className="text-xs text-gray-400 group-hover:text-blue-400">&rarr;</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </section>

        {/* Why negotiate section */}
        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-12 space-y-3">
          <h2 className="text-base font-bold text-gray-900">Why negotiating is almost always worth it</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <div className="font-semibold text-gray-900 mb-1">The risk is low</div>
              <p className="text-xs leading-relaxed text-gray-500">A polite, market-anchored counter-offer is rarely declined. Companies expect it.</p>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-1">The compounding is real</div>
              <p className="text-xs leading-relaxed text-gray-500">&pound;5k more today becomes &pound;50k+ over a decade after raises, bonuses, and future job anchoring.</p>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-1">The first offer is rarely final</div>
              <p className="text-xs leading-relaxed text-gray-500">Most recruiters have a range. The opening offer is almost never the top of it.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gray-900 rounded-2xl p-8 text-center space-y-3">
          <h2 className="text-xl font-bold text-white">Know your number before you negotiate</h2>
          <p className="text-gray-400 text-sm">Check your offer, get your range, get the script. Free, 30 seconds.</p>
          <Link
            href="/#offer-tool"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            Check this offer &rarr;
          </Link>
        </div>
      </div>

      <Footer locale="en" />
    </>
  )
}
