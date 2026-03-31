import Link from 'next/link'
import Image from 'next/image'

const SOURCES = [
  { src: '/logos/ons.png',      alt: 'ONS — UK Office for National Statistics',           label: 'ONS ASHE 2025'         },
  { src: '/logos/bls.png',      alt: 'BLS — US Bureau of Labor Statistics',               label: 'BLS OEWS 2025'         },
  { src: '/logos/ine.png',      alt: 'INE — Spain Instituto Nacional de Estadística',     label: 'INE EES 2024'          },
  { src: '/logos/destatis.png', alt: 'Destatis — German Federal Statistical Office',      label: 'Destatis 2024'         },
  { src: '/logos/eurostat.png', alt: 'Eurostat — European Statistics',                    label: 'Eurostat SES 2022'     },
  { src: '/logos/insee.svg',    alt: 'INSEE — French National Statistics Institute',      label: 'INSEE 2024'            },
  { src: '/logos/cbs.png',      alt: 'CBS — Statistics Netherlands',                      label: 'CBS 2024'              },
  { src: '/logos/statscan.png', alt: 'Statistics Canada',                                 label: 'StatsCan CMHC 2024'   },
  { src: '/logos/abs.png',      alt: 'ABS — Australian Bureau of Statistics',             label: 'ABS 2024'              },
  { src: '/logos/oecd.png',     alt: 'OECD — Organisation for Economic Co-operation',     label: 'OECD IDD 2024'        },
]

/**
 * TrustSection
 * variant="full"    — heading + logo grid + date + methodology link (home page trust block)
 * variant="minimal" — compact logo row (hero inline)
 */
export default function TrustSection({ variant = 'full' }) {
  if (variant === 'minimal') {
    return (
      <div className="flex flex-wrap items-center gap-3">
        {SOURCES.slice(0, 5).map((s) => (
          <Image
            key={s.src}
            src={s.src}
            alt={s.alt}
            width={48}
            height={20}
            className="object-contain h-5 w-auto"
            style={{ opacity: 0.55, mixBlendMode: 'multiply', filter: 'grayscale(1)' }}
            unoptimized
          />
        ))}
        <span className="text-xs text-gray-400 font-medium">+ 5 more</span>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 border-t border-gray-100">
      <div className="text-center mb-8 space-y-2">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Built on official data</p>
        <p className="text-lg font-bold text-gray-900">Every benchmark comes from national statistics agencies</p>
        <p className="text-sm text-gray-500">Not crowdsourcing. Not estimates. Primary government wage surveys — updated Q1 2026.</p>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-5 gap-x-6 gap-y-6 items-center justify-items-center mb-8">
        {SOURCES.map((s) => (
          <div key={s.src} className="flex flex-col items-center gap-1.5 group">
            <Image
              src={s.src}
              alt={s.alt}
              width={72}
              height={28}
              className="object-contain h-[27px] w-auto transition-all duration-200"
              style={{ opacity: 0.55, mixBlendMode: 'multiply', filter: 'grayscale(1)' }}
              unoptimized
            />
            <span className="text-[10px] text-gray-400 font-medium text-center leading-tight">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
        <span>Updated Q1 2026</span>
        <span>·</span>
        <span>10 official sources</span>
        <span>·</span>
        <Link href="/methodology/" className="text-blue-600 hover:underline font-medium">
          Read methodology →
        </Link>
      </div>
    </div>
  )
}
