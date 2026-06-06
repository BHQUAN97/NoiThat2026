import { TopBar } from '@/components/layout/TopBar'
import { MainHeader } from '@/components/layout/MainHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
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
      <TopBar />
      <MainHeader />
      {/* pt: 64px mobile (header only), 104px desktop (topbar+header) */}
      {/* pb: 56px mobile (BottomNav), 0 desktop */}
      <main className="pt-16 md:pt-[104px] pb-14 md:pb-0 min-h-screen">
        {children}
      </main>
      <SiteFooter />
      <FloatingButtons />
      <BottomNav />
    </>
  )
}
