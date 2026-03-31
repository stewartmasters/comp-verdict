import Link from 'next/link'

const SOURCES = [
  { abbr: 'ONS',             full: 'UK Annual Survey of Hours and Earnings (ASHE 2025)'       },
  { abbr: 'BLS',             full: 'US Bureau of Labor Statistics (OEWS 2025)'                },
  { abbr: 'INE',             full: 'Spanish earnings structure survey (EES 2024)'             },
  { abbr: 'Destatis',        full: 'German earnings structure survey (2024)'                  },
  { abbr: 'Eurostat',        full: 'European earnings statistics (SES 2022)'                  },
  { abbr: 'INSEE',           full: 'French national income statistics (2024)'                 },
  { abbr: 'CBS',             full: 'Netherlands labour accounts (2024)'                       },
  { abbr: 'Statistics Canada', full: 'Labour Force Survey (2024)'                             },
  { abbr: 'ABS',             full: 'Australian Bureau of Statistics (2024)'                   },
  { abbr: 'OECD',            full: 'International income distribution data (2024)'            },
]

/**
 * TrustSection
 * variant="full"    — heading + text source list + methodology link
 * variant="minimal" — compact text abbreviations row (hero inline)
 */
export default function TrustSection({ variant = 'full' }) {
  if (variant === 'minimal') {
    return (
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-400 font-medium">
        {SOURCES.slice(0, 5).map((s, i) => (
          <span key={s.abbr} className="flex items-center gap-2">
            {i > 0 && <span className="text-gray-300">·</span>}
            {s.abbr}
          </span>
        ))}
        <span className="text-gray-300">·</span>
        <span>+ 5 more</span>
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

      <div className="grid sm:grid-cols-2 gap-x-10 gap-y-2 mb-8 max-w-2xl mx-auto">
        {SOURCES.map((s) => (
          <div key={s.abbr} className="flex items-baseline gap-2 text-sm">
            <span className="font-semibold text-gray-900 flex-shrink-0">{s.abbr}</span>
            <span className="text-gray-400 text-xs leading-relaxed">{s.full}</span>
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
