'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MapPin } from 'lucide-react'
import { getListData } from '@/lib/api-response'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'

type ProjectCard = Pick<Project, 'id' | 'name' | 'province' | 'thumbnail_url'> & {
  completed_year?: number
}

const PLACEHOLDER_PROJECTS: ProjectCard[] = Array.from({ length: 9 }, (_, i) => ({
  id: String(i + 1),
  name: `Công trình ${i + 1} - Tủ bếp ${['Inox 304', 'Acrylic', 'Cánh Kính'][i % 3]}`,
  province: (['hanoi', 'bacninh', 'hungyen', 'phutho', 'ninhbinh'] as const)[i % 5],
  thumbnail_url: null,
  completed_year: 2024 - (i % 3),
}))

export function ProjectsGrid() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeProvince = searchParams.get('province') || ''
  const [projects, setProjects] = useState<ProjectCard[]>(PLACEHOLDER_PROJECTS)

  useEffect(() => {
    let alive = true

    async function loadProjects() {
      try {
        const res = await api.get('/projects') as unknown
        const data = getListData<Project>(res)
        if (alive && data.length > 0) setProjects(data)
      } catch {
        // Keep placeholders if the API is unavailable.
      }
    }

    loadProjects()
    return () => { alive = false }
  }, [])

  const filteredProjects = activeProvince
    ? projects.filter((project) => project.province === activeProvince)
    : projects

  const provinceOptions = [
    { label: 'Tất cả', value: '' },
    ...Array.from(new Set(projects.map((project) => project.province).filter(Boolean)))
      .map((province) => ({ label: province, value: province })),
  ]

  function handleFilter(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set('province', value)
    else params.delete('province')
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <section className="bg-surface-bright px-4 py-14 lg:px-8">
      <div className="mx-auto max-w-content">
        <div className="mb-8 space-y-3">
          <select
            value={activeProvince}
            onChange={(event) => handleFilter(event.target.value)}
            className="block w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 text-body-sm text-on-surface outline-none focus:border-tertiary sm:hidden"
          >
            {provinceOptions.map(({ label, value }) => (
              <option key={value || 'all'} value={value}>{label}</option>
            ))}
          </select>

          <div className="hidden flex-wrap gap-2 sm:flex">
          {provinceOptions.map(({ label, value }) => (
            <button
              key={value || 'all'}
              onClick={() => handleFilter(value)}
              className={cn(
                'rounded-full px-4 py-2 font-label text-xs font-bold uppercase tracking-widest transition-colors duration-200',
                activeProvince === value
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container',
              )}
            >
              {label}
            </button>
          ))}
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center text-on-surface-variant">
            <p className="mb-2 text-body-lg">Chưa có công trình ở khu vực này</p>
            <p className="text-body-sm">Liên hệ 094.872.8091 để tư vấn.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/du-an-thuc-te/${project.id}`}
                className="group overflow-hidden rounded-xl bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="aspect-[4/3] overflow-hidden bg-surface-container">
                  {project.thumbnail_url ? (
                    <img
                      src={project.thumbnail_url}
                      alt={project.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#efe5d9,#b7c7c2)] transition-transform duration-500 group-hover:scale-105">
                      <span className="font-label text-xs uppercase tracking-widest text-primary/60">Ảnh công trình</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="mb-3 font-headline text-xl font-bold text-primary">{project.name}</h3>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-body-sm text-on-surface-variant">
                      <MapPin className="h-4 w-4 text-tertiary" />
                      {project.province}
                    </span>
                    <span className="font-label text-[10px] uppercase tracking-widest text-tertiary">
                      {project.completed_year ? `Năm ${project.completed_year}` : 'Chi tiết'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
