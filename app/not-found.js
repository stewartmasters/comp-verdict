import Link from 'next/link'
import Navigation from '../components/Navigation.jsx'
import Footer from '../components/Footer.jsx'

export const metadata = {
  title: 'Page Not Found — CompVerdict',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <>
      <Navigation />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center space-y-6">
        <div className="text-6xl font-black text-blue-100">404</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          This page doesn&apos;t exist
        </h1>
        <p className="text-gray-500 leading-relaxed">
          The offer benchmark or page you&apos;re looking for couldn&apos;t be found.
          Try browsing by role or city, or check your offer directly.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/#offer-tool"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            Check an offer &rarr;
          </Link>
          <Link
            href="/salary/"
            className="border border-gray-200 hover:border-blue-200 hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-semibold px-6 py-3 rounded-xl text-sm transition-all"
          >
            Browse offer guides
          </Link>
        </div>
      </div>

      <Footer locale="en" />
    </>
  )
}
