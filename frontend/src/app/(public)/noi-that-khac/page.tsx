import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Nội Thất Khác — Tủ Quần Áo, Vách Tivi, Phòng Ngủ',
  description: 'Tủ quần áo, vách Tivi, nội thất phòng ngủ sản xuất theo yêu cầu. Chất lượng cao, giá xưởng.',
}

const CATEGORIES = [
  { slug: 'tu-quan-ao', name: 'Tủ Quần Áo', desc: 'Tủ quần áo âm tường, tủ đứng, cánh trượt. Thiết kế tùy chỉnh theo kích thước phòng.' },
  { slug: 'vach-tivi', name: 'Vách Tivi', desc: 'Kệ tivi, vách ngăn phòng khách, kệ sách kết hợp. Gỗ công nghiệp chống ẩm, nhiều màu sắc.' },
  { slug: 'noi-that-phong-ngu', name: 'Nội Thất Phòng Ngủ', desc: 'Giường, đầu giường, tủ đầu giường, bàn trang điểm. Bộ đồ phòng ngủ đồng bộ.' },
]

export default function OtherFurniturePage() {
  return (
    <>
      <section className="py-16 bg-stone-900 text-white">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <nav className="text-stone-400 text-sm mb-4">
            <Link href="/" className="hover:text-white">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Nội Thất Khác</span>
          </nav>
          <h1 className="font-serif font-bold text-4xl leading-tight mb-3">Nội Thất Khác</h1>
          <p className="text-stone-300">Tủ quần áo, vách Tivi, nội thất phòng ngủ — sản xuất đặt hàng theo yêu cầu.</p>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/noi-that-khac/${cat.slug}`}
                className="group p-6 bg-stone-50 rounded-xl border border-border hover:border-brand/30 hover:shadow-card-hover transition-all duration-300">
                <div className="aspect-[4/3] bg-gradient-to-br from-stone-200 to-stone-300 rounded-lg mb-4" />
                <h2 className="font-serif font-bold text-stone-900 text-lg mb-2">{cat.name}</h2>
                <p className="text-stone-500 text-sm mb-3">{cat.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-brand text-sm font-semibold group-hover:gap-2.5 transition-all">
                  Xem chi tiết <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
