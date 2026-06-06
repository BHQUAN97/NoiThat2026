'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  LayoutGrid,
  FileText,
  Building2,
  Menu,
  X,
  Info,
  Video,
  Newspaper,
  Phone,
  Star,
  Sofa,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BOTTOM_NAV_ITEMS, BOTTOM_NAV_MORE_LINKS } from '@/lib/constants'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home, LayoutGrid, FileText, Building2, Menu, Info, Video, Newspaper, Phone, Star, Sofa,
}

export function BottomNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  useEffect(() => {
    setMoreOpen(false)
  }, [pathname])

  if (pathname.startsWith('/admin')) return null

  return (
    <>
      {/* Slide-up "Thêm" panel */}
      {moreOpen && (
        <>
          <div
            className="fixed inset-0 z-[48] bg-stone-900/40 animate-fade-in md:hidden"
            onClick={() => setMoreOpen(false)}
          />
          <div className="fixed bottom-14 left-0 right-0 z-[49] md:hidden rounded-t-2xl bg-white shadow-xl pb-2 animate-slide-up">
            <div className="px-5 pt-4 pb-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-3">Khám Phá Thêm</p>
              <div className="grid grid-cols-3 gap-1">
                {BOTTOM_NAV_MORE_LINKS.map((link) => {
                  const Icon = iconMap[link.icon]
                  const isActive = pathname.startsWith(link.href)
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 transition-colors duration-150 active:scale-95',
                        isActive
                          ? 'bg-brand/10 text-brand'
                          : 'text-stone-600 hover:bg-stone-100'
                      )}
                    >
                      {Icon && <Icon className="h-5 w-5" />}
                      <span className="text-[11px] font-medium text-center leading-tight">{link.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 h-14 flex items-center justify-around px-2 bg-white border-t border-stone-100 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Điều hướng mobile"
      >
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isMore = item.href === '#more'
          const isCta = 'cta' in item && item.cta
          const Icon = iconMap[item.icon]

          const isActive = isMore
            ? moreOpen
            : item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)

          if (isMore) {
            return (
              <button
                key="more"
                onClick={() => setMoreOpen(!moreOpen)}
                aria-label={moreOpen ? 'Đóng menu' : 'Xem thêm'}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 px-3 min-h-[44px] min-w-[44px] transition-colors duration-150',
                  moreOpen ? 'text-brand' : 'text-stone-400'
                )}
              >
                <span className="relative h-5 w-5">
                  <Menu className={cn('absolute inset-0 h-5 w-5 transition-all duration-200', moreOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0')} />
                  <X className={cn('absolute inset-0 h-5 w-5 transition-all duration-200', moreOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90')} />
                </span>
                <span className="text-[10px] font-medium leading-none">
                  {moreOpen ? 'Đóng' : item.label}
                </span>
              </button>
            )
          }

          if (isCta) {
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 -mt-4 px-4 py-2 rounded-full min-h-[52px] min-w-[64px] shadow-cta transition-all duration-150 active:scale-95',
                  isActive ? 'bg-primary-dark text-white' : 'bg-brand text-white'
                )}
              >
                {Icon && <Icon className="h-5 w-5" />}
                <span className="text-[10px] font-semibold leading-none">{item.label}</span>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 px-3 min-h-[44px] min-w-[44px] transition-colors duration-150',
                isActive ? 'text-brand' : 'text-stone-400'
              )}
            >
              {Icon && <Icon className="h-5 w-5" />}
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
