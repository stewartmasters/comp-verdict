'use client'

export default function ScrollToTopButton() {
  return (
    <button
      onClick={() => {
        const el = document.getElementById('offer-tool')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        else window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-colors mt-2"
    >
      Check this offer →
    </button>
  )
}
