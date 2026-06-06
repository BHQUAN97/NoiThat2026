'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import { NAV_LINKS, CONTACT } from '@/lib/constants'
import { cn } from '@/lib/utils'

// Header chính — sticky, đổi màu nền khi scroll xuống
export function MainHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Đóng drawer khi chuyển trang
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          // Trên desktop TopBar chiếm 40px, header nằm ngay dưới
          'md:top-10',
          isScrolled
            ? 'bg-white shadow-header'
            : 'bg-white/95 backdrop-blur-sm'
        )}
      >
        <div className="max-w-content mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center">
              <span className="text-white font-serif font-bold text-lg leading-none">D</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-serif font-bold text-stone-900 text-base leading-tight">Nội Thất Duy Mạnh</div>
              <div className="text-[10px] text-muted leading-tight uppercase tracking-wider">Xưởng Tủ Bếp & Nội Thất</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 rounded text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'text-brand bg-brand/5'
                      : 'text-stone-700 hover:text-brand hover:bg-stone-50'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop CTA + Mobile hamburger */}
          <div className="flex items-center gap-2">
            {/* Hotline hiển thị trên tablet khi scroll (thay thế TopBar) */}
            <a
              href={`tel:${CONTACT.hotlineRaw}`}
              className={cn(
                'hidden md:flex lg:hidden items-center gap-1.5 text-sm font-semibold text-brand transition-opacity duration-300',
                isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
              )}
            >
              <Phone size={14} />
              {CONTACT.hotline}
            </a>

            {/* Secondary CTA: Zalo — desktop only */}
            <a
              href={`https://zalo.me/${CONTACT.hotlineRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-[#0068FF] text-white text-sm font-semibold rounded hover:bg-blue-700 transition-colors duration-200"
            >
              Zalo Tư Vấn
            </a>
            {/* Primary CTA: Báo Giá — md+ */}
            <Link
              href="/bao-gia"
              className="hidden md:flex items-center px-4 py-2 bg-brand text-white text-sm font-semibold rounded hover:bg-primary-dark transition-colors duration-200 shadow-cta"
            >
              Nhận Báo Giá
            </Link>

            {/* Mobile: Gọi ngay — BottomNav handles nav so just show call CTA */}
            <a
              href={`tel:${CONTACT.hotlineRaw}`}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-full bg-brand text-white text-xs font-semibold"
              aria-label="Gọi điện"
            >
              <Phone size={14} />
              Gọi Ngay
            </a>

            {/* Hamburger — chỉ tablet (md-lg), mobile dùng BottomNav */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="hidden md:flex lg:hidden items-center justify-center w-10 h-10 rounded text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label={isMobileOpen ? 'Đóng menu' : 'Mở menu'}
            >
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-30 lg:hidden" onClick={() => setIsMobileOpen(false)}>
          {/* Overlay */}
          <div className="absolute inset-0 bg-stone-900/50" />
          {/* Drawer panel */}
          <nav
            className="absolute top-0 left-0 bottom-0 w-72 bg-white shadow-xl pt-20 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-2">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center h-11 px-3 rounded text-sm font-medium transition-colors duration-200 mb-0.5',
                      isActive
                        ? 'text-brand bg-brand/8 font-semibold'
                        : 'text-stone-800 hover:text-brand hover:bg-stone-50'
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>

            {/* Mobile contact info trong drawer */}
            <div className="mt-4 mx-4 p-4 bg-stone-50 rounded-lg border border-border">
              <p className="text-xs text-muted mb-2 uppercase tracking-wider">Liên hệ</p>
              <a href={`tel:${CONTACT.hotlineRaw}`} className="flex items-center gap-2 text-brand font-semibold text-sm mb-1">
                <Phone size={14} /> {CONTACT.hotline}
              </a>
              <p className="text-xs text-muted">{CONTACT.address}</p>
              <p className="text-xs text-muted">{CONTACT.workHours}</p>
            </div>

            <div className="p-4 flex flex-col gap-2">
              <Link
                href="/bao-gia"
                className="w-full h-11 bg-brand text-white text-sm font-semibold rounded flex items-center justify-center hover:bg-primary-dark transition-colors"
              >
                Nhận Báo Giá Miễn Phí
              </Link>
              <a
                href={CONTACT.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 bg-[#0068FF] text-white text-sm font-semibold rounded flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                Zalo Tư Vấn Ngay
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
