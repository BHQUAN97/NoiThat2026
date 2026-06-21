'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone, Search, ShoppingBag, User, ChevronDown, Menu, X } from 'lucide-react'
import { CONTACT, NAV_LINKS, SITE_NAME } from '@/lib/constants'
import { useScrollPosition } from '@/hooks/useScrollReveal'
import { cn } from '@/lib/utils'

const NAV_DROPDOWNS: Record<string, Array<{ label: string; href: string }>> = {
  '/tu-bep': [
    { label: 'Tủ Bếp Inox 304', href: '/tu-bep/tu-bep-inox-304' },
    { label: 'Tủ Bếp Cánh Kính', href: '/tu-bep/tu-bep-canh-kinh' },
    { label: 'Tủ Bếp Acrylic', href: '/tu-bep/tu-bep-acrylic' },
  ],
  '/noi-that-khac': [
    { label: 'Tủ Quần Áo', href: '/noi-that-khac/tu-quan-ao' },
    { label: 'Vách Tivi', href: '/noi-that-khac/vach-tivi' },
    { label: 'Nội Thất Phòng Ngủ', href: '/noi-that-khac/noi-that-phong-ngu' },
  ],
}

function NavDropdownItem({
  link,
  pathname,
}: {
  link: (typeof NAV_LINKS)[number]
  pathname: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLLIElement>(null)
  const subLinks = NAV_DROPDOWNS[link.href]
  const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  if (!subLinks) {
    return (
      <li>
        <Link
          href={link.href}
          className={cn(
            'relative rounded-lg px-3 py-2 font-label text-label-lg uppercase tracking-label-wide transition-all duration-200 xl:px-4',
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-on-surface-variant hover:bg-primary/8 hover:text-primary',
          )}
        >
          {link.label}
          {isActive && (
            <span className="absolute bottom-0.5 left-3 right-3 h-[2px] origin-left animate-line-expand rounded-full bg-primary xl:left-4 xl:right-4" />
          )}
        </Link>
      </li>
    )
  }

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-0.5 rounded-lg px-3 py-2 font-label text-label-lg uppercase tracking-label-wide transition-all duration-200 xl:px-4',
          isActive || open
            ? 'bg-primary/10 text-primary'
            : 'text-on-surface-variant hover:bg-primary/8 hover:text-primary',
        )}
      >
        {link.label}
        <ChevronDown
          className={cn('h-3.5 w-3.5 transition-transform duration-200', open && 'rotate-180')}
        />
        {isActive && (
          <span className="absolute bottom-0.5 left-3 right-3 h-[2px] origin-left animate-line-expand rounded-full bg-primary xl:left-4 xl:right-4" />
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[210px] rounded-xl border border-outline-variant bg-surface py-1 shadow-ambient-lg">
          <Link
            href={link.href}
            onClick={() => setOpen(false)}
            className="mb-1 flex items-center border-b border-outline-variant/40 px-4 py-2.5 text-body-sm font-medium text-on-surface-variant transition-all duration-150 hover:bg-primary/8 hover:text-primary"
          >
            Tất cả {link.label}
          </Link>
          {subLinks.map((sub) => (
            <Link
              key={sub.href}
              href={sub.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center px-4 py-2.5 text-body-sm transition-all duration-150',
                pathname === sub.href
                  ? 'bg-primary/10 font-semibold text-primary'
                  : 'text-on-surface-variant hover:bg-primary/8 hover:text-primary',
              )}
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </li>
  )
}

export function GlassNav({ logoUrl }: { logoUrl?: string | null }) {
  const pathname = usePathname()
  const { isScrolled } = useScrollPosition()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)

  useEffect(() => {
    setMobileOpen(false)
    setMobileExpanded(null)
  }, [pathname])

  if (pathname.startsWith('/admin')) return null

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-50 h-[var(--nav-height)] transition-all duration-500',
          isScrolled && 'shadow-ambient-sm',
        )}
        style={{
          backgroundColor: isScrolled ? 'var(--glass-bg-strong)' : 'var(--glass-bg)',
          backdropFilter: `blur(${isScrolled ? '24px' : '16px'})`,
          WebkitBackdropFilter: `blur(${isScrolled ? '24px' : '16px'})`,
        }}
      >
        <nav className="mx-auto flex h-full max-w-[1920px] items-center justify-between px-4 md:px-8 lg:px-12">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2 shrink-0"
          >
            {logoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={logoUrl}
                alt={SITE_NAME}
                className="h-9 w-auto object-contain"
              />
            ) : (
              <>
                <span className="hidden h-9 w-9 items-center justify-center rounded-lg bg-primary/5 transition-colors duration-300 group-hover:bg-primary/10 md:flex">
                  <span className="font-headline text-title-md text-primary">D</span>
                </span>
                <span className="font-headline text-title-md uppercase tracking-[0.1em] text-primary transition-opacity duration-300 hover:opacity-80 md:text-headline-sm md:normal-case md:tracking-tight">
                  {SITE_NAME}
                </span>
              </>
            )}
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavDropdownItem key={link.href} link={link} pathname={pathname} />
            ))}
          </ul>

          {/* Desktop actions */}
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

          {/* Mobile actions */}
          <div className="flex items-center gap-1 md:hidden">
            <Link
              href="/tu-bep"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2.5 text-on-surface-variant transition-colors active:bg-surface-container-high"
              aria-label="San pham"
            >
              <ShoppingBag className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2.5 text-on-surface-variant transition-colors active:bg-surface-container-high lg:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" />
          <nav
            className="absolute right-0 top-0 bottom-0 w-72 bg-surface shadow-ambient-xl overflow-y-auto pt-[var(--nav-height)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-4 space-y-0.5">
              {NAV_LINKS.map((link) => {
                const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
                const subLinks = NAV_DROPDOWNS[link.href]
                const expanded = mobileExpanded === link.href

                return (
                  <div key={link.href}>
                    <div className="flex items-center">
                      <Link
                        href={link.href}
                        className={cn(
                          'flex-1 flex items-center h-11 px-3 rounded-xl text-body-sm font-medium transition-colors',
                          isActive
                            ? 'text-primary bg-primary-container/20 font-semibold'
                            : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high',
                        )}
                      >
                        {link.label}
                      </Link>
                      {subLinks && (
                        <button
                          onClick={() => setMobileExpanded(expanded ? null : link.href)}
                          className="flex h-10 w-10 items-center justify-center text-on-surface-variant hover:text-primary"
                        >
                          <ChevronDown
                            className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')}
                          />
                        </button>
                      )}
                    </div>
                    {subLinks && expanded && (
                      <div className="ml-4 mt-0.5 mb-1 border-l border-outline-variant pl-3 space-y-0.5">
                        {subLinks.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={cn(
                              'flex items-center h-9 px-2 text-body-sm rounded-lg transition-colors',
                              pathname === sub.href
                                ? 'text-primary font-medium'
                                : 'text-on-surface-variant hover:text-primary',
                            )}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mx-4 my-4 p-4 rounded-xl bg-surface-container-low">
              <p className="text-label-sm text-on-surface-variant mb-3 uppercase tracking-wider">Liên hệ</p>
              <a
                href={`tel:${CONTACT.hotlineRaw}`}
                className="flex items-center gap-2 text-primary font-semibold text-body-sm mb-1"
              >
                <Phone className="h-4 w-4" /> {CONTACT.hotline}
              </a>
            </div>

            <div className="px-4 pb-8 flex flex-col gap-2">
              <Link
                href="/bao-gia"
                className="w-full h-11 bg-primary text-on-primary text-body-sm font-semibold rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                Nhận Báo Giá Miễn Phí
              </Link>
              <a
                href={CONTACT.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 bg-[#0068FF] text-white text-body-sm font-semibold rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors"
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
