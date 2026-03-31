'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV_CONFIG = {
  en: {
    salaryPath: '/salary/',
    negPath: '/negotiate/',
    methodPath: '/methodology/',
    homePath: '/',
    salaryLabel: 'Offer guides',
    negLabel: 'Negotiate',
    methodLabel: 'Methodology',
    ctaLabel: 'Check this offer',
  },
  es: {
    salaryPath: '/es/salarios/',
    negPath: '/es/negociacion/',
    methodPath: '/methodology/',
    homePath: '/es/',
    salaryLabel: 'Guías de oferta',
    negLabel: 'Negociar',
    methodLabel: 'Metodología',
    ctaLabel: 'Analizar mi oferta',
  },
  de: {
    salaryPath: '/de/gehalt/',
    negPath: '/de/verhandlung/',
    methodPath: '/methodology/',
    homePath: '/de/',
    salaryLabel: 'Gehaltsführer',
    negLabel: 'Verhandeln',
    methodLabel: 'Methodik',
    ctaLabel: 'Angebot prüfen',
  },
}

// Map current locale home path to target locale home path
const LANG_SWITCH = {
  en: { es: '/es/', de: '/de/' },
  es: { en: '/',   de: '/de/' },
  de: { en: '/',   es: '/es/' },
}

export default function Navigation() {
  const pathname = usePathname()

  const locale = pathname?.startsWith('/de') ? 'de' : pathname?.startsWith('/es') ? 'es' : 'en'
  const cfg = NAV_CONFIG[locale]

  return (
    <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link href={cfg.homePath} className="font-extrabold text-gray-900 text-lg tracking-tight flex-shrink-0">
          Comp<span className="text-blue-600">Verdict</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2 text-sm">
          <Link
            href={cfg.salaryPath}
            className={`transition-colors hidden sm:block px-3 py-1.5 rounded-lg ${
              pathname?.includes('/salary') || pathname?.includes('/salarios') || pathname?.includes('/gehalt')
                ? 'text-gray-900 font-medium'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {cfg.salaryLabel}
          </Link>
          <Link
            href={cfg.negPath}
            className={`transition-colors hidden sm:block px-3 py-1.5 rounded-lg ${
              pathname?.includes('/negotiate') || pathname?.includes('/negociacion') || pathname?.includes('/verhandlung')
                ? 'text-gray-900 font-medium'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {cfg.negLabel}
          </Link>
          <Link
            href={cfg.methodPath}
            className={`transition-colors hidden md:block px-3 py-1.5 rounded-lg ${
              pathname === '/methodology/'
                ? 'text-gray-900 font-medium'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {cfg.methodLabel}
          </Link>

          {/* Language switcher */}
          <div className="flex items-center gap-0.5 ml-1 border border-gray-200 rounded-lg overflow-hidden text-xs">
            {['en', 'es', 'de'].map((lang) => (
              <Link
                key={lang}
                href={lang === locale ? '#' : (LANG_SWITCH[locale]?.[lang] ?? '/')}
                className={`px-2 py-1 font-medium transition-colors ${
                  lang === locale
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={lang === locale ? (e) => e.preventDefault() : undefined}
              >
                {lang.toUpperCase()}
              </Link>
            ))}
          </div>

          <Link
            href={cfg.homePath + '#offer-tool'}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors flex-shrink-0 ml-1"
          >
            {cfg.ctaLabel}
          </Link>
        </div>
      </div>
    </nav>
  )
}
