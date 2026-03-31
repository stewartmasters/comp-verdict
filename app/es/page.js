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
  title: '¿Esta oferta de trabajo es realmente buena? — Verificador gratuito',
  description:
    'Compara tu oferta de trabajo con datos de mercado y descubre si deberías negociar. Introduce rol, ciudad, salario y experiencia. Obtén tu veredicto en 30 segundos — gratis, sin registro.',
  alternates: {
    canonical: BASE_URL + '/es/',
    languages: {
      'en':        BASE_URL + '/',
      'es':        BASE_URL + '/es/',
      'de':        BASE_URL + '/de/',
      'x-default': BASE_URL + '/',
    },
  },
}

const FEATURED_CHECKS = [
  { role: 'Software Engineer',   city: 'Barcelona',      label: 'Software Engineer · Barcelona' },
  { role: 'Product Manager',     city: 'Madrid',         label: 'Product Manager · Madrid' },
  { role: 'Data Scientist',      city: 'Barcelona',      label: 'Data Scientist · Barcelona' },
  { role: 'Marketing Manager',   city: 'Madrid',         label: 'Marketing Manager · Madrid' },
  { role: 'Finance Analyst',     city: 'Barcelona',      label: 'Finance Analyst · Barcelona' },
  { role: 'Engineering Manager', city: 'Madrid',         label: 'Engineering Manager · Madrid' },
]

const CURATED_GUIDES = [
  { role: 'Software Engineer',         city: 'Barcelona' },
  { role: 'Product Manager',           city: 'Madrid' },
  { role: 'Data Scientist',            city: 'Barcelona' },
  { role: 'Marketing Manager',         city: 'Madrid' },
  { role: 'Engineering Manager',       city: 'Barcelona' },
  { role: 'Finance Analyst',           city: 'Madrid' },
  { role: 'Backend Engineer',          city: 'Barcelona' },
  { role: 'UX Designer',               city: 'Madrid' },
  { role: 'Operations Manager',        city: 'Barcelona' },
  { role: 'Machine Learning Engineer', city: 'Madrid' },
  { role: 'Product Designer',          city: 'Barcelona' },
  { role: 'Full Stack Engineer',       city: 'Madrid' },
]

const WEAK_OFFER_SIGNALS = [
  {
    signal: 'Es el primer número que te han dado',
    note: 'Los reclutadores abren rutinariamente por debajo de su límite máximo. La primera oferta casi nunca es la oferta final.',
  },
  {
    signal: 'Es un número sospechosamente redondo',
    note: '40.000 €, 50.000 € — esos son marcadores de posición, no cifras basadas en benchmarks. Tienen margen.',
  },
  {
    signal: 'Hicieron la oferta rápido sin preguntar tu salario actual',
    note: 'Las ofertas rápidas sin preguntas de anclaje a menudo significan que la banda es amplia y adivinaron bajo.',
  },
  {
    signal: 'Está por debajo del punto medio para tu banda de experiencia',
    note: 'Si tu oferta está en el percentil 40 o por debajo para tu rol y ciudad, ya estás siendo mal pagado antes de empezar.',
  },
]

