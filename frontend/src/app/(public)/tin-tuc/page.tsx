import type { Metadata } from 'next'
import { PageBanner } from '@/components/shared/PageBanner'
import { NewsGrid } from './NewsGrid'

export const metadata: Metadata = {
  title: 'Tin tức & Kinh nghiệm nội thất - Nội Thất Duy Mạnh',
  description:
    'Kinh nghiệm chọn tủ bếp, so sánh vật liệu, xu hướng nội thất mới nhất và bảng giá nội thất cập nhật.',
}

export default function NewsPage() {
  return (
    <>
      <PageBanner
        slug="tin-tuc"
        title="Tin tức & Kinh nghiệm"
        subtitle="Chia sẻ kiến thức, kinh nghiệm chọn vật liệu và xu hướng nội thất mới nhất từ đội ngũ thợ Duy Mạnh."
        label="Blog"
        breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Tin tức' }]}
      />
      <NewsGrid />
    </>
  )
}
