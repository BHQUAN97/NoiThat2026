import type { Metadata } from 'next'
import { Star, Play } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Đánh Giá Khách Hàng — Nội Thất Duy Mạnh',
  description: 'Xem đánh giá thực tế từ khách hàng đã sử dụng sản phẩm Nội Thất Duy Mạnh. 500+ công trình hoàn thành, 98% hài lòng.',
}

const PLACEHOLDER_REVIEWS = Array.from({ length: 6 }, (_, i) => ({
  id: String(i + 1),
  customer_name: ['Chị Nguyễn Thị Lan', 'Anh Trần Văn Hùng', 'Chị Phạm Thu Hương', 'Anh Lê Văn Đức', 'Chị Hoàng Thị Mai', 'Anh Nguyễn Quang Minh'][i],
  content: [
    'Tủ bếp Inox 304 chất lượng rất tốt, làm đẹp, bền. Thợ thi công chuyên nghiệp, đúng hẹn.',
    'Rất hài lòng với dịch vụ. Anh bên xưởng tư vấn nhiệt tình, giá hợp lý.',
    'Tủ Acrylic bóng đẹp như ảnh. Gia đình rất thích, sẽ giới thiệu bạn bè.',
    'Đặt hàng lần 2 vì lần trước quá ưng ý. Chất lượng ổn định, đúng thiết kế.',
    'Giá cả minh bạch, không phát sinh thêm. Đội thợ dọn dẹp sạch sẽ sau thi công.',
    'Bảo hành chu đáo, gọi là có người đến xử lý ngay. Rất tin tưởng.',
  ][i],
  rating: 5,
  source: (['facebook', 'google', 'direct', 'facebook', 'google', 'direct'] as const)[i],
  has_video: i < 2,
}))

const SOURCE_LABELS = { facebook: 'Facebook', google: 'Google', direct: 'Trực tiếp', video: 'Video' }
const SOURCE_COLORS = { facebook: 'text-blue-600', google: 'text-green-600', direct: 'text-stone-500', video: 'text-brand' }

export default function ReviewsPage() {
  return (
    <>
      <section className="py-16 bg-stone-900 text-white">
        <div className="max-w-content mx-auto px-4 lg:px-8 text-center">
          <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-3">Phản Hồi</p>
          <h1 className="font-serif font-bold text-4xl leading-tight mb-3">Đánh Giá Khách Hàng</h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={24} className="text-amber-400 fill-amber-400" />
            ))}
            <span className="text-white font-bold text-xl ml-1">4.9/5</span>
          </div>
          <p className="text-stone-400 text-sm">Từ 200+ đánh giá thực tế</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          {/* Video reviews */}
          <div className="mb-12">
            <h2 className="font-serif font-bold text-stone-900 text-2xl mb-6">Video Đánh Giá</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {PLACEHOLDER_REVIEWS.filter((r) => r.has_video).map((review) => (
                <div key={review.id} className="group overflow-hidden rounded-xl border border-border hover:shadow-card-hover transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center group-hover:bg-brand/80 group-hover:scale-110 transition-all duration-300">
                      <Play size={22} className="text-stone-800 group-hover:text-white ml-1 transition-colors" />
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-stone-900 text-sm">{review.customer_name}</p>
                    <p className="text-stone-500 text-xs mt-1 line-clamp-2">{review.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Text reviews */}
          <div>
            <h2 className="font-serif font-bold text-stone-900 text-2xl mb-6">Nhận Xét Từ Khách Hàng</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {PLACEHOLDER_REVIEWS.map((review) => (
                <div key={review.id} className="p-5 bg-stone-50 rounded-xl border border-border">
                  <div className="flex items-center gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed mb-3 line-clamp-3">"{review.content}"</p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-stone-900 text-xs">{review.customer_name}</p>
                    <span className={`text-xs font-medium ${SOURCE_COLORS[review.source]}`}>
                      {SOURCE_LABELS[review.source]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