export default function EsHomePage() {
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
              ¿Tienes una oferta? Compruébala antes de responder.
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
              ¿Esta oferta de trabajo es{' '}
              <span className="text-blue-600">realmente buena?</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed">
              La mayoría acepta la primera oferta. La mayoría se arrepiente. Compara tu oferta con datos de mercado de 44 ciudades — y descubre exactamente cuánto puedes pedir.
            </p>

            {/* Trust stats */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              {[
                { value: '24',  label: 'Tipos de rol' },
                { value: '44',  label: 'Ciudades' },
                { value: '10',  label: 'Fuentes oficiales' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-extrabold text-gray-900">{value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-1">
              <p className="text-xs text-gray-500 font-medium">Basado en datos oficiales del gobierno:</p>
              <TrustSection variant="minimal" />
              <p className="text-xs text-gray-400">10 organismos nacionales de estadística · La cobertura varía según el rol y la ubicación.</p>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Consultas populares</p>
              <div className="flex flex-wrap gap-2">
                {FEATURED_CHECKS.map(({ role, city, label }) => {
                  const href = `/es/salarios/${slugify(role)}-salario-${slugify(city)}/`
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
            <VerdictTool cvData={CV_DATA} locale="es" />
          </div>
        </div>
      </section>

      {/* Señales de oferta débil */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 border-t border-gray-100 mt-2">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-10 items-start">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
              Señales de que tu<br />oferta es débil
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              La mayoría de las ofertas tienen margen. Estos patrones sugieren que la tuya también lo tiene.
            </p>
            <Link href="/es/#offer-tool" className="inline-block text-sm font-semibold text-blue-600 hover:underline">
              Verificar esta oferta &rarr;
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

      {/* Cómo funciona */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">Cómo funciona</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Introduce la oferta',
              desc: 'Rol, ciudad, salario base, años de experiencia. Añade bonus o equity si los tienes.',
            },
            {
              step: '02',
              title: 'Lo comparamos',
              desc: 'Comparamos tu oferta con datos de mercado para tu rol exacto, ciudad y banda de antigüedad.',
            },
            {
              step: '03',
              title: 'Conoce tu número',
              desc: 'Débil, justa o sólida — más el rango exacto que puedes pedir y un guión para hacerlo.',
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

      {/* Basado en datos oficiales */}
      <TrustSection />

      {/* Qué obtienes */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Qué obtienes</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Veredicto claro',         desc: 'Débil, justa o sólida — sin jerga de percentiles ambigua.' },
            { title: 'Rango de mercado',         desc: 'El rango p25–p75 para tu rol exacto, ciudad y banda de experiencia.' },
            { title: 'Rango de negociación',     desc: 'La banda exacta sobre la que puedes razonablemente negociar, en tu moneda.' },
            { title: 'Guión de negociación',     desc: 'Un correo listo para enviar basado en tu oferta y datos de mercado.' },
            { title: 'Comparación con peers',    desc: 'Ve dónde se sitúa tu oferta frente a candidatos similares en tu mercado.' },
            { title: 'Señal de riesgo',          desc: 'Una advertencia clara si aceptar ahora te ancla por debajo del mercado a largo plazo.' },
          ].map(({ title, desc }) => (
            <div key={title} className="p-4 rounded-xl border border-gray-100 bg-white">
              <div className="text-sm font-bold text-gray-900 mb-1">{title}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Benchmarks salariales por rol y ciudad */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Benchmarks salariales por rol y ciudad</h2>
          <Link
            href="/es/salarios/software-engineer-salario-barcelona/"
            className="text-sm text-blue-600 font-semibold hover:underline"
          >
            Ver todos &rarr;
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guidesWithData.map(({ role, city, median }) => {
            const href = `/es/salarios/${slugify(role)}-salario-${slugify(city)}/`
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
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Preguntas frecuentes</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              q: '¿Esta oferta es realmente buena?',
              a: 'Una oferta es sólida si está en el percentil 75 o por encima para tu rol, ciudad y nivel de experiencia. Si está por debajo del percentil 40, casi siempre hay margen para negociar. Introduce tu paquete arriba para saber exactamente dónde está el tuyo.',
            },
            {
              q: '¿Debería siempre negociar?',
              a: 'Sí — con una advertencia. Si tu oferta ya está por encima del percentil 75, negociar agresivamente conlleva más riesgo que beneficio. Para ofertas por debajo de la mediana, negociar es de bajo riesgo y generalmente esperado. La herramienta te dice en qué situación estás.',
            },
            {
              q: '¿De dónde vienen los datos salariales?',
              a: 'Usamos encuestas salariales primarias de 10 organismos nacionales de estadística, incluyendo INE (España), ONS (Reino Unido), BLS (EE.UU.), Destatis (Alemania), Eurostat, INSEE (Francia), CBS (Países Bajos), ABS (Australia), Statistics Canada y la OCDE. Sin crowdsourcing — datos oficiales.',
            },
            {
              q: '¿Qué se considera una oferta débil?',
              a: 'Una oferta por debajo del percentil 35 para tu rol, ciudad y banda de experiencia es débil — lo que significa que la mayoría de candidatos comparables ganan más. Un primer número redondo (40.000 €, 50.000 €) también es una señal: son marcadores de posición, no cifras basadas en benchmarks.',
            },
            {
              q: '¿Funciona para mercados fuera de Europa?',
              a: 'Sí. CompVerdict cubre 44 ciudades en Europa, América del Norte, Australia, Singapur y Dubái. La profundidad de cobertura varía — los mercados europeos (Reino Unido, Alemania, España, Francia, Países Bajos) tienen los datos oficiales más granulares.',
            },
            {
              q: '¿Cuál es la diferencia entre CompVerdict y SalaryVerdict?',
              a: 'CompVerdict es para evaluar una oferta de trabajo que has recibido — ¿deberías aceptarla y cuánto puedes negociar? SalaryVerdict es para verificar si tu salario actual está por debajo del mercado. Herramientas diferentes para momentos diferentes de tu carrera.',
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

      {/* Red Verdict */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Más de la red Verdict</h2>
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
              ¿Ya trabajas? Descubre si te están pagando por debajo del mercado en tu trabajo actual — antes de empezar a buscar.
            </p>
            <p className="text-xs text-orange-500 mt-2 font-semibold">Verificar mi salario actual &rarr;</p>
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
              La oferta parece buena sobre el papel — ¿pero funciona realmente para tu estilo de vida? Ve qué significa para el alquiler, ahorros y gastos.
            </p>
            <p className="text-xs text-violet-500 mt-2 font-semibold">Verificar mi estilo de vida &rarr;</p>
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-16">
        <div className="bg-gray-900 rounded-2xl p-8 sm:p-12 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            No aceptes sin comprobar esto primero.
          </h2>
          <p className="text-gray-400">30 segundos. Gratis. Sin email. Sin registro. Las ofertas caducan — comprueba ahora.</p>
          <ScrollToTopButton />
        </div>
      </section>

      <Footer locale="es" />

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
