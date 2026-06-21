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
import type { Project, Review, Video, PageConfig, PageSection } from '@/types'

export const metadata: Metadata = {
  title: 'Tủ Bếp & Nội Thất Gia Đình Cao Cấp — Xưởng Duy Mạnh',
  description:
    'Xưởng sản xuất tủ bếp Inox 304, Acrylic, Cánh Kính và nội thất gia đình tại Vân Nam, Phúc Thọ, Hà Nội. Giá xưởng, bảo hành 5 năm. Hotline: 094.872.8091',
}

async function fetchAll() {
  const base = getServerApiUrl()
  const signal = () => AbortSignal.timeout(5000)

  const [projectsRes, reviewsRes, videosRes, pageRes] = await Promise.allSettled([
    fetch(`${base}/projects?featured=true&limit=6`, { next: { revalidate: 300 }, signal: signal() }),
    fetch(`${base}/reviews?featured=true&limit=6`, { next: { revalidate: 300 }, signal: signal() }),
    fetch(`${base}/videos?limit=6`, { next: { revalidate: 300 }, signal: signal() }),
    fetch(`${base}/pages/homepage`, { next: { revalidate: 60, tags: ['pages'] }, signal: signal() }),
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

  let pageSections: PageSection[] = []
  if (pageRes.status === 'fulfilled' && pageRes.value.ok) {
    try {
      const pageJson = await pageRes.value.json()
      const payload = pageJson?.data ?? pageJson
      // payload la config_published truc tiep (tu ok(config.config_published))
      // hoac la PageConfig object — xu ly ca 2 truong hop
      pageSections = payload?.sections || payload?.config_published?.sections || []
    } catch { /* ignore */ }
  }

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

  return { projects, reviews, videos, pageSections }
}

function getSectionConfig(sections: PageSection[], type: string): Record<string, unknown> | null {
  const s = sections.find(s => s.type === type)
  if (!s || s.visible === false) return null
  return s.config
}

function isSectionVisible(sections: PageSection[], type: string): boolean {
  if (sections.length === 0) return true
  const s = sections.find(s => s.type === type)
  return s ? s.visible !== false : true
}

export default async function HomePage() {
  const { projects, reviews, videos, pageSections } = await fetchAll()

  const heroConfig = getSectionConfig(pageSections, 'hero') as Record<string, unknown> | null
  const introConfig = getSectionConfig(pageSections, 'company_intro') as Record<string, unknown> | null
  const whyConfig = getSectionConfig(pageSections, 'why_choose_us') as Record<string, unknown> | null
  const catConfig = getSectionConfig(pageSections, 'product_categories') as Record<string, unknown> | null
  const projectsConfig = getSectionConfig(pageSections, 'featured_projects') as Record<string, unknown> | null
  const videoConfig = getSectionConfig(pageSections, 'video_section') as Record<string, unknown> | null
  const reviewsConfig = getSectionConfig(pageSections, 'customer_reviews') as Record<string, unknown> | null

  function toImgItem(v: unknown): { url: string; pos: string } {
    if (typeof v === 'string') return { url: v, pos: 'center' }
    const x = v as any
    return { url: x?.url || '', pos: x?.pos || 'center' }
  }

  const heroImages = ((heroConfig?.bg_images as unknown[]) || []).map(toImgItem)
  const heroImg = heroImages[0]

  return (
    <>
      {isSectionVisible(pageSections, 'hero') && (
        <HeroBanner
          title={heroConfig?.title as string | undefined}
          subtitle={heroConfig?.subtitle as string | undefined}
          imageUrl={heroImg?.url}
          imagePosition={heroImg?.pos}
          ctaPrimaryText={heroConfig?.cta_primary_text as string | undefined}
          ctaPrimaryLink={heroConfig?.cta_primary_link as string | undefined}
          badge={heroConfig?.badge as string | undefined}
        />
      )}

      {isSectionVisible(pageSections, 'company_intro') && (
        <CompanyIntro
          label={introConfig?.label as string | undefined}
          headline={introConfig?.headline as string | undefined}
          body={introConfig?.body as string | undefined}
          quote={introConfig?.quote as string | undefined}
          stats={introConfig?.stats as Array<{ value: string; label: string }> | undefined}
          images={introConfig?.images as string[] | undefined}
          linkText={introConfig?.link_text as string | undefined}
          linkHref={introConfig?.link_href as string | undefined}
        />
      )}

      {isSectionVisible(pageSections, 'why_choose_us') && (
        <WhyChooseUs
          sectionLabel={whyConfig?.section_label as string | undefined}
          sectionTitle={whyConfig?.section_title as string | undefined}
          sectionDesc={whyConfig?.section_desc as string | undefined}
          cards={whyConfig?.cards as Array<{ title: string; desc: string; bgImage?: string }> | undefined}
        />
      )}

      {isSectionVisible(pageSections, 'product_categories') && (
        <ProductCategoriesSection
          label={catConfig?.label as string | undefined}
          title={catConfig?.title as string | undefined}
        />
      )}

      {isSectionVisible(pageSections, 'featured_projects') && (
        <FeaturedProjects
          projects={projects}
          label={projectsConfig?.label as string | undefined}
          title={projectsConfig?.title as string | undefined}
          ctaText={projectsConfig?.cta_text as string | undefined}
          ctaLink={projectsConfig?.cta_link as string | undefined}
          limit={projectsConfig?.limit as number | undefined}
        />
      )}

      {isSectionVisible(pageSections, 'video_section') && (
        <VideoSection
          videos={videos}
          label={videoConfig?.label as string | undefined}
          title={videoConfig?.title as string | undefined}
          limit={videoConfig?.limit as number | undefined}
        />
      )}

      {isSectionVisible(pageSections, 'customer_reviews') && (
        <CustomerReviews
          reviews={reviews}
          label={reviewsConfig?.label as string | undefined}
          title={reviewsConfig?.title as string | undefined}
          desc={reviewsConfig?.desc as string | undefined}
          limit={reviewsConfig?.limit as number | undefined}
        />
      )}

      {isSectionVisible(pageSections, 'quote_form') && <QuoteFormSection />}
    </>
  )
}
