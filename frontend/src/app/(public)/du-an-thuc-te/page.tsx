import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ProjectsGrid } from './ProjectsGrid'

export const metadata: Metadata = {
  title: 'Dự án thực tế - Công trình đã hoàn thành',
  description:
    'Xem các công trình tủ bếp và nội thất thực tế đã hoàn thành tại Hà Nội và các tỉnh lân cận.',
}

export default function ProjectsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-surface px-4 py-20 lg:px-8 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(47,85,85,0.13),transparent_34%),linear-gradient(135deg,#fffdf8_0%,#fbf7f0_55%,#efe5d9_100%)]" />
        <div className="relative mx-auto grid max-w-content items-end gap-8 lg:grid-cols-[0.8fr_1fr]">
          <div>
            <p className="mb-4 font-label text-xs uppercase tracking-[0.22em] text-tertiary">Portfolio</p>
            <h1 className="font-headline text-4xl font-bold leading-tight text-primary md:text-6xl">
              Dự án thực tế
            </h1>
          </div>
          <p className="max-w-xl text-body-lg leading-relaxed text-on-surface-variant lg:justify-self-end">
            Các công trình tủ bếp và nội thất đã hoàn thành, được lọc động theo tỉnh/thành từ dữ liệu dự án trong admin.
          </p>
        </div>
      </section>

      <Suspense fallback={<div className="bg-surface-bright py-20 text-center text-on-surface-variant">Đang tải...</div>}>
        <ProjectsGrid />
      </Suspense>
    </>
  )
}
