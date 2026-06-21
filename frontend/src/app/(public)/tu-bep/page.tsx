import type { Metadata } from 'next'
import { PageBanner } from '@/components/shared/PageBanner'
import { KitchenGrid } from './KitchenGrid'

export const metadata: Metadata = {
  title: 'Tủ bếp - Inox 304, Acrylic, Cánh kính',
  description:
    'Xưởng sản xuất tủ bếp Inox 304, Acrylic bóng gương, Cánh kính cao cấp. Giá xưởng, bảo hành 5 năm. Phục vụ Hà Nội và các tỉnh.',
}

export default function KitchenCabinetPage() {
  return (
    <>
      <PageBanner
        slug="tu-bep"
        title="Tủ bếp thiết kế theo không gian thật"
        subtitle="Sản xuất theo kích thước thực tế, tư vấn vật liệu dựa trên thói quen sử dụng và ngân sách của từng gia đình."
        label="Danh mục sản phẩm"
        breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Tủ bếp' }]}
      />
      <KitchenGrid />
    </>
  )
}
