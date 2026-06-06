import { TopBar } from '@/components/layout/TopBar'
import { MainHeader } from '@/components/layout/MainHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { FloatingButtons } from '@/components/layout/FloatingButtons'

// Layout cho tất cả public pages — có TopBar + Header + Footer + FloatingButtons
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* TopBar (40px) + MainHeader (64px) = 104px trên desktop, 64px trên mobile */}
      <TopBar />
      <MainHeader />
      <main className="pt-16 md:pt-[104px] min-h-screen">
        {children}
      </main>
      <SiteFooter />
      <FloatingButtons />
    </>
  )
}
