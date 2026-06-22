'use client'

import { useEffect } from 'react'

export function DynamicFavicon({ logoUrl }: { logoUrl?: string | null }) {
  useEffect(() => {
    if (!logoUrl) return

    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.href = logoUrl
    link.type = 'image/png'
  }, [logoUrl])

  return null
}
