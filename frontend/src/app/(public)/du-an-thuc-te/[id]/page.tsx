import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, MapPin, Maximize2, Phone, CalendarDays } from 'lucide-react'
import { getServerApiUrl, resolveMediaUrl } from '@/lib/api-url'
import { getResponseData } from '@/lib/api-response'
import { CONTACT } from '@/lib/constants'
import type { Project } from '@/types'

type PageProps = { params: Promise<{ id: string }> }

const PROVINCE_LABELS: Record<string, string> = {
  hanoi: 'Hà Nội',
  bacninh: 'Bắc Ninh',
  hungyen: 'Hưng Yên',
  phutho: 'Phú Thọ',
  ninhbinh: 'Ninh Bình',
  other: 'Khác',
}

async function getProject(id: string): Promise<Project | null> {
  try {
    const res = await fetch(`${getServerApiUrl()}/projects/${id}`, { next: { revalidate: 300 } })
    if (!res.ok) return null
    return getResponseData<Project>(await res.json())
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const project = await getProject(id)
  return {
    title: project ? `${project.name} - Dự án thực tế` : 'Dự án thực tế - Nội Thất Duy Mạnh',
    description: project?.description || 'Chi tiết công trình nội thất thực tế của Nội Thất Duy Mạnh.',
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params
  const project = await getProject(id)

  if (!project) {
    return (
      <section className="bg-surface px-4 py-24 lg:px-8">
        <div className="mx-auto max-w-content text-center">
          <p className="font-label text-xs uppercase tracking-[0.22em] text-tertiary">Dự án thực tế</p>
          <h1 className="mt-4 font-headline text-4xl font-bold text-primary">Chưa tìm thấy dự án</h1>
          <p className="mx-auto mt-4 max-w-xl text-body-md text-on-surface-variant">
            Dự án có thể đã bị ẩn hoặc chưa được cập nhật dữ liệu chi tiết.
          </p>
          <Link href="/du-an-thuc-te" className="mt-8 inline-flex items-center gap-2 font-label text-xs font-bold uppercase tracking-widest text-tertiary">
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách
          </Link>
        </div>
      </section>
    )
  }

  const gallery = (
    Array.isArray(project.gallery_urls) && project.gallery_urls.length > 0
      ? project.gallery_urls
      : project.thumbnail_url
        ? [project.thumbnail_url]
        : []
  ).map(resolveMediaUrl).filter(Boolean)

  const province = PROVINCE_LABELS[project.province] || project.province

  return (
    <div className="min-h-screen bg-surface-bright">

      {/* ── Hero ── */}
      <section className="bg-surface px-4 pb-0 pt-12 lg:px-8 lg:pt-16">
        <div className="mx-auto max-w-content">
          <Link href="/du-an-thuc-te" className="mb-8 inline-flex items-center gap-2 font-label text-xs font-bold uppercase tracking-widest text-tertiary transition-all hover:gap-3">
            <ArrowLeft className="h-4 w-4" />
            Dự án thực tế
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            {/* Left: info */}
            <div className="pb-12">
              <p className="mb-3 font-label text-xs uppercase tracking-[0.22em] text-tertiary">Công trình đã hoàn thành</p>
              <h1 className="mb-6 font-headline text-4xl font-bold leading-tight text-primary md:text-5xl">
                {project.name}
              </h1>

              {/* Project meta badges */}
              <div className="mb-8 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-bright px-4 py-2 font-label text-xs font-medium text-on-surface-variant">
                  <MapPin className="h-3.5 w-3.5 text-tertiary" />
                  {province}
                </span>
                {project.location && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-bright px-4 py-2 font-label text-xs font-medium text-on-surface-variant">
                    {project.location}
                  </span>
                )}
                {project.area_sqm && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-bright px-4 py-2 font-label text-xs font-medium text-on-surface-variant">
                    <Maximize2 className="h-3.5 w-3.5 text-tertiary" />
                    {project.area_sqm}
                  </span>
                )}
                {project.created_at && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-bright px-4 py-2 font-label text-xs font-medium text-on-surface-variant">
                    <CalendarDays className="h-3.5 w-3.5 text-tertiary" />
                    {new Date(project.created_at).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                  </span>
                )}
              </div>

              {project.description && (
                <p className="mb-8 text-body-lg leading-relaxed text-on-surface-variant">{project.description}</p>
              )}

              {/* CTA */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={`tel:${CONTACT.hotlineRaw}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-label text-sm font-bold uppercase tracking-widest text-on-primary shadow-cta transition hover:opacity-90"
                >
                  <Phone className="h-4 w-4" />
                  Tư vấn ngay
                </a>
                <a
                  href={CONTACT.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-primary px-6 py-3 font-label text-sm font-bold uppercase tracking-widest text-primary transition hover:bg-primary/5"
                >
                  Nhắn Zalo
                </a>
              </div>
            </div>

            {/* Right: main image — hangs below section edge on desktop */}
            <div className="overflow-hidden rounded-t-2xl bg-surface-container shadow-card lg:-mb-1">
              {gallery[0] ? (
                <img
                  src={gallery[0]}
                  alt={project.name}
                  className="aspect-[4/3] h-full w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center bg-[linear-gradient(135deg,#efe5d9,#b7c7c2)]">
                  <span className="font-label text-xs uppercase tracking-widest text-primary/50">Ảnh công trình</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      {gallery.length > 1 && (
        <section className="bg-surface-bright px-4 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-content">
            <p className="mb-3 font-label text-xs uppercase tracking-[0.22em] text-tertiary">Hình ảnh thi công</p>
            <h2 className="mb-8 font-headline text-3xl font-bold text-primary">Thư viện ảnh công trình</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((url, i) => (
                <div key={`${url}-${i}`} className="overflow-hidden rounded-xl bg-surface-container shadow-card">
                  <img
                    src={url}
                    alt={`${project.name} ${i + 1}`}
                    className="aspect-[4/3] h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Thông tin chi tiết công trình ── */}
      <section className={`px-4 py-16 lg:px-8 lg:py-20 ${gallery.length > 1 ? 'bg-surface' : 'bg-surface-bright'}`}>
        <div className="mx-auto max-w-content">
          <p className="mb-3 font-label text-xs uppercase tracking-[0.22em] text-tertiary">Chi tiết</p>
          <h2 className="mb-8 font-headline text-3xl font-bold text-primary">Thông tin công trình</h2>
          <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-card">
            {[
              { label: 'Tên công trình', value: project.name },
              { label: 'Tỉnh / Thành phố', value: province },
              ...(project.location ? [{ label: 'Địa chỉ thi công', value: project.location }] : []),
              ...(project.area_sqm ? [{ label: 'Diện tích', value: project.area_sqm }] : []),
              { label: 'Đơn vị thi công', value: 'Nội Thất Duy Mạnh' },
              { label: 'Bảo hành', value: '5 năm' },
            ].map(({ label, value }, i) => (
              <div key={label} className={`flex gap-6 px-6 py-4 ${i % 2 === 0 ? 'bg-surface' : 'bg-surface-bright'}`}>
                <span className="w-44 shrink-0 font-label text-sm font-medium text-on-surface-variant">{label}</span>
                <span className="text-body-sm text-primary">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-primary px-4 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-content text-center">
          <p className="mb-3 font-label text-xs uppercase tracking-[0.22em] text-on-primary/60">Muốn có công trình tương tự?</p>
          <h2 className="mb-4 font-headline text-3xl font-bold text-on-primary md:text-4xl">
            Nhận tư vấn & báo giá miễn phí
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-body-lg text-on-primary/80">
            Đội ngũ Duy Mạnh sẽ đến tận nơi đo đạc, tư vấn thiết kế và đưa ra báo giá chi tiết trong 24h.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`tel:${CONTACT.hotlineRaw}`}
              className="inline-flex items-center gap-2 rounded-xl bg-on-primary px-7 py-3.5 font-label text-sm font-bold uppercase tracking-widest text-primary shadow-cta transition hover:opacity-90"
            >
              <Phone className="h-4 w-4" />
              {CONTACT.hotline}
            </a>
            <a
              href={CONTACT.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-on-primary/40 px-7 py-3.5 font-label text-sm font-bold uppercase tracking-widest text-on-primary transition hover:border-on-primary/70"
            >
              Nhắn Zalo
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
