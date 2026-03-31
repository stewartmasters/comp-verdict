import Script from 'next/script'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-PCW5JTQ8HY'

/**
 * GoogleAnalytics — matches salaryverdict.com implementation exactly.
 *
 * Consent mode v2:
 *  - analytics_storage and ad_storage default to 'denied'
 *  - wait_for_update: 500ms gives VerdictTool's cookie banner time to update
 *  - send_page_view: false — we fire page views manually via PageTracker
 *    and the VerdictTool so we can attach role/city dimensions
 *
 * Usage: place once in app/layout.js
 */
export default function GoogleAnalytics() {
  if (!GA_ID) return null
  return (
    <>
      {/* Step 1: consent defaults + dataLayer init — must run before gtag.js loads */}
      <Script id="ga-consent-init" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            wait_for_update: 500
          });
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>

      {/* Step 2: load the gtag library */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
    </>
  )
}
