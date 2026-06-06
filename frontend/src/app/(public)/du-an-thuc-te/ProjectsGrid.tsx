'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { MapPin } from 'lucide-react'
import { PROVINCES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const PROVINCE_LABELS: Record<string, string> = {
  hanoi: 'Hà Nội',
  bacninh: 'Bắc Ninh',
  hungyen: 'Hưng Yên',
  phutho: 'Phú Thọ',
  ninhbinh: 'Ninh Bình',
  other: 'Khác',
}

// Placeholder projects — sẽ fetch từ API sau khi BE sẵn sàng
const PLACEHOLDER_PROJECTS = Array.from({ length: 9 }, (_, i) => ({
  id: String(i + 1),
  title: `Công trình ${i + 1} — Tủ bếp ${['Inox 304', 'Acrylic', 'Cánh Kính'][i % 3]}`,
  province: (['hanoi', 'bacninh', 'hungyen', 'phutho', 'ninhbinh'] as const)[i % 5],
  thumbnail_url: null as string | null,
  completed_year: 2024 - (i % 3),
}))

export function ProjectsGrid() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeProvince = searchParams.get('province') || ''

  const filteredProjects = activeProvince
    ? PLACEHOLDER_PROJECTS.filter((p) => p.province === activeProvince)
    : PLACEHOLDER_PROJECTS

  function handleFilter(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set('province', value)
    else params.delete('province')
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-content mx-auto px-4 lg:px-8">
        {/* Province filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {PROVINCES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleFilter(value)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
                activeProvince === value
                  ? 'bg-brand text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <p className="text-lg mb-2">Chưa có công trình ở khu vực này</p>
            <p className="text-sm">Liên hệ 094.872.8091 để tư vấn</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group overflow-hidden rounded-xl bg-white shadow-card hover:shadow-card-hover transition-shadow duration-300 border border-border"
              >
                {/* Thumbnail */}
                <div className="aspect-[4/3] bg-stone-100 overflow-hidden">
                  {project.thumbnail_url ? (
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                      <span className="text-stone-400 text-sm">Ảnh công trình</span>
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-stone-900 text-sm mb-2">{project.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-stone-500 text-xs">
                      <MapPin size={12} className="text-brand" />
                      {PROVINCE_LABELS[project.province]}
                    </span>
                    <span className="text-stone-400 text-xs">Năm {project.completed_year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
