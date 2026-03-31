import Link from 'next/link'
import { CV_DATA } from '../../lib/cv-data.js'
import { getRange, fmt } from '../../lib/helpers.js'
import { slugify } from '../../lib/seo-pages.js'
import VerdictTool from '../../components/VerdictTool.jsx'
import Navigation from '../../components/Navigation.jsx'
import Footer from '../../components/Footer.jsx'
import TrustSection from '../../components/TrustSection.jsx'
import ScrollToTopButton from '../../components/ScrollToTopButton.jsx'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.compverdict.com'

export const metadata = {
  title: 'Ist dieses Stellenangebot wirklich gut? — Kostenloser Angebotsprüfer',
  description:
    'Vergleiche dein Stellenangebot mit Marktdaten und finde heraus, ob du verhandeln solltest. Rolle, Stadt, Gehalt und Berufserfahrung eingeben. Erhalte dein Urteil in 30 Sekunden — kostenlos, ohne Anmeldung.',
  alternates: {
    canonical: BASE_URL + '/de/',
    languages: {
      'en':        BASE_URL + '/',
      'es':        BASE_URL + '/es/',
      'de':        BASE_URL + '/de/',
      'x-default': BASE_URL + '/',
    },
  },
}

const FEATURED_CHECKS = [
  { role: 'Software Engineer',   city: 'Berlin',    label: 'Software Engineer · Berlin' },
  { role: 'Product Manager',     city: 'Munich',    label: 'Product Manager · München' },
  { role: 'Data Scientist',      city: 'Hamburg',   label: 'Data Scientist · Hamburg' },
  { role: 'Marketing Manager',   city: 'Frankfurt', label: 'Marketing Manager · Frankfurt' },
  { role: 'Finance Analyst',     city: 'Munich',    label: 'Finance Analyst · München' },
  { role: 'Engineering Manager', city: 'Berlin',    label: 'Engineering Manager · Berlin' },
]

const CURATED_GUIDES = [
  { role: 'Software Engineer',         city: 'Berlin' },
  { role: 'Product Manager',           city: 'Munich' },
  { role: 'Data Scientist',            city: 'Hamburg' },
  { role: 'Marketing Manager',         city: 'Frankfurt' },
  { role: 'Engineering Manager',       city: 'Berlin' },
  { role: 'Finance Analyst',           city: 'Munich' },
  { role: 'Backend Engineer',          city: 'Berlin' },
  { role: 'UX Designer',               city: 'Munich' },
  { role: 'Operations Manager',        city: 'Hamburg' },
  { role: 'Machine Learning Engineer', city: 'Berlin' },
  { role: 'Product Designer',          city: 'Munich' },
  { role: 'Full Stack Engineer',       city: 'Frankfurt' },
]

const WEAK_OFFER_SIGNALS = [
  {
    signal: 'Es ist das erste Angebot, das sie gemacht haben',
    note: 'Recruiter eröffnen routinemäßig unter ihrer Obergrenze. Das erste Angebot ist fast nie das endgültige Angebot.',
  },
  {
    signal: 'Es ist eine verdächtig runde Zahl',
    note: '80.000 €, 70.000 € — das sind Platzhalter, keine benchmarkbasierten Zahlen. Da ist Spielraum.',
  },
  {
    signal: 'Sie haben schnell angeboten, ohne nach deinem aktuellen Gehalt zu fragen',
    note: 'Schnelle Angebote ohne Anker-Fragen bedeuten oft, dass das Band weit ist und sie niedrig geschätzt haben.',
  },
  {
    signal: 'Es liegt unter dem Mittelpunkt für deine Erfahrungsstufe',
    note: 'Wenn dein Angebot beim 40. Perzentil oder darunter liegt, wirst du bereits vor deinem ersten Arbeitstag unterbezahlt.',
  },
]

