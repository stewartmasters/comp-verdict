import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  es, SALARY_ROLES, slug, buildSalaryPageProps, buildSalarySlugMap,
  getSalaryPath, getNegPath, getHomePath, getHubPath, SITE_URL
} from '../../../../lib/page-helpers.js'
import SalaryPageContent from '../../../../components/SalaryPageContent.jsx'
import Navigation from '../../../../components/Navigation.jsx'
import Footer from '../../../../components/Footer.jsx'
import PageTracker from '../../../../components/PageTracker.jsx'
import { getAllEsSalaryContentSlugs, getEsSalaryContent } from '../../../../lib/salaryContent.js'

export const dynamic = 'force-static'
export const dynamicParams = false

const locale = es
const slugMap = buildSalarySlugMap(locale)

export function generateStaticParams() {
  const calcSlugs = SALARY_ROLES.flatMap(role =>
    locale.SALARY_CITIES.map(city => ({
      slug: `${slug(role)}-${locale.salarySlugWord}-${slug(city)}`,
    }))
  )
  const contentSlugs = getAllEsSalaryContentSlugs()
  const calcSlugSet = new Set(calcSlugs.map((s) => s.slug))
  const newContentSlugs = contentSlugs.filter((s) => !calcSlugSet.has(s.slug))
  return [...calcSlugs, ...newContentSlugs]
}

export async function generateMetadata({ params }) {
  const { slug: slugParam } = await params
  const match = slugMap[slugParam]
  if (!match) {
    const post = getEsSalaryContent(slugParam)
    if (!post) return {}
    return {
      title: `${post.title} — CompVerdict`,
      description: post.description,
      alternates: {
        canonical: `${SITE_URL}/es/salarios/${slugParam}/`,
        languages: { 'es': `${SITE_URL}/es/salarios/${slugParam}/`, 'x-default': `${SITE_URL}/es/salarios/${slugParam}/` },
      },
      openGraph: { title: post.title, description: post.description, type: 'article', publishedTime: post.date },
    }
  }
  const props = buildSalaryPageProps(locale, match.role, match.city)
  if (!props) return {}
  const languages = {}
  for (const h of props.hreflangs) languages[h.hreflang] = h.href
  return {
    title: props.title,
    description: props.description,
    alternates: { canonical: SITE_URL + props.canonPath, languages },
  }
}

export default async function EsSalaryPage({ params }) {
  const { slug: slugParam } = await params
  const match = slugMap[slugParam]

  // Content fallback: AI-generated Spanish salary guide
  if (!match) {
    const post = getEsSalaryContent(slugParam)
    if (!post) notFound()

    const articleSchema = {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: post.title, description: post.description,
      datePublished: post.date, dateModified: post.date,
      inLanguage: 'es',
      url: `${SITE_URL}/es/salarios/${slugParam}/`,
      author: { '@type': 'Organization', name: 'CompVerdict', url: SITE_URL },
      publisher: { '@type': 'Organization', name: 'CompVerdict', url: SITE_URL },
    }

    return (
      <>
        <Navigation />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 16px 80px' }}>
          <nav style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '32px', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Link href="/es" style={{ color: 'inherit', textDecoration: 'none' }}>Inicio</Link>
            <span>/</span>
            <Link href="/es/salarios" style={{ color: 'inherit', textDecoration: 'none' }}>Sueldos</Link>
            <span>/</span>
            <span style={{ color: '#6b7280' }}>{post.title}</span>
          </nav>
          <header style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '12px' }}>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
              {' · '}{post.readTime}
            </div>
            <h1 style={{ fontSize: 'clamp(24px,5vw,34px)', fontWeight: 800, color: '#111827', lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 14px' }}>
              {post.title}
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{post.description}</p>
          </header>
          <div dangerouslySetInnerHTML={{ __html: post.content }} style={{ color: '#374151', lineHeight: 1.75, fontSize: '16px' }} />
          <div style={{ margin: '48px 0', padding: '28px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '17px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>¿La oferta que tienes es justa?</p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 18px', lineHeight: 1.6 }}>Introduce el puesto, ciudad y sueldo. Veredicto en 30 segundos.</p>
            <Link href="/es" style={{ display: 'inline-block', background: '#f97316', color: '#fff', fontWeight: 700, fontSize: '15px', padding: '12px 28px', borderRadius: '12px', textDecoration: 'none' }}>
              Comprobar mi oferta →
            </Link>
          </div>
        </div>
        <Footer locale="es" />
      </>
    )
  }

  const props = buildSalaryPageProps(locale, match.role, match.city)
  if (!props) notFound()

  return (
    <>
      <Navigation />
      <PageTracker event="salary_page_view" role={match.role} city={match.city} locale="es" />
      <SalaryPageContent
        locale={locale} role={match.role} city={match.city}
        bands={props.bands} symbol={props.symbol} faqs={props.faqs}
        hreflangs={props.hreflangs} salaryHubPath={props.salaryHubPath}
        homePath={props.homePath} negPath={props.negPath}
        relatedCities={props.relatedCities} relatedRoles={props.relatedRoles}
        jsonLd={props.jsonLd} getSalaryPathFn={getSalaryPath} getNegPathFn={getNegPath}
      />
      <Footer locale="es" />
    </>
  )
}
