export const dynamic = 'force-dynamic'

import { GlassNav } from '@/components/layout/GlassNav'
import { Footer } from '@/components/layout/Footer'
import { FloatingButtons } from '@/components/layout/FloatingButtons'
import { BottomNav } from '@/components/layout/BottomNav'
import { getServerApiUrl } from '@/lib/api-url'

async function getPublicSettings(): Promise<{ logoUrl: string | null; mapsUrl: string | null }> {
  try {
    const res = await fetch(`${getServerApiUrl()}/settings/public`, {
      next: { revalidate: 3600, tags: ['settings'] },
    })
    if (!res.ok) return { logoUrl: null, mapsUrl: null }
    const data: Record<string, string> = await res.json()
    return {
      logoUrl: data?.logo_url || null,
      mapsUrl: data?.google_maps_embed_url || null,
    }
  } catch {
    return { logoUrl: null, mapsUrl: null }
  }
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { logoUrl, mapsUrl } = await getPublicSettings()

  return (
    <>
      <GlassNav logoUrl={logoUrl} />
      <main className="pt-[var(--nav-height)] pb-14 md:pb-0 min-h-screen">
        {children}
      </main>
      <Footer mapsUrl={mapsUrl} />
      <FloatingButtons />
      <BottomNav />
    </>
  )
}