export default function DeHomePage() {
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
              Angebot erhalten? Erst prüfen, dann antworten.
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
              Ist dieses Angebot{' '}
              <span className="text-blue-600">wirklich gut?</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed">
              Die meisten nehmen das erste Angebot an. Die meisten bereuen es. Vergleiche dein Angebot mit Marktdaten aus 44 Städten — und erfahre genau, wie viel du nachverhandeln kannst.
            </p>

            {/* Trust stats */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              {[
                { value: '24',  label: 'Stellenprofile' },
                { value: '44',  label: 'Städte' },
                { value: '10',  label: 'Offizielle Quellen' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-extrabold text-gray-900">{value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-1">
              <p className="text-xs text-gray-500 font-medium">Basiert auf offiziellen Regierungsdaten:</p>
              <TrustSection variant="minimal" />
              <p className="text-xs text-gray-400">10 nationale Statistikbehörden · Abdeckung variiert nach Stelle und Standort.</p>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Beliebte Prüfungen</p>
              <div className="flex flex-wrap gap-2">
                {FEATURED_CHECKS.map(({ role, city, label }) => {
                  const href = `/de/gehalt/${slugify(role)}-gehalt-${slugify(city)}/`
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
            <VerdictTool cvData={CV_DATA} locale="de" />
          </div>
        </div>
      </section>

      {/* Anzeichen für ein schwaches Angebot */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 border-t border-gray-100 mt-2">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-10 items-start">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
              Anzeichen für ein<br />schwaches Angebot
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Die meisten Angebote haben Spielraum. Diese Muster deuten darauf hin, dass deins auch Spielraum hat.
            </p>
            <Link href="/de/#offer-tool" className="inline-block text-sm font-semibold text-blue-600 hover:underline">
              Dieses Angebot prüfen &rarr;
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

      {/* So funktioniert es */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">So funktioniert es</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Angebot eingeben',
              desc: 'Stelle, Stadt, Grundgehalt, Berufserfahrung. Bonus oder Equity optional hinzufügen.',
            },
            {
              step: '02',
              title: 'Wir benchmarken es',
              desc: 'Wir vergleichen dein Angebot mit Marktdaten für genau deine Stelle, Stadt und Erfahrungsstufe.',
            },
            {
              step: '03',
              title: 'Deine Zahl kennen',
              desc: 'Schwach, fair oder stark — plus die genaue Spanne, die du fordern kannst, und ein Skript dazu.',
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

      {/* Basiert auf offiziellen Daten */}
      <TrustSection />

      {/* Was du bekommst */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Was du bekommst</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Klares Urteil',           desc: 'Schwach, fair oder stark — kein unklares Perzentil-Kauderwelsch.' },
            { title: 'Marktspanne',              desc: 'Die P25–P75-Spanne für genau deine Stelle, Stadt und Erfahrungsstufe.' },
            { title: 'Verhandlungsspanne',       desc: 'Die genaue Bandbreite, um die du vernünftigerweise verhandeln kannst, in deiner Währung.' },
            { title: 'Verhandlungsskript',       desc: 'Eine versandfertige E-Mail basierend auf deinem Angebot und Marktdaten.' },
            { title: 'Vergleich mit Peers',      desc: 'Sieh, wo dein Angebot im Vergleich zu ähnlichen Kandidaten in deinem Markt steht.' },
            { title: 'Risikohinweis',            desc: 'Eine klare Warnung, wenn die Annahme jetzt dich langfristig unter Marktniveau verankert.' },
          ].map(({ title, desc }) => (
            <div key={title} className="p-4 rounded-xl border border-gray-100 bg-white">
              <div className="text-sm font-bold text-gray-900 mb-1">{title}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Gehalts-Benchmarks nach Stelle & Stadt */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Gehalts-Benchmarks nach Stelle &amp; Stadt</h2>
          <Link
            href="/de/gehalt/software-engineer-gehalt-berlin/"
            className="text-sm text-blue-600 font-semibold hover:underline"
          >
            Alle anzeigen &rarr;
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guidesWithData.map(({ role, city, median }) => {
            const href = `/de/gehalt/${slugify(role)}-gehalt-${slugify(city)}/`
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

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Häufig gestellte Fragen</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              q: 'Ist dieses Angebot wirklich gut?',
              a: 'Ein Angebot ist stark, wenn es beim 75. Perzentil oder darüber für deine Stelle, Stadt und Erfahrungsstufe liegt. Wenn es unter dem 40. Perzentil liegt, ist fast immer Verhandlungsspielraum vorhanden. Gib dein Paket oben ein, um genau zu erfahren, wo es landet.',
            },
            {
              q: 'Soll ich immer verhandeln?',
              a: 'Ja — mit einem Vorbehalt. Wenn dein Angebot bereits über dem 75. Perzentil liegt, trägt aggressives Verhandeln mehr Risiko als Nutzen. Bei Angeboten unter dem Median ist verhandeln risikoarm und wird meist erwartet. Das Tool sagt dir, in welcher Situation du dich befindest.',
            },
            {
              q: 'Woher kommen die Gehaltsdaten?',
              a: 'Wir verwenden primäre Lohnerhebungen von 10 nationalen Statistikbehörden, darunter Destatis (Deutschland), ONS (Großbritannien), BLS (USA), INE (Spanien), Eurostat, INSEE (Frankreich), CBS (Niederlande), ABS (Australien), Statistics Canada und die OECD. Kein Crowdsourcing — offizielle Daten.',
            },
            {
              q: 'Was gilt als schwaches Angebot?',
              a: 'Ein Angebot unter dem 35. Perzentil für deine Stelle, Stadt und Erfahrungsstufe ist schwach — das bedeutet, die meisten vergleichbaren Kandidaten verdienen mehr. Eine runde Erstzahl (80.000 €, 70.000 €) ist ebenfalls ein Signal: Das sind Platzhalter, keine benchmarkbasierten Zahlen.',
            },
            {
              q: 'Funktioniert das auch für Märkte außerhalb Europas?',
              a: 'Ja. CompVerdict deckt 44 Städte in Europa, Nordamerika, Australien, Singapur und Dubai ab. Die Abdeckungstiefe variiert — europäische Märkte (Deutschland, Großbritannien, Spanien, Frankreich, Niederlande) haben die granularsten offiziellen Daten.',
            },
            {
              q: 'Was ist der Unterschied zwischen CompVerdict und SalaryVerdict?',
              a: 'CompVerdict ist dafür gedacht, ein erhaltenes Stellenangebot zu bewerten — solltest du annehmen, und wie viel kannst du zurückverhandeln? SalaryVerdict ist dafür, zu prüfen, ob dein aktuelles Gehalt unter Marktniveau liegt. Verschiedene Tools für verschiedene Momente in deiner Karriere.',
            },
          ].map(({ q, a }) => (
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
      </section>

      {/* Verdict-Netzwerk */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Mehr vom Verdict-Netzwerk</h2>
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
              Bereits angestellt? Finde heraus, ob du bei deinem aktuellen Job unterbezahlt wirst — bevor du überhaupt anfängst zu suchen.
            </p>
            <p className="text-xs text-orange-500 mt-2 font-semibold">Mein aktuelles Gehalt prüfen &rarr;</p>
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
              Angebot sieht auf dem Papier gut aus — aber funktioniert es wirklich für deinen Lebensstil? Sieh, was es für Miete, Ersparnisse und Ausgaben bedeutet.
            </p>
            <p className="text-xs text-violet-500 mt-2 font-semibold">Meinen Lebensstil prüfen &rarr;</p>
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-16">
        <div className="bg-gray-900 rounded-2xl p-8 sm:p-12 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Nicht annehmen, ohne das hier zuerst zu prüfen.
          </h2>
          <p className="text-gray-400">30 Sekunden. Kostenlos. Kein Login. Angebote haben ein Ablaufdatum — jetzt prüfen.</p>
          <ScrollToTopButton />
        </div>
      </section>

      <Footer locale="de" />

      <form name="offer-results" data-netlify="true" hidden aria-hidden="true">
        <input type="email" name="email" />
        <input type="hidden" name="role" />
        <input type="hidden" name="city" />
        <input type="hidden" name="verdict" />
        <input type="hidden" name="locale" />
      </form>
    </>
  )
}
