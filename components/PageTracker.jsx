'use client'

import { useEffect } from 'react'

/**
 * PageTracker — fires a custom GA4 event on mount for SE/Geo attribution.
 *
 * Add to every salary/[slug] and negotiate/[slug] page (all locales) so
 * GA4 builds a dimension table of which role+city combinations drive traffic.
 * This powers both organic SEO reporting and ad targeting decisions.
 *
 * Custom events fired:
 *   salary_page_view  { role, city, locale }
 *   negotiate_page_view { role, city, locale }
 *
 * Register 'role', 'city', 'locale' as custom dimensions in GA4 Admin →
 * Custom definitions → Create custom dimension (event-scoped) to see them
 * in Explore reports.
 */
export default function PageTracker({ event, role, city, locale = 'en' }) {
  useEffect(() => {
    function fire() {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', event, { role, city, locale })
        window.gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
          role,
          city,
          locale,
        })
      }
    }
    // Fire immediately if gtag is ready, else wait for it to load
    fire()
    const t = setTimeout(fire, 1500)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
