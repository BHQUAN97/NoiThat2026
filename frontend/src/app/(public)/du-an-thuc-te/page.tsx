import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ProjectsGrid } from './ProjectsGrid'

export const metadata: Metadata = {
  title: 'Dự Án Thực Tế — Công Trình Đã Hoàn Thành',
  description: 'Xem các công trình tủ bếp và nội thất thực tế đã hoàn thành tại Hà Nội, Bắc Ninh, Hưng Yên, Phú Thọ, Ninh Bình.',
}

export default function ProjectsPage() {
  return (
    <>
      <section className="py-16 md:py-20 bg-stone-900 text-white">
        <div className="max-w-content mx-auto px-4 lg:px-8 text-center">
          <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-3">Portfolio</p>
          <h1 className="font-serif font-bold text-4xl md:text-5xl leading-tight mb-4">Dự Án Thực Tế</h1>
          <p className="text-stone-300 max-w-xl mx-auto">
            500+ công trình đã hoàn thành tại Hà Nội và các tỉnh lân cận. Tất cả đều do đội thợ Duy Mạnh trực tiếp thi công.
          </p>
        </div>
      </section>
      <Suspense fallback={<div className="py-20 text-center text-stone-400">Đang tải...</div>}>
        <ProjectsGrid />
      </Suspense>
    </>
  )
}
