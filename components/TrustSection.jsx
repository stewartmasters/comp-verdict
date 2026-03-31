import Image from 'next/image'
import Link from 'next/link'

/**
 * TrustSection — adapted from SalaryVerdict's TrustSection for offer benchmarks.
 * variant="full"    — shows copy, sources, update date, methodology link (default)
 * variant="minimal" — shows logo strip only
 */

const LOGO_SOURCES = [
  { src: '/logos/bls.png',      alt: 'BLS OEWS',          w: 76 },
  { src: '/logos/ons.png',      alt: 'ONS ASHE',           w: 76 },
  { src: '/logos/ine.png',      alt: 'INE EES',            w: 76 },
  { src: '/logos/destatis.png', alt: 'Destatis VSE',       w: 76 },
  { src: '/logos/insee.svg',    alt: 'INSEE',              w: 76 },
  { src: '/logos/cbs.png',      alt: 'CBS',                w: 76 },
  { src: '/logos/statscan.png', alt: 'Statistics Canada',  w: 76 },
  { src: '/logos/abs.webp',     alt: 'ABS',                w: 76 },
  { src: '/logos/oecd.png',     alt: 'OECD IDD',           w: 76 },
]

export default function TrustSection({ variant = 'full' }) {
  const MONTH_YEAR = new Date().toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })

  if (variant === 'minimal') {
    return (
      <div className="flex flex-wrap items-center gap-3">
        {LOGO_SOURCES.map(({ src, alt, w }) => (
          <Image
            key={alt}
            src={src}
            alt={alt}
            width={w}
            height={28}
            className="h-[28px] w-auto opacity-40 grayscale object-contain"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <p className="text-xs font-medium text-gray-500 mb-3">
        Built using public compensation benchmarks and government wage data
      </p>
      <div className="flex flex-wrap items-center gap-3 mb-2">
        {LOGO_SOURCES.map(({ src, alt, w }) => (
          <Image
            key={alt}
            src={src}
            alt={alt}
            width={w}
            height={28}
            className="h-[28px] w-auto opacity-40 grayscale object-contain"
          />
        ))}
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
