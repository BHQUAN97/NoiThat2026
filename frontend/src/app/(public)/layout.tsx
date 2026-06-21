export const dynamic = 'force-dynamic'

import { GlassNav } from '@/components/layout/GlassNav'
import { Footer } from '@/components/layout/Footer'
import { FloatingButtons } from '@/components/layout/FloatingButtons'
import { BottomNav } from '@/components/layout/BottomNav'
import { TrafficTracker } from '@/components/layout/TrafficTracker'
import { PageBannerProvider } from '@/lib/page-banner-context'
import { getServerApiUrl } from '@/lib/api-url'

async function getPublicSettings(): Promise<{ logoUrl: string | null; mapsUrl: string | null; pageBanners: Record<string, string> }> {
  try {
    const res = await fetch(`${getServerApiUrl()}/settings/public`, {
      next: { revalidate: 3600, tags: ['settings'] },
    })
    if (!res.ok) return { logoUrl: null, mapsUrl: null, pageBanners: {} }
    const json = await res.json()
    const data: Record<string, string> = json?.data ?? json
    const banners: Record<string, string> = {}
    const PREFIX = 'page_banner_'
    for (const [k, v] of Object.entries(data)) {
      if (k.startsWith(PREFIX) && v) banners[k.slice(PREFIX.length)] = v
    }
    return {
      logoUrl: data?.logo_url || null,
      mapsUrl: data?.google_maps_embed_url || null,
      pageBanners: banners,
    }
  } catch {
    return { logoUrl: null, mapsUrl: null, pageBanners: {} }
  }
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { logoUrl, mapsUrl, pageBanners } = await getPublicSettings()

  return (
    <>
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
    </>
  )
}
