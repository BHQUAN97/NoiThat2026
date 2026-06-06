import type { Metadata } from 'next'
import Link from 'next/link'
import { OtherFurnitureGrid } from './OtherFurnitureGrid'

export const metadata: Metadata = {
  title: 'Nội thất khác - Tủ quần áo, vách Tivi, phòng ngủ',
  description:
    'Tủ quần áo, vách Tivi, nội thất phòng ngủ sản xuất theo yêu cầu. Chất lượng cao, giá xưởng.',
}

export default function OtherFurniturePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-surface px-4 py-20 lg:px-8 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(47,85,85,0.14),transparent_34%),linear-gradient(135deg,#fffdf8_0%,#fbf7f0_54%,#efe5d9_100%)]" />
        <div className="relative mx-auto grid max-w-content items-end gap-8 lg:grid-cols-[0.85fr_1fr]">
          <div>
            <nav className="mb-7 font-label text-xs uppercase tracking-widest text-on-surface-variant">
              <Link href="/" className="transition hover:text-primary">Trang chủ</Link>
              <span className="mx-3 text-outline">/</span>
              <span className="text-primary">Nội thất khác</span>
            </nav>
            <p className="mb-4 font-label text-xs uppercase tracking-[0.22em] text-tertiary">Danh mục sản phẩm</p>
            <h1 className="font-headline text-4xl font-bold leading-tight text-primary md:text-6xl">
              Nội thất khác
            </h1>
          </div>
          <p className="max-w-xl text-body-lg leading-relaxed text-on-surface-variant lg:justify-self-end">
            Tủ quần áo, vách Tivi, phòng ngủ và các hạng mục đóng theo kích thước thực tế, lấy dữ liệu danh mục từ admin khi có.
          </p>
        </div>
      </section>

      <OtherFurnitureGrid />
    </>
  )
}
