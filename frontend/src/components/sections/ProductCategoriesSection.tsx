import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PRODUCT_CATEGORIES } from '@/lib/constants'

// Danh mục sản phẩm — grid 3x2, mỗi card có ảnh + tên + link
export function ProductCategoriesSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-content mx-auto px-4 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-2">Sản Phẩm</p>
            <h2 className="font-serif font-bold text-stone-900 text-3xl md:text-4xl leading-tight">
              Danh Mục Sản Phẩm
            </h2>
          </div>
          <Link
            href="/tu-bep"
            className="inline-flex items-center gap-1.5 text-brand font-semibold text-sm hover:gap-2.5 transition-all duration-200 shrink-0"
          >
            Xem tất cả <ArrowRight size={15} />
          </Link>
        </div>

        {/* Grid 6 danh mục */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {PRODUCT_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.href}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-200 shadow-card hover:shadow-card-hover transition-shadow duration-300"
            >
              {/* Placeholder — sẽ thay bằng ảnh thực từ R2 */}
              <div className="absolute inset-0 bg-gradient-to-br from-stone-700 to-stone-900 opacity-80" />

              {/* Text overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-3 group-hover:bg-brand/20 transition-colors duration-300">
                  <span className="text-white font-serif font-bold text-lg">
                    {cat.label.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold text-white text-center text-sm md:text-base leading-tight">
                  {cat.label}
                </h3>
              </div>

              {/* Hover arrow */}
              <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-brand/0 group-hover:bg-brand flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                <ArrowRight size={14} className="text-white" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
