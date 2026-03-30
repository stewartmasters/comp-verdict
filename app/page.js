import Link from 'next/link'
import { CV_DATA } from '../lib/cv-data.js'
import { getSalaryPath, en, SALARY_ROLES } from '../lib/page-helpers.js'
import VerdictTool from '../components/VerdictTool.jsx'
import Navigation from '../components/Navigation.jsx'
import Footer from '../components/Footer.jsx'
import TrustSection from '../components/TrustSection.jsx'
import ScrollToTopButton from '../components/ScrollToTopButton.jsx'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.compverdict.com'

export const metadata = {
  title: 'Is This Job Offer Actually Good? — Free Offer Checker',
  description:
    'Compare your job offer to market data and find out if you should negotiate. Enter role, city, salary, and years of experience. Get your verdict in 30 seconds — free, no signup.',
  alternates: {
    canonical: BASE_URL + '/',
  },
}

const FEATURED_CHECKS = [
  { role: 'Software Engineer', city: 'London', label: 'Software Engineer · London' },
  { role: 'Product Manager', city: 'Berlin', label: 'Product Manager · Berlin' },
  { role: 'Data Scientist', city: 'Amsterdam', label: 'Data Scientist · Amsterdam' },
  { role: 'Engineering Manager', city: 'London', label: 'Engineering Manager · London' },
  { role: 'Frontend Engineer', city: 'Barcelona', label: 'Frontend Engineer · Barcelona' },
  { role: 'DevOps Engineer', city: 'Dublin', label: 'DevOps Engineer · Dublin' },
]

const CURATED_GUIDES = [
  { role: 'Software Engineer', city: 'London' },
  { role: 'Product Manager', city: 'Berlin' },
  { role: 'Data Scientist', city: 'Amsterdam' },
  { role: 'Engineering Manager', city: 'London' },
  { role: 'Frontend Engineer', city: 'Barcelona' },
  { role: 'Backend Engineer', city: 'Paris' },
  { role: 'DevOps Engineer', city: 'Dublin' },
  { role: 'UX Designer', city: 'Amsterdam' },
  { role: 'Machine Learning Engineer', city: 'Berlin' },
  { role: 'Software Engineer', city: 'San Francisco' },
  { role: 'Product Manager', city: 'London' },
  { role: 'Full Stack Engineer', city: 'Madrid' },
]

export default function HomePage() {
  return (
    <>
      <Navigation />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-20 pb-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Copy — first on mobile (top), left on desktop */}
          <div className="space-y-6">
            <div className="inline-block bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
              Free · No signup · Instant verdict
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
              Is this job offer{' '}
              <span className="text-blue-600">actually good?</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed">
              Compare your offer to market benchmarks across 39 cities worldwide. Get a clear verdict — fair, weak, or strong — and see exactly how much you could negotiate.
            </p>

            {/* Trust stats */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              {[
                { value: '10', label: 'Role types' },
                { value: '39', label: 'Cities' },
                { value: 'Free', label: 'No sign-up' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-extrabold text-gray-900">{value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-1">
              <p className="text-xs text-gray-500 font-medium">Built using public salary benchmarks:</p>
              <TrustSection variant="minimal" />
              <p className="text-xs text-gray-400">Coverage varies by role and location.</p>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Popular checks</p>
              <div className="flex flex-wrap gap-2">
                {FEATURED_CHECKS.map(({ role, city, label }) => {
                  const href = getSalaryPath(en, role, city)
                  return (
                    <Link
                      key={`${role}-${city}`}
                      href={href}
                      className="text-xs bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-600 px-3 py-1.5 rounded-full transition-colors"
                    >
                      {label}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Offer tool — second on mobile (below copy), right on desktop */}
          <div id="offer-tool">
            <VerdictTool cvData={CV_DATA} locale="en" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 border-t border-gray-100 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Enter your offer',
              desc: 'Add the role, city, base salary, and your years of experience. Bonus and equity are optional.',
            },
            {
              step: '02',
              title: 'We benchmark it',
              desc: 'We compare your offer to market data for your specific role, city, and seniority band.',
            },
            {
              step: '03',
              title: 'Get your verdict',
              desc: 'See if it\'s weak, fair, or strong — plus your exact negotiation range and a ready-to-use script.',
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="space-y-3">
              <div className="text-3xl font-black text-blue-100">{step}</div>
              <h3 className="text-base font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What you get */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What you get</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: '⚡', title: 'Clear verdict', desc: 'Weak, fair, or strong — no ambiguous percentile jargon.' },
            { icon: '📊', title: 'Market range', desc: 'Typical p25–p75 range for your exact role, city, and experience band.' },
            { icon: '🎯', title: 'Negotiation range', desc: 'The exact range you can reasonably push back on, in your currency.' },
            { icon: '📝', title: 'Negotiation script', desc: 'A ready-to-send email template based on your offer and market data.' },
            { icon: '👥', title: 'Peer comparison', desc: 'See how your offer stacks up against similar candidates in your market.' },
            { icon: '⚠️', title: 'Risk signal', desc: 'A clear warning if accepting this offer may lock you below market.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="p-4 rounded-xl border border-gray-100 bg-white">
              <div className="text-2xl mb-2">{icon}</div>
              <div className="text-sm font-bold text-gray-900 mb-1">{title}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Offer guide grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Offer benchmarks by role &amp; city</h2>
          <Link
            href="/salary/software-engineer-salary-london/"
            className="text-sm text-blue-600 font-semibold hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURATED_GUIDES.map(({ role, city }) => {
            const href = getSalaryPath(en, role, city)
            return (
              <Link
                key={`${role}-${city}`}
                href={href}
                className="group block p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all"
              >
                <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {role}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{city}</div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Verdict network cross-link */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">More from the Verdict network</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <a
            href="https://www.salaryverdict.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-5 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all"
          >
            <div className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-1">
              Salary<span className="text-orange-500">Verdict</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Already employed? Check if you&apos;re underpaid at your current job. Compare your salary against market data.
            </p>
            <p className="text-xs text-orange-500 mt-2 font-semibold">Check my salary →</p>
          </a>
          <a
            href="https://www.spendverdict.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-5 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50 transition-all"
          >
            <div className="font-bold text-gray-900 group-hover:text-violet-600 transition-colors mb-1">
              Spend<span className="text-violet-500">Verdict</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Does this salary actually work for your lifestyle? See what it means for rent, savings, and spending in your city.
            </p>
            <p className="text-xs text-violet-500 mt-2 font-semibold">Check my lifestyle →</p>
          </a>
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-16">
        <div className="bg-gray-900 rounded-2xl p-8 sm:p-12 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Got an offer in front of you?
          </h2>
          <p className="text-gray-400">30 seconds. Free. No email. No login.</p>
          <ScrollToTopButton />
        </div>
      </section>

      <Footer locale="en" />
    </>
  )
}
