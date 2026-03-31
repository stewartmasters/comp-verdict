import Link from 'next/link'
import { CV_DATA } from '../lib/cv-data.js'
import { getRange, fmt } from '../lib/helpers.js'
import { getSalaryPath, en } from '../lib/page-helpers.js'
import { slugify } from '../lib/seo-pages.js'
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
  { role: 'Software Engineer',   city: 'London',       label: 'Software Engineer \u00b7 London' },
  { role: 'Product Manager',     city: 'Berlin',        label: 'Product Manager \u00b7 Berlin' },
  { role: 'Marketing Manager',   city: 'Amsterdam',     label: 'Marketing Manager \u00b7 Amsterdam' },
  { role: 'Data Scientist',      city: 'Paris',         label: 'Data Scientist \u00b7 Paris' },
  { role: 'Finance Analyst',     city: 'London',        label: 'Finance Analyst \u00b7 London' },
  { role: 'Engineering Manager', city: 'San Francisco', label: 'Engineering Manager \u00b7 San Francisco' },
]

const CURATED_GUIDES = [
  { role: 'Software Engineer',         city: 'London' },
  { role: 'Product Manager',           city: 'Berlin' },
  { role: 'Marketing Manager',         city: 'Amsterdam' },
  { role: 'Data Scientist',            city: 'Paris' },
  { role: 'Engineering Manager',       city: 'San Francisco' },
  { role: 'Finance Analyst',           city: 'London' },
  { role: 'Backend Engineer',          city: 'Dublin' },
  { role: 'UX Designer',               city: 'Stockholm' },
  { role: 'Operations Manager',        city: 'Zurich' },
  { role: 'Machine Learning Engineer', city: 'Berlin' },
  { role: 'Growth Manager',            city: 'New York' },
  { role: 'Product Designer',          city: 'Amsterdam' },
]

const WEAK_OFFER_SIGNALS = [
  {
    signal: "It\u2019s the first number they gave you",
    note: "Recruiters routinely open below their ceiling. The first offer is almost never the final offer.",
  },
  {
    signal: "It\u2019s a suspiciously round number",
    note: "\u00a350k, $100k, \u20ac80k \u2014 these are placeholders, not benchmarked figures. They have room.",
  },
  {
    signal: "They offered quickly without asking about your current salary",
    note: "Fast offers without anchoring questions often mean the band is wide and they guessed low.",
  },
  {
    signal: "It\u2019s below the midpoint for your experience band",
    note: "If your offer sits at or below the 40th percentile for your role and city, you\u2019re being underpaid before you even start.",
  },
]

export default function HomePage() {
  // Pre-compute medians for guide cards at build time
  const guidesWithData = CURATED_GUIDES.map(({ role, city }) => {
    const data = getRange(role, city)
    const median = data?.bands?.mid?.p50 ? fmt(data.bands.mid.p50, data.symbol) : null
    return { role, city, median }
  })

  return (
    <>
      <Navigation />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-20 pb-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Copy */}
          <div className="space-y-6">
            <div className="inline-block bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
              Got an offer? Check it before you reply.
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
              Is this job offer{' '}
              <span className="text-blue-600">actually good?</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed">
              Most people accept the first offer. Most of them regret it. Compare your offer to market data across 44 cities &mdash; and find out exactly how much you can push back on.
            </p>

            {/* Trust stats */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              {[
                { value: '24',     label: 'Role types' },
                { value: '44',     label: 'Cities' },
                { value: '4,200+', label: 'Benchmarks' },
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
                  const href = `/salary/${slugify(role)}-salary-${slugify(city)}/`
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

          {/* Offer tool */}
          <div id="offer-tool">
            <VerdictTool cvData={CV_DATA} locale="en" />
          </div>
        </div>
      </section>

      {/* Signs your offer is weak */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 border-t border-gray-100 mt-2">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-10 items-start">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
              Signs your offer<br />is weak
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Most offers have room. These are the patterns that suggest yours does too.
            </p>
            <Link href="/#offer-tool" className="inline-block text-sm font-semibold text-blue-600 hover:underline">
              Check this offer &rarr;
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {WEAK_OFFER_SIGNALS.map(({ signal, note }) => (
              <div key={signal} className="p-4 rounded-xl border border-gray-100 bg-white space-y-1.5">
                <div className="flex items-start gap-2">
                  <span className="text-red-400 font-bold text-sm mt-0.5 flex-shrink-0">&times;</span>
                  <div className="text-sm font-semibold text-gray-900">{signal}</div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed pl-5">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Enter the offer',
              desc: 'Role, city, base salary, years of experience. Add bonus or equity if you have them.',
            },
            {
              step: '02',
              title: 'We benchmark it',
              desc: 'We compare your offer to market data for your exact role, city, and seniority band.',
            },
            {
              step: '03',
              title: 'Know your number',
              desc: 'Weak, fair, or strong \u2014 plus the exact range you can ask for and a script to do it.',
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
            { title: 'Clear verdict',     desc: 'Weak, fair, or strong \u2014 no ambiguous percentile jargon.' },
            { title: 'Market range',       desc: 'The p25\u2013p75 range for your exact role, city, and experience band.' },
            { title: 'Negotiation range',  desc: 'The exact band you can reasonably push back on, in your currency.' },
            { title: 'Negotiation script', desc: 'A ready-to-send email based on your offer and market data.' },
            { title: 'Peer comparison',    desc: 'See where your offer sits against similar candidates in your market.' },
            { title: 'Risk signal',        desc: 'A clear warning if accepting now anchors you below market long-term.' },
          ].map(({ title, desc }) => (
            <div key={title} className="p-4 rounded-xl border border-gray-100 bg-white">
              <div className="text-sm font-bold text-gray-900 mb-1">{title}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Offer guide grid — with medians */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Offer benchmarks by role &amp; city</h2>
          <Link
            href="/salary/software-engineer-salary-london/"
            className="text-sm text-blue-600 font-semibold hover:underline"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guidesWithData.map(({ role, city, median }) => {
            const href = `/salary/${slugify(role)}-salary-${slugify(city)}/`
            return (
              <Link
                key={`${role}-${city}`}
                href={href}
                className="group block p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {role}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{city}</div>
                  </div>
                  {median && (
                    <div className="text-xs font-bold text-gray-500 group-hover:text-blue-500 transition-colors flex-shrink-0 mt-0.5">
                      {median}
                    </div>
                  )}
                </div>
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
              Already employed? Find out if you&apos;re underpaid at your current job &mdash; before you even start looking.
            </p>
            <p className="text-xs text-orange-500 mt-2 font-semibold">Check my current salary &rarr;</p>
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
              Offer looks good on paper &mdash; but does it actually work for your lifestyle? See what it means for rent, savings, and spending.
            </p>
            <p className="text-xs text-violet-500 mt-2 font-semibold">Check my lifestyle &rarr;</p>
          </a>
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-16">
        <div className="bg-gray-900 rounded-2xl p-8 sm:p-12 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Don&apos;t accept without checking this first.
          </h2>
          <p className="text-gray-400">30 seconds. Free. No email. No login. Offers expire &mdash; check now.</p>
          <ScrollToTopButton />
        </div>
      </section>

      <Footer locale="en" />
    </>
  )
}
