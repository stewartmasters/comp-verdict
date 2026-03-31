import Link from 'next/link'
import Image from 'next/image'

const LOGO_SOURCES = [
  { src: '/logos/ons.png',      alt: 'ONS — UK Office for National Statistics'          },
  { src: '/logos/bls.png',      alt: 'BLS — US Bureau of Labor Statistics'              },
  { src: '/logos/ine.png',      alt: 'INE — Spain Instituto Nacional de Estadística'    },
  { src: '/logos/destatis.png', alt: 'Destatis — German Federal Statistical Office'     },
  { src: '/logos/eurostat.png', alt: 'Eurostat — European Statistics'                   },
  { src: '/logos/insee.svg',    alt: 'INSEE — French National Statistics Institute'     },
  { src: '/logos/cbs.png',      alt: 'CBS — Statistics Netherlands'                     },
  { src: '/logos/statscan.png', alt: 'Statistics Canada'                                },
  { src: '/logos/abs.png',      alt: 'ABS — Australian Bureau of Statistics'            },
  { src: '/logos/oecd.png',     alt: 'OECD — Organisation for Economic Co-operation'   },
]

const TEXT_SOURCES = [
  { abbr: 'ONS',               full: 'UK Annual Survey of Hours and Earnings (ASHE 2025)'  },
  { abbr: 'BLS',               full: 'US Bureau of Labor Statistics (OEWS 2025)'           },
  { abbr: 'INE',               full: 'Spanish earnings structure survey (EES 2024)'        },
  { abbr: 'Destatis',          full: 'German earnings structure survey (2024)'             },
  { abbr: 'Eurostat',          full: 'European earnings statistics (SES 2022)'             },
  { abbr: 'INSEE',             full: 'French national income statistics (2024)'            },
  { abbr: 'CBS',               full: 'Netherlands labour accounts (2024)'                  },
  { abbr: 'Statistics Canada', full: 'Labour Force Survey (2024)'                          },
  { abbr: 'ABS',               full: 'Australian Bureau of Statistics (2024)'              },
  { abbr: 'OECD',              full: 'International income distribution data (2024)'       },
]

/**
 * TrustSection
 * variant="full"    — heading + text source list + methodology link
 * variant="minimal" — logo row matching SalaryVerdict hero style
 */
export default function TrustSection({ variant = 'full' }) {
  if (variant === 'minimal') {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {LOGO_SOURCES.slice(0, 8).map((s) => (
          <div key={s.src} className="h-[33px] w-[88px] flex items-center justify-center flex-shrink-0">
            <Image
              src={s.src}
              alt={s.alt}
              width={88}
              height={33}
              className="object-contain opacity-50 grayscale hover:opacity-70 transition-opacity w-full h-full"
              style={{ mixBlendMode: 'multiply' }}
              unoptimized
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 border-t border-gray-100">
      <div className="grid sm:grid-cols-2 gap-10 items-start">

        {/* Left — heading + description */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Built on official data</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">Updated Q1 2026</span>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">10 official sources</span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            Every benchmark comes from national statistics agencies — not crowdsourcing, not estimates. Primary government wage surveys only.
          </p>
          <Link href="/methodology/" className="text-sm font-semibold text-blue-600 hover:underline">
            See methodology →
          </Link>
        </div>

        {/* Right — bordered source list */}
        <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
          {TEXT_SOURCES.map((s) => (
            <div key={s.abbr} className="flex items-start gap-4 px-4 py-3 bg-white hover:bg-gray-50 transition-colors">
              <span className="text-sm font-bold text-blue-600 w-24 flex-shrink-0">{s.abbr}</span>
              <span className="text-sm text-gray-400 leading-relaxed">{s.full}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
