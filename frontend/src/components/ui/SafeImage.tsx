'use client'

import { useState } from 'react'
import Image, { type ImageProps } from 'next/image'

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackClassName?: string
}

/**
 * Image component với fallback graceful khi ảnh không load được.
 * Dùng cho các card hiển thị ảnh từ external sources (Unsplash, etc.)
 */
export function SafeImage({ fallbackClassName, className, alt, ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={`flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#efe5d9_0%,#d9c7b7_48%,#b7c7c2_100%)] ${fallbackClassName ?? ''}`}>
        <span className="rounded-full border border-white/40 bg-white/35 px-3 py-1 font-label text-[10px] uppercase tracking-widest text-primary/60 backdrop-blur">
          Noi That Duy Manh
        </span>
      </div>
    )
  }

  return (
    <Image
      {...props}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  )
}
