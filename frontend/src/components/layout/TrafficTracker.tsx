'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Gửi beacon không đồng bộ khi load trang và khi client-side navigation
export function TrafficTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const payload = JSON.stringify({
      path: pathname,
      referrer: document.referrer || undefined,
    })

    try {
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        // sendBeacon: non-blocking, không ảnh hưởng performance
        navigator.sendBeacon(
          '/api/analytics/track',
          new Blob([payload], { type: 'application/json' }),
        )
      } else {
        // Fallback cho browser cũ
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {})
      }
    } catch {
      // Không throw — tracking không được ảnh hưởng UX
    }
  }, [pathname])

  return null
}
