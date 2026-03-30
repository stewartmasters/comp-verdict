export const dynamic = 'force-static'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.compverdict.com'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/.netlify/', '/_next/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
