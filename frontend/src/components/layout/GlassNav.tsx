'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone, Search, ShoppingBag, User } from 'lucide-react'
import { CONTACT, NAV_LINKS, SITE_NAME } from '@/lib/constants'
import { useScrollPosition } from '@/hooks/useScrollReveal'
import { cn } from '@/lib/utils'

export function GlassNav() {
  const pathname = usePathname()
  const { isScrolled } = useScrollPosition()

  useEffect(() => {
    // Keep hook behavior aligned with route changes; BottomNav owns mobile navigation.
  }, [pathname])

  if (pathname.startsWith('/admin')) return null

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 h-[var(--nav-height)] transition-all duration-500',
        isScrolled && 'shadow-ambient-sm'
      )}
      style={{
        backgroundColor: isScrolled ? 'var(--glass-bg-strong)' : 'var(--glass-bg)',
        backdropFilter: `blur(${isScrolled ? '24px' : '16px'})`,
        WebkitBackdropFilter: `blur(${isScrolled ? '24px' : '16px'})`,
      }}
    >
      <nav className="mx-auto flex h-full max-w-[1920px] items-center justify-between px-4 md:px-8 lg:px-12">
        <Link
          href="/"
          className="group flex items-center gap-2 font-headline text-title-md uppercase tracking-[0.1em] text-primary transition-opacity duration-300 hover:opacity-80 md:text-headline-sm md:normal-case md:tracking-tight"
        >
          <span className="hidden h-9 w-9 items-center justify-center rounded-lg bg-primary/5 transition-colors duration-300 group-hover:bg-primary/10 md:flex">
            <span className="font-headline text-title-md text-primary">D</span>
          </span>
          {SITE_NAME}
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.slice(0, 8).map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'relative px-3 py-2 font-label text-label-lg uppercase tracking-label-wide transition-colors duration-300 xl:px-4',
                    isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-[2px] origin-left animate-line-expand rounded-full bg-primary" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href={`tel:${CONTACT.hotlineRaw}`}
            className="hidden items-center gap-2 rounded-xl bg-primary-container px-4 py-2 font-label text-label-lg font-bold uppercase tracking-label-wide text-on-primary transition-all duration-300 hover:bg-primary hover:shadow-ambient-sm xl:flex"
          >
            <Phone className="h-4 w-4" />
            {CONTACT.hotline}
          </a>
          <Link
            href="/tu-bep"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2.5 text-on-surface-variant transition-all duration-300 hover:bg-surface-container-high hover:text-primary"
            aria-label="Danh muc san pham"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            href="/admin/login"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2.5 text-on-surface-variant transition-all duration-300 hover:bg-surface-container-high hover:text-primary"
            aria-label="Tai khoan"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <Link
            href="/tu-bep"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2.5 text-on-surface-variant transition-colors active:bg-surface-container-high"
            aria-label="San pham"
          >
            <ShoppingBag className="h-5 w-5" />
          </Link>
          <Link
            href="/admin/login"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2.5 text-on-surface-variant transition-colors active:bg-surface-container-high"
            aria-label="Tai khoan"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </nav>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
    </header>
  )
}
