import type { Metadata } from 'next'
import Link from 'next/link'
import { KitchenGrid } from './KitchenGrid'

export const metadata: Metadata = {
  title: 'Tủ bếp - Inox 304, Acrylic, Cánh kính',
  description:
    'Xưởng sản xuất tủ bếp Inox 304, Acrylic bóng gương, Cánh kính cao cấp. Giá xưởng, bảo hành 5 năm. Phục vụ Hà Nội và các tỉnh.',
}

export default function KitchenCabinetPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-surface px-4 py-20 lg:px-8 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(47,85,85,0.13),transparent_34%),linear-gradient(135deg,#fffdf8_0%,#fbf7f0_54%,#efe5d9_100%)]" />
        <div className="relative mx-auto max-w-content">
          <nav className="mb-7 font-label text-xs uppercase tracking-widest text-on-surface-variant">
            <Link href="/" className="transition hover:text-primary">Trang chủ</Link>
            <span className="mx-3 text-outline">/</span>
            <span className="text-primary">Tủ bếp</span>
          </nav>
          <div className="grid items-end gap-8 lg:grid-cols-[0.8fr_1fr]">
            <div>
              <p className="mb-4 font-label text-xs uppercase tracking-[0.22em] text-tertiary">Danh mục sản phẩm</p>
              <h1 className="font-headline text-4xl font-bold leading-tight text-primary md:text-6xl">
                Tủ bếp thiết kế theo không gian thật
              </h1>
            </div>
            <p className="max-w-xl text-body-lg leading-relaxed text-on-surface-variant lg:justify-self-end">
              Sản xuất theo kích thước thực tế, tư vấn vật liệu dựa trên thói quen sử dụng và ngân sách của từng gia đình.
            </p>
          </div>
        </div>
      </section>

      <KitchenGrid />
    </>
  )
}
