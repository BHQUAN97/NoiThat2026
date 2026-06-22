export const dynamic = 'force-dynamic'

import { DynamicFavicon } from '@/components/layout/DynamicFavicon'
import { GlassNav } from '@/components/layout/GlassNav'
import { Footer } from '@/components/layout/Footer'
import { FloatingButtons } from '@/components/layout/FloatingButtons'
import { BottomNav } from '@/components/layout/BottomNav'
import { TrafficTracker } from '@/components/layout/TrafficTracker'
import { PageBannerProvider } from '@/lib/page-banner-context'
import { getServerApiUrl } from '@/lib/api-url'

async function getPublicSettings() {
  const empty = {
    logoUrl: null as string | null,
    mapsUrl: null as string | null,
    primaryColor: null as string | null,
    pageBanners: {} as Record<string, import('@/lib/page-banner-context').PageBannerData>,
  }
  try {
    const res = await fetch(`${getServerApiUrl()}/settings/public`, {
      next: { revalidate: 3600, tags: ['settings'] },
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
          ;(banners[slug] as any)[field] = v
        }
      }
    }

    return {
      logoUrl: data?.logo_url || null,
      mapsUrl: data?.google_maps_embed_url || null,
      primaryColor: data?.primary_color || null,
      pageBanners: banners,
    }
  } catch {
    return empty
  }
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { logoUrl, mapsUrl, primaryColor, pageBanners } = await getPublicSettings()

  const colorOverride = primaryColor && /^#[0-9A-Fa-f]{6}$/.test(primaryColor)
    ? { '--color-primary': primaryColor } as React.CSSProperties
    : undefined

  return (
    <div style={colorOverride}>
      <DynamicFavicon logoUrl={logoUrl} />
      <TrafficTracker />
      <GlassNav logoUrl={logoUrl} />
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
