import { Shield, Hammer, Truck, Headphones, DollarSign, Star } from 'lucide-react'

const REASONS = [
  {
    icon: Hammer,
    title: 'Xưởng Sản Xuất Trực Tiếp',
    desc: 'Không qua trung gian, giá xưởng cạnh tranh nhất thị trường. Thăm quan xưởng bất cứ lúc nào.',
  },
  {
    icon: Shield,
    title: 'Bảo Hành 5 Năm',
    desc: 'Cam kết bảo hành toàn bộ sản phẩm 5 năm. Hỗ trợ kỹ thuật miễn phí suốt thời gian bảo hành.',
  },
  {
    icon: Star,
    title: 'Vật Liệu Chất Lượng Cao',
    desc: 'Sử dụng Inox 304 chính hãng, gỗ MDF chống ẩm, Acrylic bóng cao cấp. Không dùng vật liệu kém chất lượng.',
  },
  {
    icon: DollarSign,
    title: 'Giá Minh Bạch — Không Phát Sinh',
    desc: 'Báo giá chi tiết từng hạng mục, ký hợp đồng rõ ràng. Không có phát sinh ngoài hợp đồng.',
  },
  {
    icon: Truck,
    title: 'Thi Công Tận Nơi',
    desc: 'Đội thợ kinh nghiệm, thi công tại nhà bạn. Phục vụ Hà Nội và các tỉnh: Bắc Ninh, Hưng Yên, Phú Thọ, Ninh Bình.',
  },
  {
    icon: Headphones,
    title: 'Hỗ Trợ 7 Ngày / Tuần',
    desc: 'Đội tư vấn sẵn sàng 8h-18h hàng ngày kể cả cuối tuần. Tư vấn miễn phí qua Zalo, điện thoại.',
  },
]

// Section "Tại sao chọn Nội Thất Duy Mạnh" — grid 3x2
export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-20 bg-stone-50">
      <div className="max-w-content mx-auto px-4 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-3">Điểm Khác Biệt</p>
          <h2 className="font-serif font-bold text-stone-900 text-3xl md:text-4xl leading-tight mb-3">
            Tại Sao Chọn Nội Thất Duy Mạnh?
          </h2>
          <p className="text-stone-500 leading-relaxed">
            Hơn 10 năm xây dựng uy tín, chúng tôi cam kết mang đến sự hài lòng tuyệt đối.
          </p>
        </div>

        {/* Grid 3 cột */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group p-6 bg-white rounded-xl border border-border hover:border-brand/30 hover:shadow-card-hover transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-brand/10 group-hover:bg-brand/15 flex items-center justify-center mb-4 transition-colors duration-300">
                <Icon size={22} className="text-brand" />
              </div>
              <h3 className="font-semibold text-stone-900 mb-2">{title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
