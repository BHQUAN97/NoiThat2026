'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

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
  autoplay?: boolean
  autoplayInterval?: number
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
  autoplay = true,
  autoplayInterval = 5,
}: CustomerReviewsProps) {
  const displayReviews = reviews.length > 0 ? reviews.slice(0, limit) : PLACEHOLDER_REVIEWS.slice(0, limit)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const hasCarousel = displayReviews.length > 1

  const scroll = useCallback((dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.querySelector<HTMLElement>('[data-review-card]')?.offsetWidth || 320
    const gap = 24
    el.scrollBy({ left: dir === 'right' ? cardWidth + gap : -(cardWidth + gap), behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (!hasCarousel || !autoplay || paused) return
    const el = scrollRef.current
    if (!el) return
    const id = setInterval(() => {
      const maxScroll = el.scrollWidth - el.clientWidth
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        scroll('right')
      }
    }, autoplayInterval * 1000)
    return () => clearInterval(id)
  }, [hasCarousel, autoplay, autoplayInterval, paused, scroll])

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

        {hasCarousel ? (
          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
          >
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {displayReviews.map((review) => (
                <div
                  key={review.id}
                  data-review-card
                  className="w-[85vw] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>

            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-ambient-sm text-stone-600 hover:text-primary transition-colors"
              aria-label="Trước"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-ambient-sm text-stone-600 hover:text-primary transition-colors"
              aria-label="Tiếp"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-card border border-border h-full">
      <div className="flex items-center gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-300'}
          />
        ))}
      </div>

      <p className="text-stone-600 text-sm leading-relaxed mb-4 line-clamp-4">
        &ldquo;{review.content}&rdquo;
      </p>

      <div className="flex items-center gap-3 pt-3 border-t border-border mt-auto">
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
  )
}
