'use client'

import { useState, useEffect } from 'react'
import { Phone, ArrowUp } from 'lucide-react'
import { CONTACT } from '@/lib/constants'
import { cn } from '@/lib/utils'

// 4 nút nổi góc phải: Gọi điện | Zalo | Facebook | Scroll-to-top
export function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handler = () => setShowScrollTop(window.scrollY > 300)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    // Safe area: mb-safe cho iPhone có home indicator
    <div className="fixed right-4 bottom-6 z-50 flex flex-col items-center gap-3" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* Scroll to top — chỉ hiện sau 300px scroll */}
      <button
        onClick={scrollToTop}
        aria-label="Lên đầu trang"
        className={cn(
          'w-10 h-10 rounded-full bg-stone-700 text-white flex items-center justify-center shadow-float transition-all duration-300 hover:bg-stone-600',
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        <ArrowUp size={18} />
      </button>

      {/* Facebook */}
      <a
        href={CONTACT.facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-float hover:scale-105 transition-transform duration-200"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </a>

      {/* Zalo */}
      <a
        href={CONTACT.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Zalo tư vấn"
        className="w-12 h-12 rounded-full bg-[#0068FF] text-white flex items-center justify-center shadow-float hover:scale-105 transition-transform duration-200 animate-pulse-soft"
      >
        <span className="text-xs font-bold">Zalo</span>
      </a>

      {/* Gọi điện */}
      <a
        href={`tel:${CONTACT.hotlineRaw}`}
        aria-label={`Gọi ${CONTACT.hotline}`}
        className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center shadow-cta hover:scale-105 transition-transform duration-200 animate-pulse-soft"
      >
        <Phone size={20} />
      </a>
    </div>
  )
}
