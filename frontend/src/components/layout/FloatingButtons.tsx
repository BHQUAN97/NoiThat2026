'use client'

import { useState, useEffect } from 'react'
import { Phone, ArrowUp, MessageCircle, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { CONTACT } from '@/lib/constants'
import { cn } from '@/lib/utils'

function ZaloIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M16 3C8.82 3 3 8.42 3 15c0 3.45 1.52 6.56 3.97 8.76L6 29l5.24-2.26c1.47.4 3.03.62 4.76.62 7.18 0 13-5.42 13-12S23.18 3 16 3zm6.43 16.5c-.25.7-1.5 1.3-2.07 1.38-.53.08-1.2.11-1.93-.12-.45-.14-1.02-.33-1.76-.65-3.07-1.32-5.08-4.4-5.24-4.6-.15-.2-1.24-1.64-1.24-3.13s.79-2.22 1.07-2.52c.28-.3.6-.37.8-.37.2 0 .4.01.58.02.18.01.43-.07.67.51.25.6.85 2.07.92 2.22.08.15.13.33.03.53-.1.2-.15.32-.3.5-.15.17-.32.38-.45.51-.15.15-.3.31-.13.61.18.3.78 1.28 1.67 2.07 1.15 1.02 2.12 1.34 2.42 1.49.3.15.47.12.65-.07.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.73.82 2.03.97.3.15.5.22.57.34.07.13.07.75-.18 1.45z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

const WIDGETS = [
  {
    key: 'phone',
    href: `tel:${CONTACT.hotlineRaw}`,
    label: 'Gọi Ngay',
    Icon: Phone,
    bg: 'bg-brand hover:bg-primary-dark',
  },
  {
    key: 'zalo',
    href: CONTACT.zaloUrl,
    label: 'Chat Zalo',
    Icon: ZaloIcon,
    bg: 'bg-[#0068FF] hover:bg-blue-700',
    external: true,
  },
  {
    key: 'facebook',
    href: CONTACT.facebookUrl,
    label: 'Facebook',
    Icon: FacebookIcon,
    bg: 'bg-[#1877F2] hover:bg-blue-800',
    external: true,
  },
]

export function FloatingButtons() {
  const pathname = usePathname()
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => {
    const handler = () => setShowScrollTop(window.scrollY > 300)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Đóng khi chuyển trang
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  if (pathname.startsWith('/admin')) return null

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[44] md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Desktop: 3 nút + tooltip label ── */}
      <div className="fixed right-4 bottom-8 z-50 hidden md:flex flex-col items-end gap-3">
        {/* Scroll to top */}
        <button
          onClick={scrollToTop}
          aria-label="Lên đầu trang"
          className={cn(
            'w-10 h-10 rounded-full bg-stone-700 text-white flex items-center justify-center shadow-float transition-all duration-300 hover:bg-stone-600 hover:scale-110',
            showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          )}
        >
          <ArrowUp size={18} />
        </button>

        {WIDGETS.map(({ key, href, label, Icon, bg, external }) => (
          <div key={key} className="flex items-center justify-end gap-2">
            {/* Tooltip */}
            <span className={cn(
              'whitespace-nowrap rounded-lg bg-stone-800 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all duration-200',
              hovered === key ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
            )}>
              {label}
            </span>
            <a
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              aria-label={label}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                'w-12 h-12 rounded-full text-white flex items-center justify-center shadow-float transition-all duration-200 hover:scale-110',
                bg
              )}
            >
              <Icon className="w-5 h-5" />
            </a>
          </div>
        ))}
      </div>

      {/* ── Mobile: FAB phía trên BottomNav ── */}
      <div
        className="fixed right-4 z-[45] md:hidden"
        style={{ bottom: 'calc(3.5rem + env(safe-area-inset-bottom) + 1rem)' }}
      >
        {/* Expanded widgets — xuất hiện trên FAB */}
        <div className={cn(
          'flex flex-col-reverse gap-2.5 mb-2.5 transition-all duration-300 origin-bottom',
          mobileOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-75 opacity-0 pointer-events-none'
        )}>
          {WIDGETS.map(({ key, href, label, Icon, bg, external }, i) => (
            <a
              key={key}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              aria-label={label}
              onClick={() => setMobileOpen(false)}
              style={{ transitionDelay: mobileOpen ? `${i * 40}ms` : '0ms' }}
              className={cn(
                'w-11 h-11 rounded-full text-white flex items-center justify-center shadow-float active:scale-90 transition-all duration-200',
                bg
              )}
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>

        {/* FAB toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Đóng liên hệ' : 'Liên hệ nhanh'}
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center shadow-cta transition-all duration-300 active:scale-90',
            mobileOpen ? 'bg-stone-700 text-white' : 'bg-brand text-white animate-pulse-soft'
          )}
        >
          <MessageCircle className={cn('h-5 w-5 absolute transition-all duration-300', mobileOpen ? 'opacity-0 scale-75 rotate-90' : 'opacity-100 scale-100 rotate-0')} />
          <X className={cn('h-5 w-5 absolute transition-all duration-300', mobileOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-90')} />
        </button>
      </div>

      {/* Scroll to top — mobile */}
      <button
        onClick={scrollToTop}
        aria-label="Lên đầu trang"
        style={{ bottom: 'calc(3.5rem + env(safe-area-inset-bottom) + 1rem)' }}
        className={cn(
          'fixed left-4 z-[45] w-10 h-10 rounded-full bg-stone-700 text-white flex items-center justify-center shadow-float transition-all duration-300 hover:bg-stone-600 md:hidden',
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        <ArrowUp size={18} />
      </button>
    </>
  )
}
