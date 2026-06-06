import type { Metadata } from 'next'
import { HeroBanner } from '@/components/sections/HeroBanner'
import { CompanyIntro } from '@/components/sections/CompanyIntro'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { ProductCategoriesSection } from '@/components/sections/ProductCategoriesSection'
import { FeaturedProjects } from '@/components/sections/FeaturedProjects'
import { VideoSection } from '@/components/sections/VideoSection'
import { CustomerReviews } from '@/components/sections/CustomerReviews'
import { QuoteFormSection } from '@/components/sections/QuoteFormSection'
import { getServerApiUrl, resolveMediaUrl } from '@/lib/api-url'
import { getListData } from '@/lib/api-response'
import type { Project, Review, Video } from '@/types'

export const metadata: Metadata = {
  title: 'Tủ Bếp & Nội Thất Gia Đình Cao Cấp — Xưởng Duy Mạnh',
  description:
    'Xưởng sản xuất tủ bếp Inox 304, Acrylic, Cánh Kính và nội thất gia đình tại Vân Nam, Phúc Thọ, Hà Nội. Giá xưởng, bảo hành 5 năm. Hotline: 094.872.8091',
}

async function fetchAll() {
  const base = getServerApiUrl()

  const [projectsRes, reviewsRes, videosRes] = await Promise.allSettled([
    fetch(`${base}/projects?featured=true&limit=3`, { next: { revalidate: 300 } }),
    fetch(`${base}/reviews?featured=true&limit=6`, { next: { revalidate: 300 } }),
    fetch(`${base}/videos?limit=3`, { next: { revalidate: 300 } }),
  ])

  const projectsRaw: Project[] = projectsRes.status === 'fulfilled' && projectsRes.value.ok
    ? getListData<Project>(await projectsRes.value.json())
    : []

  const reviewsRaw: Review[] = reviewsRes.status === 'fulfilled' && reviewsRes.value.ok
    ? getListData<Review>(await reviewsRes.value.json())
    : []

  const videosRaw: Video[] = videosRes.status === 'fulfilled' && videosRes.value.ok
    ? getListData<Video>(await videosRes.value.json())
    : []

  // Map API types to section component prop shapes
  const projects = projectsRaw.map(p => ({
    id: p.id,
    title: p.name,
    province: p.province,
    thumbnail_url: resolveMediaUrl(p.thumbnail_url) || null,
  }))

  const reviews = reviewsRaw.map(r => ({
    id: r.id,
    customer_name: r.customer_name,
    content: r.content,
    rating: r.rating,
    avatar_url: resolveMediaUrl(r.avatar_url) || null,
    source: 'direct' as const,
  }))

  const videos = videosRaw
    .filter(v => v.video_type === 'youtube' && v.youtube_id)
    .map(v => ({
      id: v.id,
      title: v.title,
      youtube_url: `https://www.youtube.com/watch?v=${v.youtube_id}`,
      thumbnail_url: resolveMediaUrl(v.thumbnail_url) || null,
      type: 'thi_cong' as const,
    }))

  return { projects, reviews, videos }
}

export default async function HomePage() {
  const { projects, reviews, videos } = await fetchAll()

  return (
    <>
      <HeroBanner />
      <CompanyIntro />
      <WhyChooseUs />
      <ProductCategoriesSection />
      <FeaturedProjects projects={projects} />
      <VideoSection videos={videos} />
      <CustomerReviews reviews={reviews} />
      <QuoteFormSection />
    </>
  )
}
