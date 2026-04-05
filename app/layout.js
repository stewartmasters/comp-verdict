import { Inter } from 'next/font/google'
import './globals.css'
import GoogleAnalytics from '../components/GoogleAnalytics.jsx'
import ConsentManager from '../components/ConsentManager.jsx'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.compverdict.com'

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'CompVerdict — Is This Job Offer Actually Good?',
    template: '%s — CompVerdict',
  },
  description:
    'Find out if your job offer is fair, weak, or strong. Compare to market data and see exactly what to negotiate. Free, no signup.',
  keywords: [
    'is this offer good',
    'job offer calculator',
    'salary offer comparison',
    'should i negotiate',
    'offer benchmark',
    'comp verdict',
    'salary negotiation',
    'offer evaluation',
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    siteName: 'CompVerdict',
    title: 'CompVerdict — Is This Job Offer Actually Good?',
    description:
      'Find out if your job offer is fair, weak, or strong. Compare to market data and see exactly what to negotiate.',
    url: BASE_URL,
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'CompVerdict — Is this offer worth taking?' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CompVerdict — Is This Job Offer Actually Good?',
    description: 'Check your offer against market data in 30 seconds. Free, no signup.',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }) {
  const siteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CompVerdict',
    url: BASE_URL,
    description: 'Free job offer evaluator. Find out instantly if your offer is fair, weak, or strong.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/salary/{search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="bg-[#F8FAFC] text-gray-900 min-h-screen font-sans">
        <GoogleAnalytics />
        <ConsentManager />
        {children}
      </body>
    </html>
  )
}
