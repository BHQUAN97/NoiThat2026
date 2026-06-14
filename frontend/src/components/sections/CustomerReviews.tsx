import { Star } from 'lucide-react'

interface Review {
  id: string
  customer_name: string
  content: string
  rating: number
  avatar_url: string | null
  source: 'facebook' | 'google' | 'direct' | 'video'
}

interface CustomerReviewsProps {
  reviews?: Review[]
  label?: string
  title?: string
  desc?: string
  limit?: number
}

const PLACEHOLDER_REVIEWS: Review[] = [
  {
    id: '1',
    customer_name: 'Chị Nguyễn Thị Lan',
    content: 'Gia đình tôi rất hài lòng với bộ tủ bếp Inox 304 từ xưởng Duy Mạnh. Chất lượng thật sự tốt, làm rất cẩn thận, không có lỗi hàn. Thợ thi công nhiệt tình, dọn dẹp sạch sẽ sau khi xong.',
    rating: 5,
    avatar_url: null,
    source: 'facebook',
  },
  {
    id: '2',
    customer_name: 'Anh Trần Văn Hùng',
    content: 'Tôi đã đặt tủ quần áo và vách tivi. Giá hợp lý, đúng theo bản vẽ thiết kế, bảo hành rõ ràng. Sẽ giới thiệu cho bạn bè.',
    rating: 5,
    avatar_url: null,
    source: 'google',
  },
  {
    id: '3',
    customer_name: 'Chị Phạm Thu Hương',
    content: 'Rất hài lòng với dịch vụ tư vấn nhiệt tình. Anh bên xưởng đến tận nhà đo và tư vấn miễn phí, không hề ép buộc. Tủ bếp Acrylic rất đẹp, sáng bóng như ảnh.',
    rating: 5,
    avatar_url: null,
    source: 'direct',
  },
]

const SOURCE_LABELS = {
  facebook: 'Facebook',
  google: 'Google',
  direct: 'Trực tiếp',
  video: 'Video',
}

export function CustomerReviews({
  reviews = [],
  label = 'Phản Hồi',
  title = 'Khách Hàng Nói Gì?',
  desc = 'Hơn 500 công trình hoàn thành, mỗi khách hàng là một câu chuyện thành công.',
  limit = 6,
}: CustomerReviewsProps) {
  const displayReviews = (reviews.length > 0 ? reviews.slice(0, limit) : PLACEHOLDER_REVIEWS.slice(0, limit))

  return (
    <section className="py-16 md:py-20 bg-stone-50">
      <div className="max-w-content mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-3">{label}</p>
          <h2 className="font-serif font-bold text-stone-900 text-3xl md:text-4xl leading-tight mb-3">
            {title}
          </h2>
          <p className="text-stone-500">{desc}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-6 shadow-card border border-border"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-300'}
                  />
                ))}
              </div>

              {/* Review text */}
              <p className="text-stone-600 text-sm leading-relaxed mb-4 line-clamp-4">
                "{review.content}"
              </p>

              {/* Customer info */}
              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                  <span className="font-semibold text-brand text-sm">
                    {review.customer_name.charAt(review.customer_name.lastIndexOf(' ') + 1)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-stone-900 text-sm">{review.customer_name}</p>
                  <p className="text-stone-400 text-xs">{SOURCE_LABELS[review.source]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
