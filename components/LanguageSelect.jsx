'use client'

import { useRouter, usePathname } from 'next/navigation'

export default function LanguageSelect() {
  const router = useRouter()
  const pathname = usePathname()

  const current = pathname?.startsWith('/es') ? 'es'
                : pathname?.startsWith('/de') ? 'de'
                : 'en'

  function handleChange(e) {
    const lang = e.target.value
    if (lang === 'es') router.push('/es/')
    else if (lang === 'de') router.push('/de/')
    else router.push('/')
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      className="text-xs border border-gray-200 text-gray-600 px-2 py-1 rounded-full bg-white cursor-pointer hover:border-blue-300 hover:text-blue-600 transition-colors"
      aria-label="Select language"
    >
      <option value="en">EN</option>
      <option value="es">ES</option>
      <option value="de">DE</option>
    </select>
  )
}
