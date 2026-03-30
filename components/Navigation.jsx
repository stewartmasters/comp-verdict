'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link href="/" className="font-extrabold text-gray-900 text-lg tracking-tight flex-shrink-0">
          Comp<span className="text-blue-600">Verdict</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2 text-sm">
          <Link
            href="/salary/"
            className={`transition-colors hidden sm:block px-3 py-1.5 rounded-lg ${
              pathname?.startsWith('/salary') ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Offer guides
          </Link>
          <Link
            href="/negotiate/"
            className={`transition-colors hidden sm:block px-3 py-1.5 rounded-lg ${
              pathname?.startsWith('/negotiate') ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Negotiate
          </Link>
          <Link
            href="/methodology/"
            className={`transition-colors hidden md:block px-3 py-1.5 rounded-lg ${
              pathname === '/methodology/' ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Methodology
          </Link>
          <Link
            href="/#offer-tool"
            className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors flex-shrink-0 ml-2"
          >
            Check this offer
          </Link>
        </div>
      </div>
    </nav>
  )
}
