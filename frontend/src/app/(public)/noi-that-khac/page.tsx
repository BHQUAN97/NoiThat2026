import type { Metadata } from 'next'
import { PageBanner } from '@/components/shared/PageBanner'
import { OtherFurnitureGrid } from './OtherFurnitureGrid'

export const metadata: Metadata = {
  title: 'Nội thất khác - Tủ quần áo, vách Tivi, phòng ngủ',
  description:
    'Tủ quần áo, vách Tivi, nội thất phòng ngủ sản xuất theo yêu cầu. Chất lượng cao, giá xưởng.',
}

export default function OtherFurniturePage() {
  return (
    <>
      <PageBanner
        slug="noi-that-khac"
        title="Nội thất khác"
        subtitle="Tủ quần áo, vách Tivi, phòng ngủ và các hạng mục đóng theo kích thước thực tế."
        label="Danh mục sản phẩm"
        breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Nội thất khác' }]}
      />
      <OtherFurnitureGrid />
    </>
  )
}
