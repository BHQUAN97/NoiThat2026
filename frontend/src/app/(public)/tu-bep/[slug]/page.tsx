import type { Metadata } from 'next'
import Link from 'next/link'
import { QuoteForm } from '@/components/forms/QuoteForm'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return {
    title: `${name} — Nội Thất Duy Mạnh`,
    description: `Xem sản phẩm ${name} từ xưởng Nội Thất Duy Mạnh. Giá xưởng, bảo hành 5 năm.`,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return (
    <>
      <section className="py-12 bg-stone-50">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <nav className="text-stone-400 text-sm mb-6">
            <Link href="/">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link href="/tu-bep" className="hover:text-brand">Tủ Bếp</Link>
            <span className="mx-2">/</span>
            <span className="text-stone-700">{name}</span>
          </nav>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Gallery placeholder */}
            <div className="space-y-3">
              <div className="aspect-[4/3] bg-gradient-to-br from-stone-200 to-stone-300 rounded-xl" />
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-stone-200 rounded-lg" />
                ))}
              </div>
            </div>
            {/* Product info + form */}
            <div>
              <h1 className="font-serif font-bold text-stone-900 text-3xl mb-4">{name}</h1>
              <p className="text-stone-500 text-sm leading-relaxed mb-6">
                Sản phẩm được sản xuất tại xưởng Duy Mạnh theo yêu cầu riêng của từng khách hàng. Vật liệu chính hãng, bảo hành 5 năm.
              </p>
              <div className="p-5 bg-stone-50 rounded-xl border border-border">
                <h3 className="font-semibold text-stone-900 mb-4">Nhận Báo Giá</h3>
                <QuoteForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
