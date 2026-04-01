import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/blogPosts'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import PageTracker from '@/components/PageTracker'

export const metadata = {
  title: 'Blog — CompVerdict',
  description: 'Practical guides on evaluating job offers, salary negotiation, and compensation. Data-backed advice with no fluff.',
  alternates: { canonical: 'https://www.compverdict.com/blog/' },
}

export default function BlogPage() {
  const posts = getAllBlogPosts()

  return (
    <>
      <PageTracker event="page_view" locale="en" />
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Blog</h1>
          <p className="text-gray-500 text-lg">Practical advice on job offers, salary negotiation, and compensation. No fluff.</p>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-400 text-sm">No posts yet — check back soon.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}/`}
                className="group block p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">{post.title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed">{post.description}</p>
                <span className="inline-block mt-3 text-sm font-semibold text-blue-600 group-hover:underline">Read more →</span>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-14 bg-blue-50 rounded-2xl p-8 text-center space-y-4 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-900">Is this offer worth taking?</h2>
          <p className="text-gray-500 text-sm">Enter your package and get an instant, data-backed verdict in 30 seconds.</p>
          <Link
            href="/#offer-tool"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Check this offer →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
