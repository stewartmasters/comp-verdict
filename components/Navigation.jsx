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
  const router = useRouter()

  const locale = pathname?.startsWith('/de') ? 'de' : pathname?.startsWith('/es') ? 'es' : 'en'
  const cfg = NAV_CONFIG[locale]

  function handleLangChange(e) {
    const target = e.target.value
    if (target === locale) return
    router.push(LANG_SWITCH[locale]?.[target] ?? '/')
  }

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
          <select
            value={locale}
            onChange={handleLangChange}
            className="ml-1 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg px-2 py-1 cursor-pointer hover:border-gray-300 focus:outline-none focus:border-gray-400 appearance-none pr-6"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center' }}
            aria-label="Select language"
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="de">DE</option>
          </select>

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
