import Link from 'next/link'
import { SALARY_ROLES, slug } from '../../lib/helpers.js'
import { generateSeoPages, SEO_CITIES } from '../../lib/seo-pages.js'
import Navigation from '../../components/Navigation.jsx'
import Footer from '../../components/Footer.jsx'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.compverdict.com'

export const metadata = {
  title: 'Offer Benchmarks by Role & City — CompVerdict',
  description:
    'Browse 1,700+ offer benchmarks across 24 roles and 44 cities. Find the market rate for your role and city, and check if your offer is fair, weak, or strong.',
  alternates: { canonical: BASE_URL + '/salary/' },
}

// Group roles into categories for the hub layout
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

const FEATURED_CITIES = [
  'London', 'Berlin', 'Amsterdam', 'Paris', 'Dublin',
  'Zurich', 'Stockholm', 'Milan', 'San Francisco', 'New York',
  'Toronto', 'Singapore', 'Sydney', 'Dubai',
]

export default function SalaryHubPage() {
  return (
    <>
      <Navigation />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-600">Offer guides</span>
        </nav>

        <header className="mb-12 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Offer Benchmarks by Role &amp; City
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl">
            1,700+ offer benchmarks across 24 roles and 44 cities. Find the market range for your role and location, then check your offer instantly.
          </p>
          <Link
            href="/#offer-tool"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            Check this offer &rarr;
          </Link>
        </header>

        {/* Browse by role */}
        <section className="space-y-10 mb-16">
          <h2 className="text-xl font-bold text-gray-900">Browse by role</h2>
          {ROLE_CATEGORIES.map(({ label, roles }) => (
            <div key={label}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{label}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {roles.map((role) => {
                  const roleSlug = slug(role)
                  // Link to role-only hub page
                  const href = `/salary/${roleSlug}-salary/`
                  return (
                    <Link
                      key={role}
                      href={href}
                      className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all"
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

        {/* Browse by city */}
        <section className="space-y-4 mb-16 border-t border-gray-100 pt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Browse by city</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {FEATURED_CITIES.map((city) => {
              // Link to most popular role in that city
              const href = `/salary/software-engineer-salary-${slug(city)}/`
              return (
                <Link
                  key={city}
                  href={href}
                  className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all"
                >
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {city}
                  </span>
                  <span className="text-xs text-gray-400 group-hover:text-blue-400">&rarr;</span>
                </Link>
              )
            })}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gray-900 rounded-2xl p-8 text-center space-y-3">
          <h2 className="text-xl font-bold text-white">Got an offer in front of you?</h2>
          <p className="text-gray-400 text-sm">Check it now. 30 seconds, free, no signup.</p>
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
