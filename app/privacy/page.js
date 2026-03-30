import Link from 'next/link'
import Navigation from '../../components/Navigation.jsx'
import Footer from '../../components/Footer.jsx'

export const metadata = {
  title: 'Privacy Policy — CompVerdict',
  description: 'CompVerdict privacy policy. How we collect and use data, your rights, and cookie information.',
  robots: { index: false },
  alternates: { canonical: '/privacy/' },
}

export default function PrivacyPage() {
  return (
    <>
      <Navigation />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <nav className="text-sm text-gray-400 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-600">Privacy Policy</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-400">Last updated: March 2025</p>
        </header>

        <div className="prose prose-gray prose-sm max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-a:text-blue-600 space-y-8">

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              CompVerdict is a free tool that runs entirely in your browser. We do not require registration, accounts, or login. The salary and offer data you enter is processed locally in your browser and is not transmitted to or stored on our servers.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">With your consent, we collect anonymous usage analytics via Google Analytics 4 (GA4), including:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Pages visited and time spent on each page</li>
              <li>General geographic region (country level)</li>
              <li>Device type and browser information</li>
              <li>Events such as &ldquo;verdict run&rdquo;, &ldquo;share result&rdquo;, and &ldquo;copy script&rdquo; (no personal data attached)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Cookies</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We use a single first-party cookie (<code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">cv_consent</code>) to remember your cookie consent preference. If you accept analytics, Google Analytics sets additional cookies to measure usage. You can withdraw consent at any time by clearing your browser&apos;s local storage for this site.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We do not use cookies for advertising, targeting, or tracking across other websites.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              <strong className="text-gray-800">Google Analytics 4</strong> — only loaded if you consent. Analytics data is processed by Google and subject to{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Google&apos;s Privacy Policy
              </a>.
              We use IP anonymisation.
            </p>
            <p className="text-gray-600 leading-relaxed mb-2">
              <strong className="text-gray-800">Netlify</strong> — our hosting provider. Netlify may log standard server access data (IP address, request time). See{' '}
              <a href="https://www.netlify.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Netlify&apos;s Privacy Policy
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              Analytics data is retained for 14 months in Google Analytics, after which it is automatically deleted. We do not retain any other personal data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Your Rights</h2>
            <p className="text-gray-600 leading-relaxed">
              If you are located in the European Union or the United Kingdom, you have the right to access, correct, or delete any personal data we hold about you. Since we collect minimal data and nothing personally identifiable, there is generally nothing to request. If you have concerns, contact us via the Verdict network sites.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Children&apos;s Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              CompVerdict is not directed at children under 16. We do not knowingly collect data from children.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this policy occasionally. Changes will be reflected by the &ldquo;Last updated&rdquo; date above. Continued use of the service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              For privacy questions or requests, contact us via the Verdict network sites. This is a free project — we will respond when we can.
            </p>
          </section>
        </div>
      </div>

      <Footer locale="en" />
    </>
  )
}
