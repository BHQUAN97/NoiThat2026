import type { Metadata } from 'next'
import Link from 'next/link'
import { Phone, ChevronRight, Ruler, Shield, Truck } from 'lucide-react'
import { QuoteForm } from '@/components/forms/QuoteForm'
import { CONTACT } from '@/lib/constants'

interface Props { params: Promise<{ slug: string }> }

function slugToName(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const name = slugToName(slug)
  return {
    title: `${name} — Nội Thất Duy Mạnh`,
    description: `Xem sản phẩm ${name} từ xưởng Nội Thất Duy Mạnh. Giá xưởng, bảo hành 5 năm.`,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const name = slugToName(slug)

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="max-w-content mx-auto px-4 lg:px-8 h-10 flex items-center gap-1.5 text-xs text-stone-400">
          <Link href="/" className="hover:text-brand transition-colors">Trang chủ</Link>
          <ChevronRight size={12} className="shrink-0" />
          <Link href="/tu-bep" className="hover:text-brand transition-colors">Tủ Bếp</Link>
          <ChevronRight size={12} className="shrink-0" />
          <span className="text-stone-700 truncate">{name}</span>
        </div>
      </div>

      <section className="py-6 md:py-12">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Gallery */}
            <div>
              {/* Main image */}
              <div className="aspect-[4/3] bg-gradient-to-br from-stone-200 to-stone-300 rounded-xl overflow-hidden" />
              {/* Thumbnails — horizontal scroll on mobile */}
              <div className="flex gap-2 mt-2 overflow-x-auto pb-1 snap-x snap-mandatory -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="shrink-0 snap-start w-20 h-20 lg:w-auto lg:h-auto lg:aspect-square bg-stone-200 rounded-lg"
                  />
                ))}
              </div>
            </div>

            {/* Product info */}
            <div>
              <h1 className="font-serif font-bold text-stone-900 text-2xl md:text-3xl mb-3">{name}</h1>
              <p className="text-stone-500 text-sm leading-relaxed mb-4">
                Sản phẩm được sản xuất tại xưởng Duy Mạnh theo yêu cầu riêng của từng khách hàng. Vật liệu chính hãng, bảo hành 5 năm.
              </p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-3 mb-5">
                {[
                  { icon: Shield, text: 'Bảo hành 5 năm' },
                  { icon: Ruler, text: 'Theo kích thước thực tế' },
                  { icon: Truck, text: 'Thi công tận nơi' },
                ].map(({ icon: Icon, text }) => (
                  <span key={text} className="flex items-center gap-1.5 text-xs font-medium text-stone-600 bg-white border border-border rounded-full px-3 py-1.5">
                    <Icon size={13} className="text-brand shrink-0" />
                    {text}
                  </span>
                ))}
              </div>

              {/* CTA buttons — primary/secondary, nổi bật trên mobile */}
              <div className="flex gap-3 mb-5">
                <Link
                  href="/bao-gia"
                  className="flex-1 h-12 bg-brand text-white text-sm font-semibold rounded-lg flex items-center justify-center shadow-cta hover:bg-primary-dark transition-colors duration-200"
                >
                  Nhận Báo Giá
                </Link>
                <a
                  href={`tel:${CONTACT.hotlineRaw}`}
                  className="flex-1 h-12 bg-white border-2 border-brand text-brand text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 hover:bg-brand/5 transition-colors duration-200"
                >
                  <Phone size={15} />
                  Gọi Ngay
                </a>
              </div>

              {/* Zalo secondary */}
              <a
                href={CONTACT.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-10 bg-[#0068FF]/10 text-[#0068FF] border border-[#0068FF]/30 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-[#0068FF]/15 transition-colors duration-200 mb-6"
              >
                Tư Vấn Qua Zalo Ngay
              </a>

              {/* Quote form — collapsible on mobile */}
              <div className="p-5 bg-white rounded-xl border border-border shadow-card">
                <h3 className="font-semibold text-stone-900 mb-1">Yêu Cầu Báo Giá Chi Tiết</h3>
                <p className="text-xs text-stone-400 mb-4">Điền thông tin — chúng tôi gọi lại trong 24h</p>
                <QuoteForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
