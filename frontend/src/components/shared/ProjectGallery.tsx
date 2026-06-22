'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Camera, Grid3x3 } from 'lucide-react'
import { Lightbox } from '@/components/ui/Lightbox'

interface ProjectGalleryProps {
  images: string[]
  altPrefix?: string
}

export function ProjectGallery({ images, altPrefix = 'Hình ảnh' }: ProjectGalleryProps) {
  const [tab, setTab] = useState<'carousel' | 'grid'>('carousel')
  const [current, setCurrent] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const goPrev = useCallback(() => setCurrent((i) => Math.max(0, i - 1)), [])
  const goNext = useCallback(() => setCurrent((i) => Math.min(images.length - 1, i + 1)), [images.length])

  useEffect(() => {
    if (tab !== 'carousel' || images.length <= 1 || paused || lightboxIndex !== null) return
    const id = setInterval(() => {
      setCurrent((i) => (i + 1) % images.length)
    }, 4000)
    return () => clearInterval(id)
  }, [tab, images.length, paused, lightboxIndex])

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    touchEndX.current = null
  }
  function handleTouchMove(e: React.TouchEvent) {
    touchEndX.current = e.touches[0].clientX
  }
  function handleTouchEnd() {
    if (touchStartX.current === null || touchEndX.current === null) return
    const diff = touchStartX.current - touchEndX.current
    if (diff > 50) goNext()
    else if (diff < -50) goPrev()
    touchStartX.current = null
    touchEndX.current = null
  }

  if (!images.length) return null

  const lbImages = images.map((src, i) => ({ src, alt: `${altPrefix} - Góc nhìn ${i + 1}` }))

  return (
    <>
      {/* ── Tab toggle ── */}
      <div className="mb-6 flex justify-center">
        <div className="flex rounded-xl border border-outline-variant bg-surface p-1 gap-1 shadow-sm">
          <button
            onClick={() => setTab('carousel')}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 font-label text-sm font-medium transition-colors ${
              tab === 'carousel'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <Camera className="h-4 w-4" />
            Carousel
          </button>
          <button
            onClick={() => setTab('grid')}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 font-label text-sm font-medium transition-colors ${
              tab === 'grid'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <Grid3x3 className="h-4 w-4" />
            Lưới
          </button>
        </div>
      </div>

      {tab === 'carousel' ? (
        /* ── Carousel ── */
        <div>
          <div
            className="relative overflow-hidden rounded-2xl bg-surface-container shadow-card cursor-pointer"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={(e) => { setPaused(true); handleTouchStart(e) }}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => { handleTouchEnd(); setTimeout(() => setPaused(false), 3000) }}
            onClick={() => setLightboxIndex(current)}
          >
            {/* Counter badge */}
            <div className="absolute right-4 top-4 z-10 rounded-full bg-black/50 px-3 py-1 font-label text-xs text-white backdrop-blur-sm">
              {current + 1}/{images.length}
            </div>

            {/* Main image */}
            <img
              src={images[current]}
              alt={`${altPrefix} - Góc nhìn ${current + 1}`}
              className="aspect-[16/10] w-full object-cover transition-all duration-300"
            />

            {/* Prev arrow */}
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goPrev() }}
                disabled={current === 0}
                className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60 disabled:opacity-30 focus-visible:outline-none"
                aria-label="Ảnh trước"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            {/* Next arrow */}
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goNext() }}
                disabled={current === images.length - 1}
                className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60 disabled:opacity-30 focus-visible:outline-none"
                aria-label="Ảnh sau"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Caption */}
          <p className="mt-3 text-center font-label text-sm text-on-surface-variant">
            {altPrefix} — Góc nhìn {current + 1}
          </p>

          {/* Dots */}
          {images.length > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Ảnh ${i + 1}`}
                  className={`h-2 rounded-full transition-all focus-visible:outline-none ${
                    i === current
                      ? 'w-6 bg-primary'
                      : 'w-2 bg-outline-variant hover:bg-primary/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ── Grid ── */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((url, i) => (
            <button
              key={`${url}-${i}`}
              onClick={() => setLightboxIndex(i)}
              className="group overflow-hidden rounded-xl bg-surface-container shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`Xem ${altPrefix} ${i + 1}`}
            >
              <img
                src={url}
                alt={`${altPrefix} ${i + 1}`}
                className="aspect-[4/3] h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={lbImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}
