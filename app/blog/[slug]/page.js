import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/blogPosts'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  const blogDir = path.join(process.cwd(), 'content', 'blog')
  if (!fs.existsSync(blogDir)) return []
  return fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({ slug: f.replace('.md', '') }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) return {}

  return {
    title: `${post.title} — CompVerdict`,
    description: post.description,
    alternates: { canonical: `https://www.compverdict.com/blog/${post.slug}/` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `https://www.compverdict.com/blog/${post.slug}/`,
      siteName: 'CompVerdict',
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) notFound()

  const allPosts = getAllBlogPosts()
  const morePosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3)

  const formattedDate = new Date(post.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      author: { '@type': 'Organization', name: 'CompVerdict', url: 'https://www.compverdict.com' },
      publisher: {
        '@type': 'Organization',
        name: 'CompVerdict',
        logo: { '@type': 'ImageObject', url: 'https://www.compverdict.com/favicon.svg' },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.compverdict.com/blog/${post.slug}/` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.compverdict.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.compverdict.com/blog/' },
        { '@type': 'ListItem', position: 3, name: post.title, item: `https://www.compverdict.com/blog/${post.slug}/` },
      ],
    },
  ]

  return (
    <>
      <Navigation />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog/" className="hover:text-blue-600 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-gray-600 truncate">{post.title}</span>
        </nav>

        {/* Post header */}
        <header className="mb-10 space-y-4">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <time dateTime={post.date}>{formattedDate}</time>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">{post.title}</h1>
          <p className="text-lg text-gray-500">{post.description}</p>
        </header>

        {/* Article body */}
        <article
          className="prose prose-gray prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-ul:space-y-1"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div className="mt-12 bg-blue-50 rounded-2xl p-8 text-center space-y-3 border border-blue-100">
          <h2 className="text-lg font-bold text-gray-900">Is your offer worth taking?</h2>
          <p className="text-sm text-gray-500">Enter your package and get an instant, data-backed verdict in 30 seconds. Free, no sign-up.</p>
          <Link
            href="/#offer-tool"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Check this offer →
          </Link>
        </div>

        {/* More articles */}
        {morePosts.length > 0 && (
          <div className="mt-14 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">More from the blog</h2>
            <div className="space-y-3">
              {morePosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}/`}
                  className="group flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-all"
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{p.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{p.readTime}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
