'use client'

import { useState } from 'react'
import { Lightbox } from '@/components/ui/Lightbox'

interface ClickableHeroImageProps {
  images: string[]
  alt: string
  className?: string
  wrapperClassName?: string
}

export function ClickableHeroImage({ images, alt, className, wrapperClassName }: ClickableHeroImageProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const lbImages = images.map((url, i) => ({ src: url, alt: `${alt} ${i + 1}` }))

  if (!images[0]) return null

  return (
    <>
      <button
        onClick={() => setLightboxIndex(0)}
        className={`cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${wrapperClassName ?? ''}`}
        aria-label="Xem ảnh lớn"
      >
        <img
          src={images[0]}
          alt={alt}
          className={className}
        />
      </button>

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
