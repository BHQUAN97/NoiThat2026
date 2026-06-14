import { GlassNav } from '@/components/layout/GlassNav'
import { Footer } from '@/components/layout/Footer'
import { FloatingButtons } from '@/components/layout/FloatingButtons'
import { BottomNav } from '@/components/layout/BottomNav'
import { getServerApiUrl } from '@/lib/api-url'

async function getLogoUrl(): Promise<string | null> {
  try {
    const res = await fetch(`${getServerApiUrl()}/settings/public`, {
      next: { revalidate: 3600, tags: ['settings'] },
    })
    if (!res.ok) return null
    const data: Record<string, string> = await res.json()
    return data?.logo_url || null
  } catch {
    return null
  }
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const logoUrl = await getLogoUrl()

  return (
    <>
      <GlassNav logoUrl={logoUrl} />
      <main className="pt-[var(--nav-height)] pb-14 md:pb-0 min-h-screen">
        {children}
      </main>
      <Footer />
      <FloatingButtons />
      <BottomNav />
    </>
  )
}
