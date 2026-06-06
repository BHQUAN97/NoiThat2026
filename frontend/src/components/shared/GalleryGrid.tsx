'use client'

import { useState } from 'react'
import { Lightbox } from '@/components/ui/Lightbox'

interface GalleryGridProps {
  images: string[]
  altPrefix?: string
  columns?: 2 | 3
}

export function GalleryGrid({ images, altPrefix = 'Hình ảnh', columns = 3 }: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!images.length) return null

  const gridClass = columns === 2
    ? 'grid gap-4 sm:grid-cols-2'
    : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'

  const lbImages = images.map((url, i) => ({ src: url, alt: `${altPrefix} ${i + 1}` }))

  return (
    <>
      <div className={gridClass}>
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
