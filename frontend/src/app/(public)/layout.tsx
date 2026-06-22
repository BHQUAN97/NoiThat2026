import type { Metadata } from 'next'
import { GlassNav } from '@/components/layout/GlassNav'
import { Footer } from '@/components/layout/Footer'
import { FloatingButtons } from '@/components/layout/FloatingButtons'
import { BottomNav } from '@/components/layout/BottomNav'
import { TrafficTracker } from '@/components/layout/TrafficTracker'
import { PageBannerProvider } from '@/lib/page-banner-context'
import { getServerApiUrl, resolveMediaUrl } from '@/lib/api-url'

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l * 100]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max - min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [h * 360, s * 100, l * 100]
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function generatePalette(hex: string): Record<string, string> {
  const [h, s, l] = hexToHsl(hex)
  return {
    '--color-primary': hex,
    '--color-primary-dark': hslToHex(h, s, Math.max(l - 12, 5)),
    '--color-primary-container': hslToHex(h, Math.max(s - 10, 10), Math.min(l + 18, 55)),
    '--color-on-primary': '#FFFFFF',
    '--color-on-primary-container': hslToHex(h, Math.max(s - 20, 5), Math.min(l + 55, 90)),
    '--color-primary-fixed': hslToHex(h, Math.max(s - 30, 5), Math.min(l + 50, 88)),
    '--color-primary-fixed-dim': hslToHex(h, Math.max(s - 15, 10), Math.min(l + 35, 72)),
    '--color-on-primary-fixed': hslToHex(h, s, Math.max(l - 10, 3)),
    '--color-on-primary-fixed-variant': hslToHex(h, Math.max(s - 5, 10), Math.min(l + 8, 40)),
    '--color-inverse-primary': hslToHex(h, Math.max(s - 15, 10), Math.min(l + 40, 75)),
  }
}

async function getPublicSettings() {
  const empty = {
    logoUrl: null as string | null,
    siteName: null as string | null,
    mapsUrl: null as string | null,
    primaryColor: null as string | null,
    pageBanners: {} as Record<string, import('@/lib/page-banner-context').PageBannerData>,
  }
  try {
    const res = await fetch(`${getServerApiUrl()}/settings/public`, {
      next: { revalidate: 60, tags: ['settings'] },
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) return empty
    const json = await res.json()
    const data: Record<string, string> = json?.data ?? json

    const banners: Record<string, import('@/lib/page-banner-context').PageBannerData> = {}
    const prefixes = { 'page_banner_': 'image', 'page_title_': 'title', 'page_subtitle_': 'subtitle', 'page_label_': 'label' } as const
    for (const [k, v] of Object.entries(data)) {
      if (!v) continue
      for (const [prefix, field] of Object.entries(prefixes)) {
        if (k.startsWith(prefix)) {
          const slug = k.slice(prefix.length)
          if (!banners[slug]) banners[slug] = {}
          ;(banners[slug] as any)[field] = field === 'image' ? resolveMediaUrl(v) : v
        }
      }
    }

    return {
      logoUrl: resolveMediaUrl(data?.logo_url) || null,
      siteName: data?.site_name || null,
      mapsUrl: data?.google_maps_embed_url || null,
      primaryColor: data?.primary_color || null,
      pageBanners: banners,
    }
  } catch {
    return empty
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { logoUrl } = await getPublicSettings()
  if (!logoUrl) return {}
  return { icons: { icon: logoUrl } }
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { logoUrl, siteName, mapsUrl, primaryColor, pageBanners } = await getPublicSettings()

  const colorOverride = primaryColor && /^#[0-9A-Fa-f]{6}$/.test(primaryColor)
    ? generatePalette(primaryColor) as React.CSSProperties
    : undefined

  return (
    <div style={colorOverride}>
      <TrafficTracker />
      <GlassNav logoUrl={logoUrl} siteName={siteName} />
      <main className="pt-[var(--nav-height)] pb-14 md:pb-0 min-h-screen">
        <PageBannerProvider banners={pageBanners}>
          {children}
        </PageBannerProvider>
      </main>
      <Footer mapsUrl={mapsUrl} />
      <FloatingButtons />
      <BottomNav />
    </div>
  )
}
