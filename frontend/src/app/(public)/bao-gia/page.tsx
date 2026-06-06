import type { Metadata } from 'next'
import { QuoteForm } from '@/components/forms/QuoteForm'
import { PricingSelector, type PricingOption } from './PricingSelector'

export const metadata: Metadata = {
  title: 'Báo giá tủ bếp & nội thất - Nội Thất Duy Mạnh',
  description:
    'Bảng giá tham khảo tủ bếp MDF, Picomat, Acrylic, Inox 304. Nhận báo giá chi tiết miễn phí. Liên hệ 094.872.8091.',
}

const PRICING_TABLES: PricingOption[] = [
  {
    material: 'Tủ bếp MDF phủ Melamine',
    priceRange: '2.500.000 - 3.500.000 đ/m dài',
    items: [
      { name: 'Tủ dưới (cánh + ngăn kéo)', price: '1.500.000 - 2.000.000', unit: 'm dài' },
      { name: 'Tủ trên', price: '800.000 - 1.200.000', unit: 'm dài' },
      { name: 'Phụ kiện cơ bản (bản lề, tay kéo)', price: 'Bao gồm' },
      { name: 'Thi công lắp đặt', price: 'Bao gồm' },
    ],
    note: 'Giá tham khảo, chưa bao gồm VAT. Thực tế phụ thuộc kích thước và thiết kế.',
  },
  {
    material: 'Tủ bếp Picomat / Acrylic',
    priceRange: '3.500.000 - 5.500.000 đ/m dài',
    highlight: true,
    items: [
      { name: 'Tủ dưới cánh Acrylic bóng gương', price: '2.200.000 - 3.000.000', unit: 'm dài' },
      { name: 'Tủ trên cánh Acrylic', price: '1.200.000 - 1.800.000', unit: 'm dài' },
      { name: 'Phụ kiện Blum Đức', price: 'Bao gồm' },
      { name: 'Thi công + vệ sinh sau thi công', price: 'Bao gồm' },
    ],
    note: 'Acrylic nhập khẩu, độ bóng cao, chống trầy tốt, phù hợp không gian hiện đại.',
  },
  {
    material: 'Tủ bếp Inox 304',
    priceRange: '4.000.000 - 7.000.000 đ/m dài',
    items: [
      { name: 'Tủ dưới Inox 304 toàn bộ', price: '2.500.000 - 4.000.000', unit: 'm dài' },
      { name: 'Tủ trên Inox 304', price: '1.500.000 - 2.000.000', unit: 'm dài' },
      { name: 'Khung xương Inox + phụ kiện', price: 'Bao gồm' },
      { name: 'Hàn TIG chuyên dụng', price: 'Bao gồm' },
    ],
    note: 'Inox 304 chính hãng, không gỉ. Bảo hành kết cấu lâu dài, phù hợp nhu cầu dùng bền.',
  },
]

export default function PricingPage() {
  return (
    <>
      <section className="bg-surface px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-content">
          <p className="mb-4 font-label text-xs uppercase tracking-[0.22em] text-tertiary">Giá tham khảo</p>
          <h1 className="font-headline text-4xl font-bold leading-tight text-primary md:text-6xl">
            Bảng giá tủ bếp
          </h1>
          <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-on-surface-variant">
            Chọn gói vật liệu phù hợp để gửi yêu cầu. Giá chính xác được chốt sau khi khảo sát và đo đạc miễn phí.
          </p>
        </div>
      </section>

      <PricingSelector tables={PRICING_TABLES} />

      <section id="quote-form" className="bg-surface-bright px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h2 className="font-headline text-3xl font-bold text-primary">Nhận báo giá chính xác</h2>
            <p className="mt-3 text-body-sm text-on-surface-variant">
              Điền thông tin để đội tư vấn liên hệ và báo giá theo kích thước thực tế.
            </p>
          </div>
          <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-6 shadow-card">
            <QuoteForm />
          </div>
        </div>
      </section>
    </>
  )
}
