'use client'

import Link from 'next/link'
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
    <section className="relative overflow-hidden bg-surface px-4 py-16 lg:px-8 lg:py-20">
      {bannerUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bannerUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(47,85,85,0.13),transparent_34%),linear-gradient(135deg,#fffdf8_0%,#fbf7f0_54%,#efe5d9_100%)]" />
      )}

      <div className="relative mx-auto max-w-content">
        <div className="grid items-end gap-8 lg:grid-cols-[0.8fr_1fr]">
          <div>
            {label && (
              <p className={`mb-3 font-label text-xs uppercase tracking-[0.22em] ${bannerUrl ? 'text-white/70' : 'text-tertiary'}`}>
                {label}
              </p>
            )}
            <h1 className={`font-headline text-3xl font-bold leading-tight md:text-5xl ${bannerUrl ? 'text-white' : 'text-primary'}`}>
              {title}
            </h1>
          </div>
          {subtitle && (
            <p className={`max-w-xl text-body-md leading-relaxed lg:text-body-lg lg:justify-self-end ${bannerUrl ? 'text-white/80' : 'text-on-surface-variant'}`}>
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  )
}
