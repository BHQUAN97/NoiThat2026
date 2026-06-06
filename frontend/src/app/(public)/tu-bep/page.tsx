import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tủ Bếp — Inox 304, Acrylic, Cánh Kính',
  description: 'Xưởng sản xuất tủ bếp Inox 304, Acrylic bóng gương, Cánh Kính cao cấp. Giá xưởng, bảo hành 5 năm. Phục vụ Hà Nội và các tỉnh.',
}

const CATEGORIES = [
  {
    slug: 'tu-bep-inox-304',
    name: 'Tủ Bếp Inox 304',
    desc: 'Tủ bếp khung xương Inox 304 chính hãng, hàn TIG chuyên dụng, chống rỉ hoàn toàn. Bền theo năm tháng.',
    badge: 'Bán chạy nhất',
  },
  {
    slug: 'tu-bep-canh-kinh',
    name: 'Tủ Bếp Cánh Kính',
    desc: 'Cánh tủ kính cường lực hoặc kính lùa, sang trọng, hiện đại. Phù hợp căn hộ cao cấp.',
    badge: null,
  },
  {
    slug: 'tu-bep-acrylic',
    name: 'Tủ Bếp Acrylic',
    desc: 'Bề mặt Acrylic bóng gương nhập khẩu. Chống trầy xước, màu sắc đa dạng, dễ vệ sinh.',
    badge: 'Xu hướng 2024',
  },
]

export default function KitchenCabinetPage() {
  return (
    <>
      <section className="py-16 bg-stone-900 text-white">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <nav className="text-stone-400 text-sm mb-4">
            <Link href="/" className="hover:text-white">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Tủ Bếp</span>
          </nav>
          <h1 className="font-serif font-bold text-4xl leading-tight mb-3">Danh Mục Tủ Bếp</h1>
          <p className="text-stone-300 max-w-xl">Thiết kế và sản xuất tủ bếp theo yêu cầu, đo ni trực tiếp tại nhà.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/tu-bep/${cat.slug}`}
                className="group p-6 bg-stone-50 rounded-xl border border-border hover:border-brand/30 hover:shadow-card-hover transition-all duration-300"
              >
                {cat.badge && (
                  <span className="inline-block px-2 py-0.5 bg-brand text-white text-xs font-semibold rounded mb-3">
                    {cat.badge}
                  </span>
                )}
                {/* Placeholder image */}
                <div className="aspect-[4/3] bg-gradient-to-br from-stone-200 to-stone-300 rounded-lg mb-4 overflow-hidden group-hover:scale-[1.02] transition-transform duration-300" />
                <h2 className="font-serif font-bold text-stone-900 text-lg mb-2">{cat.name}</h2>
                <p className="text-stone-500 text-sm leading-relaxed mb-3">{cat.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-brand text-sm font-semibold group-hover:gap-2.5 transition-all duration-200">
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
