'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Project {
  id: string
  title: string
  province: string
  thumbnail_url: string | null
}

interface FeaturedProjectsProps {
  projects?: Project[]
  label?: string
  title?: string
  ctaText?: string
  ctaLink?: string
  limit?: number
}

const PROJECT_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAyedTNnDcb5WkuOBVaW1Wof3ATrIgW-7aJIT3JX8tPlt9ekzp2TqZJezUCmHe4coXAQTWYlsLNRbq-D3Vm6DCjkgsrxmRsyE9wnWVXFega1s5u6xnxmAc4HHX4J8OfsmlFg-XGuvkiNBies8931Qbg16X5jUClOtbQHxINu5oorCqvVVvsPlhUjOlwwypAN8_AHk3yz4S_w_DE4-XsKdQXwl2ClWe0xs5SDtYp3ngLkmRyD8tokMv2sv7CgQzYcRRVNLjaQzk9j9Wl',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDBNDHQJqf79UVtDcI542v6D5Ep0qrWkZQ9JslMmAvqAs6AW_o0P4-1lGxPtoBir-8XxZzVT49NGqeV3AxSlRa52ktZHMfg5Nb7GFaqzHGFzHcoICXkdG4axiuM7QWdz_rkSJwhG-IuIPLC15o1cqJB2IW0y9ntFmWrZDia6EUO6_FgEPWdas5c3w6Isl1UMAkUMDxWr_MGAjg5POvhfWvrwdABJAo0xU2BradeIIITYcIu-1onH5tx23tJhGmBWvaBFtv4G2_iB6ho',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDvQ9kB1eYmGQibk-Fqxe04YoKx6bMa6LqZm6KiOKtEQRIMGeD4C1m02BtLL5sNLrUJwefUeG0dENJS7QMKBw1hVs5BTIEVRTc_yL0UQNpnsXNjLBSjCUgMS1s8ZPwZlGvwSJzlEuNEkKHdUwCGptU9lT3sWyXu5mnwAiBdfsM85x_YGJI9r59x1OOiryzaaqarehogcS-EyDO0QnaKEmO0Vl5ZLwk3WXSk6yWV1BKzKxWbtnQ6Y1K63afP4n12-N9I4CJ050rtXmlb',
]

const FALLBACK_PROJECTS: Project[] = [
  { id: '1', title: 'Tủ bếp Inox 304 - Gia đình anh Tuấn', province: 'Hà Nội', thumbnail_url: null },
  { id: '2', title: 'Nội thất phòng ngủ master - Chị Lan', province: 'Bắc Ninh', thumbnail_url: null },
  { id: '3', title: 'Tủ bếp Acrylic toàn bộ - Chung cư HH', province: 'Hà Nội', thumbnail_url: null },
]

export function FeaturedProjects({
  projects = [],
  label = 'Our Legacy',
  title = 'Dự án tiêu biểu',
  ctaText = 'Xem portfolio',
  ctaLink = '/du-an-thuc-te',
  limit = 3,
}: FeaturedProjectsProps) {
  const displayProjects = projects.length > 0 ? projects.slice(0, limit) : FALLBACK_PROJECTS.slice(0, limit)

  if (displayProjects.length === 0) return null

  return (
    <section className="bg-surface-container-low px-4 py-20 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="mb-4 block font-label text-xs uppercase tracking-[0.2em] text-primary">
              {label}
            </span>
            <h2 className="font-headline text-4xl font-bold text-primary md:text-5xl">
              {title}
            </h2>
          </div>
          <Link
            href={ctaLink}
            className="group flex items-center gap-2 font-label text-label-lg font-bold uppercase tracking-label-wide text-primary transition-all hover:gap-4"
          >
            {ctaText}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {displayProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [imgSrc, setImgSrc] = useState(project.thumbnail_url || PROJECT_IMAGES[index % PROJECT_IMAGES.length])

  return (
    <Link
      href="/du-an-thuc-te"
      className={index === 1 ? 'group md:mt-12' : 'group'}
    >
      <div className="relative h-[500px] overflow-hidden rounded-xl bg-surface">
        <img
          src={imgSrc}
          alt={project.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={() => setImgSrc(PROJECT_IMAGES[index % PROJECT_IMAGES.length])}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-70 transition-opacity group-hover:opacity-85" />
        <div className="absolute bottom-0 left-0 w-full translate-y-4 p-8 transition-transform group-hover:translate-y-0">
          <p className="mb-2 font-label text-[10px] uppercase tracking-[0.2em] text-surface/70">
            {project.province}
          </p>
          <h3 className="mb-4 font-headline text-2xl font-bold text-surface">
            {project.title}
          </h3>
          <p className="text-body-sm leading-relaxed text-surface/0 transition-colors duration-500 group-hover:text-surface/80">
            Không gian được hoàn thiện theo vật liệu, kích thước và thói quen sử dụng thực tế của gia chủ.
          </p>
        </div>
      </div>
    </Link>
  )
}
