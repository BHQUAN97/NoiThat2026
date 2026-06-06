import type { Metadata } from 'next'
import { Award, Users, Clock, Shield, CheckCircle2, Factory } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Giới Thiệu — Nội Thất Duy Mạnh',
  description: 'Xưởng sản xuất tủ bếp và nội thất gia đình Duy Mạnh tại Vân Nam, Phúc Thọ, Hà Nội. Hơn 10 năm kinh nghiệm, 500+ công trình hoàn thành.',
}

const WORK_PROCESS = [
  { step: '01', title: 'Tư Vấn & Khảo Sát', desc: 'Đội tư vấn đến tận nhà đo đạc, tư vấn thiết kế phù hợp không gian và ngân sách. Hoàn toàn miễn phí.' },
  { step: '02', title: 'Thiết Kế 3D', desc: 'Cung cấp bản vẽ thiết kế 3D để khách hàng hình dung rõ trước khi sản xuất. Chỉnh sửa không giới hạn đến khi hài lòng.' },
  { step: '03', title: 'Báo Giá & Ký Hợp Đồng', desc: 'Báo giá chi tiết từng hạng mục, rõ ràng minh bạch. Ký hợp đồng có đầy đủ điều khoản bảo hành.' },
  { step: '04', title: 'Sản Xuất Tại Xưởng', desc: 'Sản xuất tại xưởng Vân Nam với máy móc hiện đại. Kiểm tra chất lượng 100% trước khi xuất xưởng.' },
  { step: '05', title: 'Thi Công Lắp Đặt', desc: 'Đội thợ lành nghề thi công tại nhà, đảm bảo thẩm mỹ và kỹ thuật. Thời gian thi công đúng hẹn.' },
  { step: '06', title: 'Bàn Giao & Bảo Hành', desc: 'Bàn giao có biên bản, hướng dẫn sử dụng và bảo dưỡng. Bảo hành 5 năm, hỗ trợ kỹ thuật suốt đời.' },
]

const COMMITMENTS = [
  { icon: Shield, title: 'Vật Liệu Chính Hãng', desc: 'Inox 304 chính hãng, gỗ MDF chống ẩm, Acrylic nhập khẩu. Có nguồn gốc rõ ràng, kiểm định chất lượng.' },
  { icon: CheckCircle2, title: 'Đúng Thiết Kế', desc: 'Cam kết thi công đúng bản vẽ đã thống nhất. Không tự ý thay đổi chất liệu hay kích thước.' },
  { icon: Clock, title: 'Đúng Tiến Độ', desc: 'Bàn giao đúng ngày đã hẹn. Nếu chậm trễ do lỗi xưởng, khách hàng được bồi thường theo hợp đồng.' },
  { icon: Award, title: 'Bảo Hành 5 Năm', desc: 'Bảo hành toàn bộ 5 năm. Bất kỳ lỗi kỹ thuật nào phát sinh trong thời gian bảo hành, chúng tôi xử lý miễn phí.' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-20 bg-stone-900 text-white">
        <div className="max-w-content mx-auto px-4 lg:px-8 text-center">
          <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-3">Về Chúng Tôi</p>
          <h1 className="font-serif font-bold text-4xl md:text-5xl leading-tight mb-4">Nội Thất Duy Mạnh</h1>
          <p className="text-stone-300 text-lg max-w-2xl mx-auto">
            Hơn 10 năm đồng hành cùng hàng trăm gia đình tạo nên không gian bếp và nội thất đẹp, bền, giá tốt.
          </p>
        </div>
      </section>

      {/* Thông tin công ty */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-3">Câu Chuyện</p>
              <h2 className="font-serif font-bold text-stone-900 text-3xl leading-tight mb-4">
                Từ Xưởng Nhỏ Đến Thương Hiệu Uy Tín
              </h2>
              <div className="prose prose-stone max-w-none text-stone-600 space-y-3 text-sm leading-relaxed">
                <p>
                  Nội Thất Duy Mạnh được thành lập năm 2013 bởi anh Duy Mạnh — người thợ mộc có hơn 15 năm kinh nghiệm trong nghề. Xuất phát từ một xưởng nhỏ tại Vân Nam, Phúc Thọ, với tâm huyết mang đến sản phẩm chất lượng cao với giá xưởng, chúng tôi đã dần xây dựng uy tín qua từng công trình.
                </p>
                <p>
                  Đến nay, xưởng Duy Mạnh có đội ngũ 20+ thợ lành nghề, trang bị máy móc hiện đại, đã hoàn thành hơn <strong>500 công trình</strong> tại Hà Nội và các tỉnh lân cận. Mỗi sản phẩm đều được sản xuất thủ công kết hợp công nghệ, đảm bảo độ chính xác và tính thẩm mỹ cao.
                </p>
              </div>
            </div>
            {/* Ảnh xưởng placeholder */}
            <div className="aspect-[4/3] bg-gradient-to-br from-stone-200 to-stone-300 rounded-2xl flex items-center justify-center">
              <div className="text-center text-stone-400">
                <Factory size={48} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">Ảnh xưởng sản xuất</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quy trình làm việc */}
      <section className="py-16 md:py-20 bg-stone-50">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-3">Quy Trình</p>
            <h2 className="font-serif font-bold text-stone-900 text-3xl leading-tight">Quy Trình Làm Việc 6 Bước</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WORK_PROCESS.map(({ step, title, desc }) => (
              <div key={step} className="p-6 bg-white rounded-xl border border-border">
                <div className="w-10 h-10 rounded-xl bg-brand text-white font-bold text-sm flex items-center justify-center mb-3">
                  {step}
                </div>
                <h3 className="font-semibold text-stone-900 mb-2">{title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cam kết chất lượng */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-3">Cam Kết</p>
            <h2 className="font-serif font-bold text-stone-900 text-3xl leading-tight">Cam Kết Chất Lượng</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {COMMITMENTS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-5 bg-stone-50 rounded-xl border border-border">
                <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-brand" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-sm mb-1">{title}</h3>
                  <p className="text-stone-500 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
