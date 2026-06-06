import { GlassNav } from '@/components/layout/GlassNav'
import { Footer } from '@/components/layout/Footer'
import { FloatingButtons } from '@/components/layout/FloatingButtons'
import { BottomNav } from '@/components/layout/BottomNav'

// Layout public — TopBar (fixed md+, 40px) + MainHeader (fixed, 64px) + BottomNav (mobile)
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <GlassNav />
      <main className="pt-[var(--nav-height)] pb-14 md:pb-0 min-h-screen">
        {children}
      </main>
      <Footer />
      <FloatingButtons />
      <BottomNav />
    </>
  )
}
