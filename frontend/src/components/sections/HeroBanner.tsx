'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { CONTACT } from '@/lib/constants'

interface BgImage { url: string; pos?: string }

interface HeroBannerProps {
  title?: string
  subtitle?: string
  imageUrl?: string
  imagePosition?: string
  bgImages?: BgImage[]
  ctaPrimaryText?: string
  ctaPrimaryLink?: string
  badge?: string
  autoplay?: boolean
  autoplayInterval?: number
}

const DEFAULT_HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBbl16vPBWPylYhNaCf_1wb3R5wa0CkxdGYl1gO4uuX5gIC073XhfDsBJHI-fR2UKQo8BroOxDqFLAqIG52XknVHY7S7SGXEa7_5IVZA5XHdfTgdNwcG7VxOvFuqhoBp5x63UtQIvT44E0WO0KjJHNbkaRi5p3-WZxshW71-pVgoaynHTdEeyJjwsmjNaFFizBw5LsDhj9f-FZvapK5ms8zIo_SYe4B9sr7076Sdxxi_AwbYdAe1Oiy1h2B_DDwMGqjsw3My0oMA01s'

export function HeroBanner({
  title = 'Kiến tạo không gian sống tinh tế.',
  subtitle = 'Xưởng tủ bếp và nội thất Duy Mạnh kế thừa tinh thần VietNet: ảnh công trình làm trung tâm, vật liệu rõ ràng, thi công gọn và tư vấn trực tiếp.',
  imageUrl = DEFAULT_HERO_IMAGE,
  imagePosition = 'center',
  bgImages,
  ctaPrimaryText = 'Bắt đầu dự án',
  ctaPrimaryLink = '/bao-gia',
  badge = 'Xưởng sản xuất trực tiếp',
  autoplay = true,
  autoplayInterval = 6,
}: HeroBannerProps) {
  const images: BgImage[] = bgImages && bgImages.length > 0
    ? bgImages
    : [{ url: imageUrl, pos: imagePosition }]
  const hasSlideshow = images.length > 1

  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    if (!hasSlideshow || !autoplay) return
    const id = setInterval(next, autoplayInterval * 1000)
    return () => clearInterval(id)
  }, [hasSlideshow, autoplay, autoplayInterval, next])

  return (
    <section className="relative flex min-h-[calc(100vh-var(--nav-height))] items-center justify-center overflow-hidden bg-primary">
      <div className="absolute inset-0">
        {images.map((img, i) => (
          <img
            key={img.url}
            src={img.url}
            alt="Không gian nội thất cao cấp"
            className="absolute inset-0 h-full w-full scale-105 object-cover transition-opacity duration-1000"
            style={{
              objectPosition: img.pos || 'center',
              opacity: i === current ? 1 : 0,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-primary/25 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/75 via-primary/20 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center">
        {badge && (
          <span className="mb-6 inline-flex rounded-full border border-white/10 bg-primary-container/30 px-4 py-2 font-label text-xs uppercase tracking-[0.3em] text-surface backdrop-blur-md">
            {badge}
          </span>
        )}
        <h1 className="mb-8 font-headline text-5xl font-bold leading-[1.08] tracking-tight text-surface md:text-7xl lg:text-8xl">
          {title}
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-body-lg leading-relaxed text-surface/90 md:text-xl">
          {subtitle}
        </p>
        <div className="flex flex-col items-center justify-center gap-5 md:flex-row">
          <Link
            href={ctaPrimaryLink}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-container px-10 py-4 font-label text-label-lg font-bold uppercase tracking-label-wide text-on-primary transition-all hover:bg-primary hover:shadow-cta"
          >
            {ctaPrimaryText}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={`tel:${CONTACT.hotlineRaw}`}
            className="inline-flex items-center gap-2 font-label text-label-lg font-bold uppercase tracking-label-wide text-surface underline-offset-8 transition hover:underline"
          >
            <Phone className="h-4 w-4" />
            {CONTACT.hotline}
          </a>
        </div>
      </div>

      {/* Slideshow dots */}
      {hasSlideshow && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
              aria-label={`Ảnh ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
