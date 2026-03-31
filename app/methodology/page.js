import Link from 'next/link'
import Navigation from '../../components/Navigation.jsx'
import Footer from '../../components/Footer.jsx'

export const metadata = {
  title: 'How We Calculate Offer Benchmarks — Our Methodology',
  description:
    'We use modelled salary estimates based on public benchmarks to evaluate job offers. Here\'s exactly how our offer verdict and negotiation ranges are calculated.',
  alternates: { canonical: '/methodology/' },
}

const SECTIONS = [
  {
    id: 'where-data-comes-from',
    heading: 'Where the data comes from',
    content: (
      <>
        <p>We do <strong>not</strong> have access to live company salary databases, proprietary HR platforms, or real-time job posting data. We want to be upfront about that.</p>
        <p>Our offer benchmarks are built from government earnings surveys and community compensation platforms, normalised into a structured pipeline:</p>
        <ul>
          <li><strong>BLS OEWS (US)</strong> — Bureau of Labor Statistics Occupational Employment and Wage Statistics. National and metro-area salary data by occupation. The most statistically rigorous US source. Used for US market estimates.</li>
          <li><strong>ONS ASHE (UK)</strong> — Annual Survey of Hours and Earnings. SOC 2020 occupation codes. Covers UK national and London regional gross annual pay for full-time employees. Open Government Licence. <em>UK locations only.</em></li>
          <li><strong>INE EES (Spain)</strong> — Encuesta de Estructura Salarial. Spain&apos;s national earnings structure survey. Includes regional breakdown for Madrid and Barcelona. <em>Spain only.</em></li>
          <li><strong>Stack Overflow Developer Survey</strong> — Self-reported compensation data from a large annual global survey. Used as a directional signal for tech roles across all markets. Self-reported data has known biases — weighted at a lower confidence tier than government surveys.</li>
          <li><strong>ECB exchange rates</strong> — Used to normalise cross-currency comparisons where applicable.</li>
        </ul>
        <p>All records are normalised into a unified schema and tagged with their source, geographic scope, seniority level, and data freshness.</p>
      </>
    ),
  },
  {
    id: 'how-we-benchmark',
    heading: 'How we benchmark offers',
    content: (
      <>
        <p>When you enter an offer, we look up the benchmark data for your specific role, city, and experience band.</p>
        <p>Each query runs a <strong>3-tier geographic search</strong>:</p>
        <ol>
          <li><strong>City-level records</strong> — the most specific and highest-weighted data. For example, ONS London regional data or BLS San Francisco metro data.</li>
          <li><strong>Country-level records</strong> — national survey data used when city-level data is not available.</li>
          <li><strong>Market fallback</strong> — derived from the closest available market with a geographic adjustment multiplier.</li>
        </ol>
        <p>The result is a <strong>p25 / median / p75</strong> range for your specific experience band. Your offer is then scored against this range to produce a percentile estimate and verdict.</p>
      </>
    ),
  },
  {
    id: 'experience-bands',
    heading: 'Experience bands',
    content: (
      <>
        <p>We map years of experience to four bands:</p>
        <ul>
          <li><strong>Junior (0–2 years)</strong> — entry to early career</li>
          <li><strong>Mid-level (3–5 years)</strong> — established contributor</li>
          <li><strong>Senior (6–10 years)</strong> — experienced specialist or team lead</li>
          <li><strong>Staff / Lead (11+ years)</strong> — principal, staff engineer, or senior management</li>
        </ul>
        <p>For each experience input, we find the applicable band and use the corresponding benchmark data. If exact band data is not available for a combination, we interpolate using an experience curve calibrated from observed market data.</p>
      </>
    ),
  },
  {
    id: 'verdict-calculation',
    heading: 'How verdicts are calculated',
    content: (
      <>
        <p>Your offer receives one of three verdicts based on its percentile position relative to the market range:</p>
        <ul>
          <li><strong>Weak offer</strong> — your offer is below the 25th percentile. Most candidates in your position can negotiate a better package. Accepting without negotiating may lock you below market for the next 2–3 years.</li>
          <li><strong>Fair offer</strong> — your offer is between the 25th and 63rd percentile. It&apos;s in range, but there&apos;s likely room to negotiate toward the upper half of the band.</li>
          <li><strong>Strong offer</strong> — your offer is above the 63rd percentile. The company has made a competitive offer. If you negotiate, focus on equity, signing bonus, or non-monetary terms rather than base salary.</li>
        </ul>
        <p>The negotiation range shown is the difference between your offer and the p50–p75 range for your band. This represents a reasonable ask that&apos;s defensible with market data.</p>
      </>
    ),
  },
  {
    id: 'confidence-levels',
    heading: 'Confidence levels',
    content: (
      <>
        <p>Each market combination is assigned a confidence level based on the quality of the underlying data:</p>
        <ul>
          <li><strong>High confidence</strong> — data from a primary government survey or BLS OEWS for this specific market. Direct source data, not modelled.</li>
          <li><strong>Estimated range</strong> — data derived from the nearest available market with an adjustment multiplier. Less precise, but directionally reliable.</li>
        </ul>
        <p>The confidence level is shown in your results. A lower confidence estimate is still useful as a directional signal — just treat the exact numbers as a range rather than a precise figure.</p>
      </>
    ),
  },
  {
    id: 'limitations',
    heading: 'Limitations',
    content: (
      <>
        <p>We believe transparency about limitations matters. Here is what you should keep in mind:</p>
        <ul>
          <li><strong>We cover 24 roles and 44 cities.</strong> If your exact role or city is not in our dataset, we apply the nearest available market. Results will be less precise.</li>
          <li><strong>We cover base salary only.</strong> Total compensation — equity, bonuses, benefits, pension contributions — is not included in our benchmarks. For senior roles at growth-stage companies, total comp can be significantly higher than base.</li>
          <li><strong>Company stage and size are not modelled.</strong> A senior engineer at a Series A startup and one at a FAANG company are not the same. Our benchmarks reflect a broad market average.</li>
          <li><strong>Data is not real-time.</strong> We update periodically, but salaries can move quickly in fast-changing markets.</li>
          <li><strong>Remote-first roles vary.</strong> Companies that benchmark pay globally may offer different rates than local employers. Our benchmarks reflect the local market, which may not match a remote-first employer&apos;s policy.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'why-still-useful',
    heading: 'Why this is still useful',
    content: (
      <>
        <p>Despite these limitations, benchmarking your offer is genuinely valuable — even with modelled estimates.</p>
        <p>Most candidates accept the first offer they receive with no data and no negotiation. Employers expect negotiation — the first offer is rarely the best possible offer. Having a market reference point fundamentally changes the conversation.</p>
        <p>Our tool gives you a directional signal. If our model puts your offer in the bottom 25% for your role and location, that&apos;s a meaningful data point — even if the exact median is off by a few thousand. It tells you there&apos;s a conversation worth having.</p>
        <p>The negotiation script we generate is calibrated to your specific offer and market. Use it as a starting point — adjust the tone and context to match your situation.</p>
        <p>For a more precise view, we recommend combining our estimate with:</p>
        <ul>
          <li>Job listings for similar roles in your location</li>
          <li>Conversations with recruiters who share live market rates</li>
          <li>Professional network salary discussions</li>
          <li>National salary survey data published by government bodies</li>
        </ul>
      </>
    ),
  },
]

export default function MethodologyPage() {
  return (
    <>
      <Navigation />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <nav className="text-sm text-gray-400 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-600">Methodology</span>
        </nav>

        <header className="mb-12 space-y-4">
          <div className="inline-block bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
            How we work
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            How we calculate offer benchmarks
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            We believe in being honest about what we do and don&apos;t know. This page explains where our salary data comes from and how we produce offer verdicts.
          </p>
        </header>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-12 space-y-3">
          <h2 className="font-bold text-gray-900">The short version</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Our benchmarks are based on <strong>public government wage data and structured modelling</strong>. We do not use real-time company data feeds or proprietary salary databases. Our numbers are designed to give you a directional signal — not a legally precise figure.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            {['Government wage data', 'Industry benchmarks', 'Experience modelling', 'Location adjustments'].map((tag) => (
              <span key={tag} className="text-xs font-semibold bg-white border border-blue-200 text-blue-700 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <nav className="mb-12 space-y-1 border-l-2 border-blue-100 pl-4">
          {SECTIONS.map(({ id, heading }) => (
            <a key={id} href={`#${id}`} className="block text-sm text-gray-500 hover:text-blue-600 py-0.5 transition-colors">
              {heading}
            </a>
          ))}
        </nav>

        <div className="space-y-14">
          {SECTIONS.map(({ id, heading, content }) => (
            <section key={id} id={id} className="scroll-mt-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{heading}</h2>
              <div className="prose prose-gray prose-sm max-w-none prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-3 prose-li:text-gray-600 prose-li:mb-1 prose-ul:space-y-1 prose-ol:space-y-1 prose-strong:text-gray-800 prose-strong:font-semibold">
                {content}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 bg-gray-900 rounded-2xl p-8 text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Got an offer to check?</h2>
          <p className="text-gray-400 text-sm">Takes 30 seconds. No email required. No signup.</p>
          <Link
            href="/#offer-tool"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Check this offer →
          </Link>
        </div>
      </div>

      <Footer locale="en" />
    </>
  )
}
