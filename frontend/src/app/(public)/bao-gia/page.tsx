import type { Metadata } from 'next'
import { QuoteForm } from '@/components/forms/QuoteForm'
import { CheckCircle2, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Báo Giá Tủ Bếp & Nội Thất — Nội Thất Duy Mạnh',
  description: 'Bảng giá tham khảo tủ bếp MDF, Picomat, Inox 304. Nhận báo giá chi tiết miễn phí. Liên hệ 094.872.8091',
}

const PRICING_TABLES = [
  {
    material: 'Tủ Bếp MDF Phủ Melamine',
    priceRange: '2.500.000 – 3.500.000 đ/m dài',
    highlight: false,
    items: [
      { name: 'Tủ dưới (cánh + ngăn kéo)', price: '1.500.000 – 2.000.000', unit: 'm dài' },
      { name: 'Tủ trên', price: '800.000 – 1.200.000', unit: 'm dài' },
      { name: 'Phụ kiện cơ bản (bản lề, tay kéo)', price: 'Bao gồm', unit: '' },
      { name: 'Thi công lắp đặt', price: 'Bao gồm', unit: '' },
    ],
    note: 'Giá tham khảo, chưa bao gồm VAT. Thực tế phụ thuộc kích thước và thiết kế.',
  },
  {
    material: 'Tủ Bếp Picomat / Acrylic',
    priceRange: '3.500.000 – 5.500.000 đ/m dài',
    highlight: true,
    items: [
      { name: 'Tủ dưới cánh Acrylic bóng gương', price: '2.200.000 – 3.000.000', unit: 'm dài' },
      { name: 'Tủ trên cánh Acrylic', price: '1.200.000 – 1.800.000', unit: 'm dài' },
      { name: 'Phụ kiện Blum Đức', price: 'Bao gồm', unit: '' },
      { name: 'Thi công + vệ sinh sau thi công', price: 'Bao gồm', unit: '' },
    ],
    note: 'Giá tham khảo. Acrylic nhập khẩu, độ bóng cao, chống trầy tốt.',
  },
  {
    material: 'Tủ Bếp Inox 304',
    priceRange: '4.000.000 – 7.000.000 đ/m dài',
    highlight: false,
    items: [
      { name: 'Tủ dưới Inox 304 toàn bộ', price: '2.500.000 – 4.000.000', unit: 'm dài' },
      { name: 'Tủ trên Inox 304', price: '1.500.000 – 2.000.000', unit: 'm dài' },
      { name: 'Khung xương Inox + phụ kiện', price: 'Bao gồm', unit: '' },
      { name: 'Hàn TIG chuyên dụng', price: 'Bao gồm', unit: '' },
    ],
    note: 'Inox 304 chính hãng, không gỉ. Bảo hành 10 năm kết cấu. Phù hợp nhà hàng, khách sạn.',
  },
]

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 bg-stone-900 text-white">
        <div className="max-w-content mx-auto px-4 lg:px-8 text-center">
          <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-3">Giá Tham Khảo</p>
          <h1 className="font-serif font-bold text-4xl leading-tight mb-3">Bảng Giá Tủ Bếp</h1>
          <p className="text-stone-300 max-w-xl mx-auto text-sm">
            Giá xưởng trực tiếp, không qua trung gian. Báo giá chính xác sau khi khảo sát miễn phí.
          </p>
        </div>
      </section>

      {/* Pricing tables */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          {/* Disclaimer */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-10">
            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-amber-800 text-sm leading-relaxed">
              <strong>Lưu ý:</strong> Đây là bảng giá tham khảo. Giá thực tế phụ thuộc vào kích thước, thiết kế, chất liệu và phụ kiện cụ thể. Liên hệ để nhận báo giá chính xác sau khi khảo sát miễn phí.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {PRICING_TABLES.map((table) => (
              <div
                key={table.material}
                className={`rounded-xl overflow-hidden border-2 transition-shadow duration-300 ${
                  table.highlight
                    ? 'border-brand shadow-cta'
                    : 'border-border bg-white'
                }`}
              >
                {table.highlight && (
                  <div className="bg-brand text-white text-center text-xs font-semibold py-1.5 uppercase tracking-wider">
                    Phổ Biến Nhất
                  </div>
                )}
                <div className={`p-6 ${table.highlight ? 'bg-white' : ''}`}>
                  <h3 className="font-serif font-bold text-stone-900 text-lg mb-1">{table.material}</h3>
                  <p className="text-brand font-semibold text-sm mb-4">{table.priceRange}</p>

                  <ul className="space-y-2.5 mb-4">
                    {table.items.map((item) => (
                      <li key={item.name} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-brand shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <span className="text-stone-700 text-xs">{item.name}</span>
                          {item.price && (
                            <span className="text-stone-500 text-xs ml-1">
                              {item.unit ? `— ${item.price} đ/${item.unit}` : `— ${item.price}`}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                  <p className="text-stone-400 text-xs italic mb-4">{table.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote form */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-serif font-bold text-stone-900 text-3xl mb-3">Nhận Báo Giá Chính Xác</h2>
            <p className="text-stone-500 text-sm">Điền thông tin để nhận báo giá chi tiết miễn phí từ đội tư vấn</p>
          </div>
          <div className="bg-stone-50 rounded-2xl p-6 border border-border">
            <QuoteForm />
          </div>
        </div>
      </section>
    </>
  )
}
