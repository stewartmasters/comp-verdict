export const metadata = {
  title: 'Privacy Policy — CompVerdict',
  description: 'CompVerdict privacy policy. How we collect and use data, your rights, and cookie information.',
  robots: { index: false },
  alternates: {
    canonical: 'https://comp-verdict.netlify.app/privacy/',
  },
}

export default function PrivacyPage() {
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: '#F8FAFC', color: '#0F172A', lineHeight: 1.7, fontSize: '16px', minHeight: '100vh' }}>
      <header style={{ borderBottom: '1px solid #e5e7eb', padding: '16px 0' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700 }}>
            <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              Comp<span style={{ color: '#2563eb' }}>Verdict</span>
            </a>
          </div>
        </div>
      </header>

      <main style={{ padding: '56px 0 80px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>Privacy Policy</h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '40px' }}>Last updated: March 2025</p>

          <p style={{ marginBottom: '14px', color: '#374151' }}>CompVerdict (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates the website at <strong>comp-verdict.netlify.app</strong>. This page describes how we handle your information when you use our service.</p>

          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '36px 0 12px', letterSpacing: '-0.01em' }}>Information We Collect</h2>
          <p style={{ marginBottom: '14px', color: '#374151' }}>CompVerdict is a free tool that runs entirely in your browser. We do not require registration, accounts, or login. The salary data you enter is processed locally in your browser and is not transmitted to or stored on our servers.</p>
          <p style={{ marginBottom: '14px', color: '#374151' }}>With your consent, we collect anonymous usage analytics via Google Analytics 4 (GA4), including:</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '14px', color: '#374151' }}>
            <li style={{ marginBottom: '6px' }}>Pages visited and time spent on each page</li>
            <li style={{ marginBottom: '6px' }}>General geographic region (country level)</li>
            <li style={{ marginBottom: '6px' }}>Device type and browser information</li>
            <li style={{ marginBottom: '6px' }}>Events such as &ldquo;verdict run&rdquo;, &ldquo;share result&rdquo;, and &ldquo;copy script&rdquo; (no personal data attached)</li>
          </ul>

          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '36px 0 12px', letterSpacing: '-0.01em' }}>Cookies</h2>
          <p style={{ marginBottom: '14px', color: '#374151' }}>We use a single first-party cookie (<code>cv_consent</code>) to remember your cookie consent preference. If you accept analytics, Google Analytics sets additional cookies to measure usage. You can withdraw consent at any time by clearing your browser&apos;s local storage for this site.</p>
          <p style={{ marginBottom: '14px', color: '#374151' }}>We do not use cookies for advertising, targeting, or tracking across other websites.</p>

          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '36px 0 12px', letterSpacing: '-0.01em' }}>Third-Party Services</h2>
          <p style={{ marginBottom: '14px', color: '#374151' }}><strong>Google Analytics 4</strong> — only loaded if you consent. Analytics data is processed by Google and subject to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" style={{ color: '#2563eb' }}>Google&apos;s Privacy Policy</a>. We use IP anonymisation.</p>
          <p style={{ marginBottom: '14px', color: '#374151' }}><strong>Google Fonts</strong> — font files are loaded from Google&apos;s CDN, which may log your IP address. See <a href="https://developers.google.com/fonts/faq/privacy" target="_blank" rel="noopener" style={{ color: '#2563eb' }}>Google Fonts privacy FAQ</a>.</p>
          <p style={{ marginBottom: '14px', color: '#374151' }}><strong>Netlify</strong> — our hosting provider. Netlify may log standard server access data (IP address, request time). See <a href="https://www.netlify.com/privacy/" target="_blank" rel="noopener" style={{ color: '#2563eb' }}>Netlify&apos;s Privacy Policy</a>.</p>

          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '36px 0 12px', letterSpacing: '-0.01em' }}>Data Retention</h2>
          <p style={{ marginBottom: '14px', color: '#374151' }}>Analytics data is retained for 14 months in Google Analytics, after which it is automatically deleted. We do not retain any other personal data.</p>

          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '36px 0 12px', letterSpacing: '-0.01em' }}>Your Rights</h2>
          <p style={{ marginBottom: '14px', color: '#374151' }}>If you are located in the European Union or the United Kingdom, you have the right to access, correct, or delete any personal data we hold about you, and to object to or restrict processing. Since we collect minimal data and nothing personally identifiable, there is generally nothing to request. If you have concerns, contact us at the address below.</p>

          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '36px 0 12px', letterSpacing: '-0.01em' }}>Children&apos;s Privacy</h2>
          <p style={{ marginBottom: '14px', color: '#374151' }}>CompVerdict is not directed at children under 16. We do not knowingly collect data from children.</p>

          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '36px 0 12px', letterSpacing: '-0.01em' }}>Changes to This Policy</h2>
          <p style={{ marginBottom: '14px', color: '#374151' }}>We may update this policy occasionally. Changes will be reflected by the &ldquo;Last updated&rdquo; date above. Continued use of the service after changes constitutes acceptance of the updated policy.</p>

          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '36px 0 12px', letterSpacing: '-0.01em' }}>Contact</h2>
          <p style={{ marginBottom: '14px', color: '#374151' }}>For privacy questions or requests, contact us via the Verdict network sites. This is a free side project — we will respond when we can.</p>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid #e5e7eb', padding: '28px 0' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href="/" style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}>CompVerdict</a>
            <a href="https://www.salaryverdict.com" target="_blank" rel="noopener" style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}>SalaryVerdict</a>
            <a href="https://www.spendverdict.com" target="_blank" rel="noopener" style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}>SpendVerdict</a>
            <a href="/privacy/" style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}>Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
