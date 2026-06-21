'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePageBanner } from '@/lib/page-banner-context'

interface PageBannerProps {
  slug: string
  /** Fallback title — admin setting overrides this */
  title: string
  /** Fallback subtitle */
  subtitle?: string
  /** Fallback label */
  label?: string
  breadcrumb?: { label: string; href?: string }[]
  children?: React.ReactNode
}

export function PageBanner({ slug, title: defaultTitle, subtitle: defaultSubtitle, label: defaultLabel, breadcrumb, children }: PageBannerProps) {
  const cfg = usePageBanner(slug)
  const bannerUrl = cfg.image || null
  const title = cfg.title || defaultTitle
  const subtitle = cfg.subtitle || defaultSubtitle
  const label = cfg.label || defaultLabel

  return (
    <section className="relative overflow-hidden bg-surface px-4 py-20 lg:px-8 lg:py-24">
      {bannerUrl ? (
        <>
          <Image
            src={bannerUrl}
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(47,85,85,0.13),transparent_34%),linear-gradient(135deg,#fffdf8_0%,#fbf7f0_54%,#efe5d9_100%)]" />
      )}

      <div className="relative mx-auto max-w-content">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="mb-7 font-label text-xs uppercase tracking-widest">
            {breadcrumb.map((item, i) => (
              <span key={i}>
                {i > 0 && <span className={`mx-3 ${bannerUrl ? 'text-white/50' : 'text-outline'}`}>/</span>}
                {item.href ? (
                  <Link href={item.href} className={`transition hover:text-primary ${bannerUrl ? 'text-white/70 hover:text-white' : 'text-on-surface-variant'}`}>
                    {item.label}
                  </Link>
                ) : (
                  <span className={bannerUrl ? 'text-white' : 'text-primary'}>{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className="grid items-end gap-8 lg:grid-cols-[0.8fr_1fr]">
          <div>
            {label && (
              <p className={`mb-4 font-label text-xs uppercase tracking-[0.22em] ${bannerUrl ? 'text-white/70' : 'text-tertiary'}`}>
                {label}
              </p>
            )}
            <h1 className={`font-headline text-4xl font-bold leading-tight md:text-6xl ${bannerUrl ? 'text-white' : 'text-primary'}`}>
              {title}
            </h1>
          </div>
          {subtitle && (
            <p className={`max-w-xl text-body-lg leading-relaxed lg:justify-self-end ${bannerUrl ? 'text-white/80' : 'text-on-surface-variant'}`}>
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  )
}
