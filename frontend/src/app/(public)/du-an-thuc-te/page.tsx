import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageBanner } from '@/components/shared/PageBanner'
import { ProjectsGrid } from './ProjectsGrid'

export const metadata: Metadata = {
  title: 'Dự án thực tế - Công trình đã hoàn thành',
  description:
    'Xem các công trình tủ bếp và nội thất thực tế đã hoàn thành tại Hà Nội và các tỉnh lân cận.',
}

export default function ProjectsPage() {
  return (
    <>
      <PageBanner
        slug="du-an-thuc-te"
        title="Dự án thực tế"
        subtitle="Các công trình tủ bếp và nội thất đã hoàn thành tại Hà Nội và các tỉnh lân cận."
        label="Portfolio"
      />
      <Suspense fallback={<div className="bg-surface-bright py-20 text-center text-on-surface-variant">Đang tải...</div>}>
        <ProjectsGrid />
      </Suspense>
    </>
  )
}
