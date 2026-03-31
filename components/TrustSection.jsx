import Link from 'next/link'

/**
 * TrustSection — adapted from SalaryVerdict's TrustSection for offer benchmarks.
 * variant="full"    — shows copy, sources, update date, methodology link (default)
 * variant="minimal" — shows source tags only
 */
export default function TrustSection({ variant = 'full' }) {
  const MONTH_YEAR = new Date().toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })

  const SOURCES = ['BLS OEWS', 'ONS ASHE', 'INE EES', 'Destatis VSE', 'Stack Overflow Survey']

  if (variant === 'minimal') {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {SOURCES.map((src) => (
          <span
            key={src}
            className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium"
          >
            {src}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <p className="text-xs font-medium text-gray-500 mb-3">
        Built using public compensation benchmarks and government wage data
      </p>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {SOURCES.map((src) => (
          <span
            key={src}
            className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium"
          >
            {src}
          </span>
        ))}
        <span className="text-xs text-gray-400 font-medium">+ ECB exchange rates</span>
      </div>
      <p className="text-xs text-gray-400 mb-2.5">Coverage varies by role and location.</p>
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-300">
          Updated {MONTH_YEAR} · Based on public benchmarks &amp; structured modelling
        </p>
        <Link
          href="/methodology/"
          className="text-xs text-blue-600 hover:underline font-medium whitespace-nowrap ml-3"
        >
          How we calculate →
        </Link>
      </div>
    </div>
  )
}
