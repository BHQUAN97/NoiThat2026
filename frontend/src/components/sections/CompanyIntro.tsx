import Link from 'next/link'
import { ArrowRight, Award, Users, Clock, CheckCircle2 } from 'lucide-react'

// Giới thiệu nhanh về công ty — 2 cột: text + ảnh
export function CompanyIntro() {
  const highlights = [
    { icon: Clock, label: '10+ Năm Kinh Nghiệm', desc: 'Thành lập 2013, phục vụ hàng trăm gia đình' },
    { icon: Users, label: '500+ Công Trình', desc: 'Đã hoàn thành tại Hà Nội và các tỉnh lân cận' },
    { icon: Award, label: 'Bảo Hành 5 Năm', desc: 'Cam kết chất lượng sản phẩm và dịch vụ hậu mãi' },
    { icon: CheckCircle2, label: 'Xưởng Sản Xuất', desc: 'Trực tiếp thi công, không qua trung gian' },
  ]

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-content mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div>
            <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-3">Về Chúng Tôi</p>
            <h2 className="font-serif font-bold text-stone-900 text-3xl md:text-4xl leading-tight mb-4">
              Nội Thất Duy Mạnh —<br />Xưởng Tủ Bếp Uy Tín Hà Nội
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Chúng tôi là xưởng sản xuất tủ bếp và nội thất gia đình tại <strong>Vân Nam, Phúc Thọ, Hà Nội</strong>. Với hơn 10 năm kinh nghiệm, đội ngũ thợ lành nghề và quy trình kiểm soát chất lượng nghiêm ngặt, chúng tôi tự hào mang đến những sản phẩm bền đẹp với giá xưởng tốt nhất.
            </p>
            <p className="text-stone-600 leading-relaxed mb-6">
              Từ thiết kế đến thi công hoàn thiện, chúng tôi đồng hành cùng bạn trong từng bước để ngôi nhà trở thành không gian sống lý tưởng.
            </p>
            <Link
              href="/gioi-thieu"
              className="inline-flex items-center gap-2 text-brand font-semibold hover:gap-3 transition-all duration-200"
            >
              Xem thêm về chúng tôi <ArrowRight size={16} />
            </Link>
          </div>

          {/* Highlights grid */}
          <div className="grid grid-cols-2 gap-4">
            {highlights.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="p-4 bg-stone-50 rounded-xl border border-border hover:border-brand/30 hover:shadow-card transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center mb-3">
                  <Icon size={20} className="text-brand" />
                </div>
                <h3 className="font-semibold text-stone-900 text-sm mb-1">{label}</h3>
                <p className="text-stone-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
