'use client'

import { useState } from 'react'
import { Lightbox } from '@/components/ui/Lightbox'

interface ProductImagePanelProps {
  gallery: string[]
  name: string
}

export function ProductImagePanel({ gallery, name }: ProductImagePanelProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const lbImages = gallery.map((url, i) => ({ src: url, alt: `${name} ${i + 1}` }))

  return (
    <>
      <div>
        {/* Main image */}
        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-surface-container shadow-card">
          {gallery[0] ? (
            <button
              onClick={() => setLightboxIndex(0)}
              className="h-full w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Xem ảnh lớn"
            >
              <img
                src={gallery[0]}
                alt={name}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </button>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#efe5d9,#b7c7c2)]">
              <span className="font-label text-xs uppercase tracking-widest text-primary/50">Ảnh sản phẩm</span>
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {gallery.length > 1 && (
          <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 snap-x snap-mandatory lg:mx-0 lg:grid lg:grid-cols-4 lg:px-0">
            {gallery.slice(1, 5).map((url, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i + 1)}
                className="h-20 w-20 shrink-0 snap-start overflow-hidden rounded-xl bg-surface-container shadow-card cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:h-auto lg:w-auto lg:aspect-square"
                aria-label={`Xem ảnh ${i + 2}`}
              >
                <img
                  src={url}
                  alt={`${name} ${i + 2}`}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </button>
            ))}
          </div>
        )}

        {/* Placeholder strip khi không có ảnh */}
        {gallery.length === 0 && (
          <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:grid lg:grid-cols-4 lg:px-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 w-20 shrink-0 rounded-xl bg-surface-container lg:aspect-square lg:h-auto lg:w-auto" />
            ))}
          </div>
        )}
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
