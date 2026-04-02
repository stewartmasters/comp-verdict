import { notFound } from 'next/navigation'
import Link from 'next/link'
import { generateSeoPages, getSeoPage, getRelatedPages, getLocationContext, getRoleContext, getIntroVariant, SALARY_ROLES, SEO_CITIES, slugify } from '../../../lib/seo-pages.js'
import { fmt } from '../../../lib/helpers.js'
import { getSalaryContent, getAllSalaryContentSlugs } from '../../../lib/salaryContent.js'

const YEAR = 2026
import Navigation from '../../../components/Navigation.jsx'
import Footer from '../../../components/Footer.jsx'
import PageTracker from '../../../components/PageTracker.jsx'

const BASE_URL = 'https://www.compverdict.com'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  const dataSlugs = generateSeoPages().map((p) => ({ slug: p.slug }))
  const contentSlugs = getAllSalaryContentSlugs()
  const dataSlugSet = new Set(dataSlugs.map((s) => s.slug))
  const newContentSlugs = contentSlugs.filter((s) => !dataSlugSet.has(s.slug))
  return [...dataSlugs, ...newContentSlugs]
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const page = getSeoPage(slug)
  if (!page) {
    const post = getSalaryContent(slug)
    if (!post) return {}
    return {
      title: `${post.title} — CompVerdict`,
      description: post.description,
      alternates: { canonical: `${BASE_URL}/salary/${slug}/` },
      openGraph: { title: post.title, description: post.description, type: 'article', publishedTime: post.date },
      twitter: { card: 'summary_large_image', title: post.title, description: post.description },
    }
  }
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/salary/${slug}/` },
    openGraph: { title: page.title, description: page.description },
  }
}

function buildFaqs(page) {
  const { role, city, mid, bands, symbol } = page

  if (page.type === 'role-city' && mid) {
    const p50 = fmt(mid.p50, symbol)
    const p25 = fmt(mid.p25, symbol)
    const p75 = fmt(mid.p75, symbol)
    const senior = bands?.senior
    const seniorP50 = senior ? fmt(senior.p50, symbol) : null

    return [
      {
        q: `What is the average ${role} salary in ${city}?`,
        a: `The median ${role} salary in ${city} is ${p50} per year for mid-level experience (3–5 years). The range runs from ${p25} at the 25th percentile to ${p75} at the 75th percentile. ${seniorP50 ? `Senior ${role}s typically earn around ${seniorP50} or more.` : ''} These are gross annual base salary estimates.`,
      },
      {
        q: `Is my ${role} offer in ${city} competitive?`,
        a: `A ${role} offer in ${city} is competitive if it reaches the 75th percentile for your experience band — around ${p75} for mid-level (3–5 years). If your offer is below ${p25}, there's a clear case to negotiate. Use the tool above to check your specific offer against the market.`,
      },
      {
        q: `How much should I ask for as a ${role} in ${city}?`,
        a: `For a mid-level ${role} in ${city}, the market median is ${p50}. A strong ask targets ${p75} or above. If your offer is below ${p25}, open negotiations by anchoring at the median — that's ${p50}. Always lead with market data rather than personal need when negotiating.`,
      },
      {
        q: `Should I negotiate my ${role} offer in ${city}?`,
        a: `If your offer is below the 75th percentile for your experience band, negotiating is almost always worth it. Most companies expect negotiation — the first offer is rarely the best possible offer. The risk of asking politely is low; the cost of not asking can compound over years through salary anchoring effects.`,
      },
      {
        q: `How do ${role} salaries in ${city} vary by experience?`,
        a: `Experience is the strongest driver of ${role} compensation in ${city}. Junior roles (0–2 years) typically earn 55–70% of the mid-level median. Senior roles (6+ years) typically earn 125–150% of mid-level. Staff / lead roles can reach 150–200% depending on scope and company stage.`,
      },
    ]
  }

  // Role-only page
  return [
    {
      q: `What is the average ${role} salary across major cities?`,
      a: `${role} salaries vary significantly by city. London typically pays the most in Europe — 30–45% above the European average. Amsterdam, Dublin, and Paris follow. Berlin and Munich sit around the European average. Spanish and Portuguese markets pay 15–30% below the average. San Francisco and New York lead globally.`,
    },
    {
      q: `How do I know if my ${role} offer is good?`,
      a: `Compare your offer to the market range for your specific city and experience band. If your offer is below the 35th percentile for your band, there's a strong case you're being underpaid. Use the CompVerdict tool to check your specific offer instantly.`,
    },
    {
      q: `What is a competitive ${role} salary?`,
      a: `A competitive ${role} salary sits at or above the 65th percentile for your city and experience level. Anything above the 75th percentile is exceptional. Below the 40th percentile, there's usually room to negotiate — and it's worth trying.`,
    },
    {
      q: `How much do senior ${role}s earn?`,
      a: `Senior ${role}s (7+ years) typically earn 30–45% more than mid-level rates in the same city. In high-paying markets like London, San Francisco, or Amsterdam, senior roles often exceed the figures shown for mid-level by a meaningful amount.`,
    },
  ]
}

function buildFaqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

function buildIntro(page) {
  const { role, city, mid, bands, symbol } = page
  if (page.type !== 'role-city' || !mid) return getRoleContext(role)

  const p50 = fmt(mid.p50, symbol)
  const p25 = fmt(mid.p25, symbol)
  const p75 = fmt(mid.p75, symbol)
  const locationCtx = getLocationContext(city)
  const roleCtx = getRoleContext(role)

  const v = getIntroVariant(page.slug)
  if (v === 0) {
    return `${role}s in ${city} typically earn between ${p25} and ${p75} per year, with a market midpoint of ${p50}. ${locationCtx}`
  } else if (v === 1) {
    return `The median ${role} salary in ${city} is ${p50} — ranging from ${p25} for junior roles to ${p75} at the senior level. ${roleCtx}`
  } else {
    return `In ${city}, a mid-level ${role} earns around ${p50} per year. The full market range runs from ${p25} to ${p75} depending on seniority. ${locationCtx}`
  }
}

export default async function SalaryPage({ params }) {
  const { slug } = await params
  const page = getSeoPage(slug)

  // Markdown fallback: AI-generated comp guide content published by the Verdict SEO Platform
  if (!page) {
    const post = getSalaryContent(slug)
    if (!post) notFound()
    const articleSchema = {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: post.title, description: post.description,
      datePublished: post.date, dateModified: post.date,
      url: `${BASE_URL}/salary/${slug}/`,
      author: { '@type': 'Organization', name: 'CompVerdict', url: BASE_URL },
      publisher: { '@type': 'Organization', name: 'CompVerdict', url: BASE_URL },
    }
    const breadcrumbSchema = {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Offer guides', item: `${BASE_URL}/salary/software-engineer-salary-london/` },
        { '@type': 'ListItem', position: 3, name: post.title, item: `${BASE_URL}/salary/${slug}/` },
      ],
    }
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <Navigation />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <nav className="text-sm text-gray-400 mb-8 flex items-center gap-2">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/salary/software-engineer-salary-london/" className="hover:text-blue-600 transition-colors">Offer guides</Link>
            <span>/</span>
            <span className="text-gray-600 truncate">{post.title}</span>
          </nav>
          <header className="mb-10 space-y-4">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">{post.title}</h1>
            <p className="text-lg text-gray-500">{post.description}</p>
          </header>
          <article
            className="prose prose-gray prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className="mt-10 bg-blue-50 rounded-2xl p-8 text-center space-y-3 border border-blue-100">
            <h2 className="text-lg font-bold text-gray-900">Is this offer competitive?</h2>
            <p className="text-sm text-gray-500">Check your offer against market data in 30 seconds. Free, no signup.</p>
            <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors">Check my offer →</Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const related = getRelatedPages(page)
  const faqs = buildFaqs(page)
  const faqSchema = buildFaqSchema(faqs)
  const { role, city, mid, bands, symbol } = page

  const otherCities = SEO_CITIES.filter((c) => c !== city).slice(0, 8)
  const otherRoles = SALARY_ROLES.filter((r) => r !== role).slice(0, 8)

  const GUIDE_LINKS = [
    { href: '/methodology/', label: 'How we calculate offer benchmarks' },
    { href: '/negotiate/', label: 'How to negotiate your salary' },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Navigation />
      <PageTracker event="salary_page_view" role={role || ''} city={city || ''} locale="en" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-8 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/salary/software-engineer-salary-london/" className="hover:text-blue-600 transition-colors">
            Offer guides
          </Link>
          <span>/</span>
          <span className="text-gray-600">{page.h1}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_380px] gap-12">

          {/* Main content */}
          <div className="space-y-10 min-w-0">

            {/* Heading + intro */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">{page.h1}</h1>
              <p className="text-lg text-gray-500 leading-relaxed">{buildIntro(page)}</p>
              {page.type === 'role-city' && (
                <p className="text-gray-500 text-base leading-relaxed">
                  Below you&apos;ll find salary bands by experience level, plus a breakdown of what&apos;s considered a strong, fair, or weak offer for this market.
                </p>
              )}
              <p className="text-xs text-gray-400">
                Estimates based on public benchmarks and modelled data.{' '}
                <Link href="/methodology/" className="text-blue-600 hover:underline">How we calculate →</Link>
              </p>
            </div>

            {/* At a glance — role-city only */}
            {page.type === 'role-city' && mid && (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="text-base font-bold text-gray-900">At a glance</h2>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                    {YEAR} · Gross annual base salary
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs text-gray-400">Median salary</div>
                    <div className="font-bold text-gray-900 text-sm">{fmt(mid.p50, symbol)}</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs text-gray-400">Typical range</div>
                    <div className="font-bold text-gray-900 text-sm">{fmt(mid.p25, symbol)} – {fmt(mid.p75, symbol)}</div>
                  </div>
                  {bands?.senior && (
                    <div className="space-y-0.5">
                      <div className="text-xs text-gray-400">Senior median</div>
                      <div className="font-bold text-gray-900 text-sm">{fmt(bands.senior.p50, symbol)}</div>
                    </div>
                  )}
                  <div className="space-y-0.5">
                    <div className="text-xs text-gray-400">Weak offer below</div>
                    <div className="font-bold text-red-500 text-sm">{fmt(Math.round(mid.p25 * 0.95 / 500) * 500, symbol)}</div>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  Gross annual base salary estimates · {YEAR} · Public benchmarks + structured modelling ·{' '}
                  <Link href="/methodology/" className="text-blue-600 hover:underline">Methodology →</Link>
                </p>
              </div>
            )}

            {/* Seniority bands — role-city only */}
            {page.type === 'role-city' && bands && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {role} salary bands in {city}
                </h2>
                <div className="space-y-3">
                  {[
                    { key: 'junior', label: 'Junior (0–2 yrs)', color: 'bg-blue-50 border-blue-100' },
                    { key: 'mid',    label: 'Mid-level (3–5 yrs)', color: 'bg-indigo-50 border-indigo-200' },
                    { key: 'senior', label: 'Senior (6–10 yrs)', color: 'bg-emerald-50 border-emerald-100' },
                    { key: 'staff',  label: 'Staff / Lead (11+ yrs)', color: 'bg-amber-50 border-amber-100' },
                  ].map(({ key, label, color }) => {
                    const b = bands[key]
                    if (!b) return null
                    return (
                      <div key={key} className={`flex items-center justify-between p-4 rounded-xl border ${color}`}>
                        <div>
                          <div className="text-sm font-semibold text-gray-800">{label}</div>
                          <div className="text-xs text-gray-500 mt-0.5">Typical range</div>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-bold text-gray-900">
                            {fmt(b.p25, symbol)} – {fmt(b.p75, symbol)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Median: <span className="font-semibold">{fmt(b.p50, symbol)}</span>
                          </div>
                        </div>
                      </div>
                    )
                  }).filter(Boolean)}
                </div>
                <p className="text-xs text-gray-400">Gross annual base salary estimates for {YEAR}. Bonuses and equity not included.</p>
              </div>
            )}

            {/* Role-only: city table */}
            {page.type === 'role-only' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">{role} offer benchmarks by city</h2>
                <div className="space-y-2">
                  {SEO_CITIES.map((c) => {
                    const href = `/salary/${slugify(role)}-salary-${slugify(c)}/`
                    return (
                      <Link
                        key={c}
                        href={href}
                        className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
                      >
                        <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                          {c}
                        </span>
                        <span className="text-xs text-gray-400">View benchmark →</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Offer evaluation box */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-3 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Is your offer good?</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Knowing the market range is step one. The real question is where your specific offer sits within it — and how much room you have to negotiate. If your offer is in the bottom 30% for your role and location, there&apos;s a strong case to push back.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Use the CompVerdict tool to get your verdict instantly. No signup, no email. You&apos;ll also get a ready-to-send negotiation script based on your exact offer.
              </p>
              <Link href="/#offer-tool" className="inline-block mt-1 text-sm font-semibold text-blue-600 hover:underline">
                Check this offer →
              </Link>
            </div>

            {/* FAQ */}
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900">Frequently asked questions</h2>
              <div className="space-y-3">
                {faqs.map(({ q, a }) => (
                  <details key={q} className="group border border-gray-100 rounded-xl overflow-hidden">
                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                      <h3 className="font-semibold text-gray-900 text-sm pr-4">{q}</h3>
                      <span className="text-gray-400 text-lg flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <div className="px-5 pb-5">
                      <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Related guides */}
            {related.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Related offer guides</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {related.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/salary/${p.slug}/`}
                      className="block p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                      {p.h1}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Other roles / other cities chips */}
            <div className="grid sm:grid-cols-2 gap-6 border-t border-gray-100 pt-8">
              {page.type === 'role-city' && otherRoles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Other roles in {city}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {otherRoles.map((r) => {
                      const href = `/salary/${slugify(r)}-salary-${slugify(city)}/`
                      return (
                        <Link
                          key={r}
                          href={href}
                          className="text-xs bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-full transition-colors"
                        >
                          {r}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
              {page.type === 'role-city' && otherCities.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {role} offers in other cities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {otherCities.map((c) => {
                      const href = `/salary/${slugify(role)}-salary-${slugify(c)}/`
                      return (
                        <Link
                          key={c}
                          href={href}
                          className="text-xs bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-full transition-colors"
                        >
                          {c}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Guide links + cross-network */}
            <div className="space-y-3 border-t border-gray-100 pt-8">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Useful guides</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {GUIDE_LINKS.map(({ href, label }) => (
                  <Link key={href} href={href} className="text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors">
                    {label} →
                  </Link>
                ))}
              </div>
            </div>

            {/* Cross-network links */}
            <div className="grid sm:grid-cols-2 gap-4 border-t border-gray-100 pt-8">
              <a
                href="https://www.salaryverdict.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all"
              >
                <div className="text-sm font-bold text-gray-900 group-hover:text-orange-600 mb-1">
                  Already employed? Check if you&apos;re underpaid →
                </div>
                <p className="text-xs text-gray-500">SalaryVerdict compares your current salary against market data.</p>
              </a>
              <a
                href="https://www.spendverdict.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-4 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50 transition-all"
              >
                <div className="text-sm font-bold text-gray-900 group-hover:text-violet-600 mb-1">
                  Does this salary work for your lifestyle? →
                </div>
                <p className="text-xs text-gray-500">SpendVerdict shows what this salary means for your spending and savings.</p>
              </a>
            </div>

            {/* Disclaimer */}
            <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
              Salary estimates are based on public benchmarks and modelled data. They represent gross annual base salary and do not include bonuses, equity, or benefits.{' '}
              <Link href="/methodology/" className="text-blue-600 hover:underline">Read our methodology →</Link>
            </div>
          </div>

          {/* Sticky aside — Check offer CTA */}
          <aside className="lg:sticky lg:top-20 lg:self-start space-y-4">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 p-6 space-y-4">
              <div>
                <p className="text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">Got an offer?</p>
                <p className="text-xs text-gray-400 mb-4">Check if it&apos;s fair, weak, or strong — and get your negotiation range.</p>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2.5">
                  <span className="text-blue-600 font-bold mt-0.5">✓</span>
                  <span>Verdict: weak, fair, or strong</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-blue-600 font-bold mt-0.5">✓</span>
                  <span>Market range for your experience band</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-blue-600 font-bold mt-0.5">✓</span>
                  <span>Exact negotiation range ({page.city ? page.symbol || '€' : '€'}X – {page.city ? page.symbol || '€' : '€'}Y)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-blue-600 font-bold mt-0.5">✓</span>
                  <span>Ready-to-send negotiation script</span>
                </div>
              </div>
              <Link
                href="/#offer-tool"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Check this offer →
              </Link>
              <p className="text-xs text-gray-400 text-center">Free · No signup · 30 seconds</p>
            </div>

            {/* Trust */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Data sources</p>
              <div className="space-y-1.5">
                {['BLS OEWS', 'ONS ASHE', 'INE EES', 'Stack Overflow Survey'].map((src) => (
                  <div key={src} className="text-xs text-gray-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-300 flex-shrink-0" />
                    {src}
                  </div>
                ))}
              </div>
              <Link href="/methodology/" className="block mt-3 text-xs text-blue-600 hover:underline">
                Read methodology →
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <Footer locale="en" />
    </>
  )
}
