'use client'

import { useEffect, useState } from 'react'

/**
 * ConsentManager — global consent banner + consent restoration.
 *
 * Runs on every page via layout.js. Handles two cases:
 *  1. Returning user (cv_consent = '1'): immediately grants analytics_storage
 *     so their visit is tracked on salary, negotiate, and blog pages.
 *  2. New user (no stored choice): shows the cookie banner inline so consent
 *     can be collected on any page, not just the home page.
 *
 * VerdictTool no longer manages the cookie banner — this component owns it.
 */
export default function ConsentManager() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('cv_consent')
    if (stored === '1') {
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', { analytics_storage: 'granted' })
      }
    } else if (stored === null) {
      setShow(true)
    }
  }, [])

  function accept() {
    localStorage.setItem('cv_consent', '1')
    setShow(false)
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: 'granted' })
    }
  }

  function decline() {
    localStorage.setItem('cv_consent', '0')
    setShow(false)
  }

  if (!show) return null

  return (
    <div id="cookie-banner">
      <p style={{ margin: 0, lineHeight: 1.5 }}>
        We use analytics cookies to understand how CompVerdict is used.{' '}
        <a href="/privacy/">Privacy Policy</a>
      </p>
      <div className="cookie-btns">
        <button className="cookie-btn-decline" onClick={decline}>Decline</button>
        <button className="cookie-btn-accept" onClick={accept}>Accept</button>
      </div>
    </div>
  )
}
