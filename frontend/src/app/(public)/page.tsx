import type { Metadata } from 'next'
import { HeroBanner } from '@/components/sections/HeroBanner'
import { CompanyIntro } from '@/components/sections/CompanyIntro'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { ProductCategoriesSection } from '@/components/sections/ProductCategoriesSection'
import { FeaturedProjects } from '@/components/sections/FeaturedProjects'
import { VideoSection } from '@/components/sections/VideoSection'
import { CustomerReviews } from '@/components/sections/CustomerReviews'
import { QuoteFormSection } from '@/components/sections/QuoteFormSection'

export const metadata: Metadata = {
  title: 'Tủ Bếp & Nội Thất Gia Đình Cao Cấp — Xưởng Duy Mạnh',
  description:
    'Xưởng sản xuất tủ bếp Inox 304, Acrylic, Cánh Kính và nội thất gia đình tại Vân Nam, Phúc Thọ, Hà Nội. Giá xưởng, bảo hành 5 năm. Hotline: 094.872.8091',
}

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <CompanyIntro />
      <WhyChooseUs />
      <ProductCategoriesSection />
      <FeaturedProjects />
      <VideoSection />
      <CustomerReviews />
      <QuoteFormSection />
    </>
  )
}
