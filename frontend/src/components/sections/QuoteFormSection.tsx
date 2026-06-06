import { Phone } from 'lucide-react'
import { QuoteForm } from '@/components/forms/QuoteForm'
import { CONTACT } from '@/lib/constants'

// Section nhận báo giá cuối trang chủ — nền tối, 2 cột
export function QuoteFormSection() {
  return (
    <section className="py-16 md:py-20 bg-stone-900">
      <div className="max-w-content mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Text bên trái */}
          <div>
            <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-3">Báo Giá Miễn Phí</p>
            <h2 className="font-serif font-bold text-white text-3xl md:text-4xl leading-tight mb-4">
              Nhận Báo Giá<br />Trong 24 Giờ
            </h2>
            <p className="text-stone-400 leading-relaxed mb-6">
              Điền form để nhận báo giá chi tiết miễn phí. Đội tư vấn sẽ liên hệ và sắp xếp khảo sát tại nhà thuận tiện nhất.
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
                  <span className="text-brand font-bold text-sm">1</span>
                </div>
                <span className="text-stone-300 text-sm">Điền thông tin yêu cầu</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
                  <span className="text-brand font-bold text-sm">2</span>
                </div>
                <span className="text-stone-300 text-sm">Nhận tư vấn và báo giá chi tiết</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
                  <span className="text-brand font-bold text-sm">3</span>
                </div>
                <span className="text-stone-300 text-sm">Khảo sát và ký hợp đồng rõ ràng</span>
              </div>
            </div>

            <div className="mt-8 p-4 bg-stone-800 rounded-xl">
              <p className="text-stone-400 text-xs mb-1 uppercase tracking-wider">Hoặc liên hệ trực tiếp</p>
              <a href={`tel:${CONTACT.hotlineRaw}`} className="text-white font-semibold text-xl hover:text-brand transition-colors">
                {CONTACT.hotline}
              </a>
              <p className="text-stone-500 text-xs mt-1">{CONTACT.workHours} — Thứ 2 đến Chủ Nhật</p>
            </div>
          </div>

          {/* Form bên phải */}
          <div className="bg-white rounded-2xl p-6 md:p-8">
            <h3 className="font-serif font-bold text-stone-900 text-xl mb-6">Điền Thông Tin Báo Giá</h3>
            <QuoteForm />
          </div>
        </div>
      </div>
    </section>
  )
}
