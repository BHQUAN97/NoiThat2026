import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'

interface Project {
  id: string
  title: string
  province: string
  thumbnail_url: string | null
}

interface FeaturedProjectsProps {
  projects?: Project[]
}

const PROVINCE_LABELS: Record<string, string> = {
  hanoi: 'Hà Nội',
  bacninh: 'Bắc Ninh',
  hungyen: 'Hưng Yên',
  phutho: 'Phú Thọ',
  ninhbinh: 'Ninh Bình',
  other: 'Khác',
}

// Section dự án tiêu biểu — grid 3 công trình
export function FeaturedProjects({ projects = [] }: FeaturedProjectsProps) {
  // Hiển thị placeholder nếu chưa có data
  const displayProjects = projects.length > 0 ? projects : [
    { id: '1', title: 'Tủ bếp Inox 304 — Gia đình anh Tuấn', province: 'hanoi', thumbnail_url: null },
    { id: '2', title: 'Nội thất phòng ngủ master — Chị Lan', province: 'bacninh', thumbnail_url: null },
    { id: '3', title: 'Tủ bếp Acrylic toàn bộ — Chung cư HH', province: 'hanoi', thumbnail_url: null },
  ]

  return (
    <section className="py-16 md:py-20 bg-stone-50">
      <div className="max-w-content mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-2">Công Trình</p>
            <h2 className="font-serif font-bold text-stone-900 text-3xl md:text-4xl leading-tight">
              Dự Án Tiêu Biểu
            </h2>
          </div>
          <Link
            href="/du-an-thuc-te"
            className="inline-flex items-center gap-1.5 text-brand font-semibold text-sm hover:gap-2.5 transition-all duration-200 shrink-0"
          >
            Xem tất cả <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProjects.map((project) => (
            <Link
              key={project.id}
              href="/du-an-thuc-te"
              className="group overflow-hidden rounded-xl bg-white shadow-card hover:shadow-card-hover transition-shadow duration-300"
            >
              {/* Thumbnail */}
              <div className="aspect-[3/2] bg-stone-200 overflow-hidden">
                {project.thumbnail_url ? (
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-stone-300 to-stone-400 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <span className="text-stone-500 text-sm">Ảnh công trình</span>
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-stone-900 text-sm mb-2 group-hover:text-brand transition-colors duration-200">
                  {project.title}
                </h3>
                <div className="flex items-center gap-1 text-stone-500 text-xs">
                  <MapPin size={12} className="text-brand" />
                  {PROVINCE_LABELS[project.province] || project.province}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
