import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, MapPin } from 'lucide-react'
import { getServerApiUrl } from '@/lib/api-url'
import { getResponseData } from '@/lib/api-response'
import type { Project } from '@/types'

type PageProps = {
  params: Promise<{ id: string }>
}

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
    const apiUrl = getServerApiUrl()
    const res = await fetch(`${apiUrl}/projects/${id}`, { next: { revalidate: 300 } })
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

  const gallery = Array.isArray(project.gallery_urls) && project.gallery_urls.length > 0
    ? project.gallery_urls
    : project.thumbnail_url
      ? [project.thumbnail_url]
      : []

  return (
    <>
      <section className="bg-surface px-4 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-content">
          <Link href="/du-an-thuc-te" className="mb-8 inline-flex items-center gap-2 font-label text-xs font-bold uppercase tracking-widest text-tertiary">
            <ArrowLeft className="h-4 w-4" />
            Dự án thực tế
          </Link>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="mb-4 font-label text-xs uppercase tracking-[0.22em] text-tertiary">Công trình đã hoàn thành</p>
              <h1 className="font-headline text-4xl font-bold leading-tight text-primary md:text-5xl">
                {project.name}
              </h1>
              <div className="mt-6 flex flex-wrap gap-4 text-body-sm text-on-surface-variant">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-tertiary" />
                  {PROVINCE_LABELS[project.province] || project.province}
                </span>
                {project.location && <span>{project.location}</span>}
                {project.area_sqm && <span>{project.area_sqm}</span>}
              </div>
              {project.description && (
                <p className="mt-8 text-body-lg leading-relaxed text-on-surface-variant">{project.description}</p>
              )}
            </div>
            <div className="overflow-hidden rounded-xl bg-surface-container shadow-card">
              {gallery[0] ? (
                <img src={gallery[0]} alt={project.name} className="aspect-[4/3] h-full w-full object-cover" />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center bg-[linear-gradient(135deg,#efe5d9,#b7c7c2)]">
                  <span className="font-label text-xs uppercase tracking-widest text-primary/60">Ảnh công trình</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {gallery.length > 1 && (
        <section className="bg-surface-bright px-4 py-16 lg:px-8">
          <div className="mx-auto grid max-w-content gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.slice(1).map((url, index) => (
              <img key={`${url}-${index}`} src={url} alt={`${project.name} ${index + 2}`} className="aspect-[4/3] rounded-xl object-cover shadow-card" />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
