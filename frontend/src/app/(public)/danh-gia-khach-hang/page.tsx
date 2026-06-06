import type { Metadata } from 'next'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { getServerApiUrl } from '@/lib/api-url'
import { getListData } from '@/lib/api-response'
import type { Review } from '@/types'

export const metadata: Metadata = {
  title: 'Đánh giá khách hàng - Nội Thất Duy Mạnh',
  description: 'Xem đánh giá thực tế từ khách hàng đã sử dụng sản phẩm Nội Thất Duy Mạnh. 500+ công trình hoàn thành, 98% hài lòng.',
}

const FALLBACK_REVIEWS: Review[] = [
  { id: '1', customer_name: 'Chị Nguyễn Thị Lan', location: 'Hà Nội', rating: 5, content: 'Tủ bếp Inox 304 chất lượng rất tốt, thợ thi công chuyên nghiệp, đúng hẹn. Gia đình rất hài lòng.', avatar_url: null, is_active: true, is_featured: true, sort_order: 1, created_at: '', updated_at: '' },
  { id: '2', customer_name: 'Anh Trần Văn Hùng', location: 'Bắc Ninh', rating: 5, content: 'Rất hài lòng với dịch vụ. Anh bên xưởng tư vấn nhiệt tình, giá hợp lý hơn nhiều nơi khác.', avatar_url: null, is_active: true, is_featured: true, sort_order: 2, created_at: '', updated_at: '' },
  { id: '3', customer_name: 'Chị Phạm Thu Hương', location: 'Hưng Yên', rating: 5, content: 'Tủ Acrylic bóng đẹp như ảnh. Gia đình rất thích, sẽ giới thiệu cho bạn bè và người thân.', avatar_url: null, is_active: true, is_featured: false, sort_order: 3, created_at: '', updated_at: '' },
  { id: '4', customer_name: 'Anh Lê Văn Đức', location: 'Hà Nội', rating: 5, content: 'Đặt hàng lần 2 vì lần trước quá ưng ý. Chất lượng ổn định, đúng theo bản vẽ thiết kế.', avatar_url: null, is_active: true, is_featured: false, sort_order: 4, created_at: '', updated_at: '' },
  { id: '5', customer_name: 'Chị Hoàng Thị Mai', location: 'Phú Thọ', rating: 5, content: 'Giá cả minh bạch, không phát sinh thêm. Đội thợ dọn dẹp sạch sẽ sau thi công.', avatar_url: null, is_active: true, is_featured: false, sort_order: 5, created_at: '', updated_at: '' },
  { id: '6', customer_name: 'Anh Nguyễn Quang Minh', location: 'Ninh Bình', rating: 5, content: 'Bảo hành chu đáo, gọi là có người đến xử lý ngay. Rất tin tưởng để lâu dài.', avatar_url: null, is_active: true, is_featured: false, sort_order: 6, created_at: '', updated_at: '' },
]

async function getReviews(): Promise<Review[]> {
  try {
    const res = await fetch(`${getServerApiUrl()}/reviews?active=true`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return FALLBACK_REVIEWS
    const data = getListData<Review>(await res.json())
    return data.length > 0 ? data : FALLBACK_REVIEWS
  } catch {
    return FALLBACK_REVIEWS
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-outline-variant'}`}
        />
      ))}
    </div>
  )
}

export default async function ReviewsPage() {
  const reviews = await getReviews()
  const featured = reviews.filter(r => r.is_featured)
  const rest = reviews.filter(r => !r.is_featured)

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-surface px-4 py-20 lg:px-8 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(47,85,85,0.12),transparent_38%),linear-gradient(135deg,#fffdf8_0%,#fbf7f0_54%,#efe5d9_100%)]" />
        <div className="relative mx-auto grid max-w-content items-end gap-8 lg:grid-cols-[0.8fr_1fr]">
          <div>
            <nav className="mb-7 font-label text-xs uppercase tracking-widest text-on-surface-variant">
              <Link href="/" className="transition hover:text-primary">Trang chủ</Link>
              <span className="mx-3 text-outline">/</span>
              <span className="text-primary">Đánh giá</span>
            </nav>
            <p className="mb-4 font-label text-xs uppercase tracking-[0.22em] text-tertiary">Phản hồi</p>
            <h1 className="font-headline text-4xl font-bold leading-tight text-primary md:text-6xl">
              Đánh giá khách hàng
            </h1>
          </div>
          <div className="lg:justify-self-end">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-headline text-3xl font-bold text-primary">4.9/5</span>
            </div>
            <p className="text-body-md text-on-surface-variant">Từ {reviews.length}+ đánh giá thực tế của khách hàng</p>
          </div>
        </div>
      </section>

      {/* ── Đánh giá nổi bật ── */}
      {featured.length > 0 && (
        <section className="bg-surface-bright px-4 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-content">
            <p className="mb-3 font-label text-xs uppercase tracking-[0.22em] text-tertiary">Nổi bật</p>
            <h2 className="mb-8 font-headline text-3xl font-bold text-primary">Đánh giá được chọn lọc</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              {featured.map((review) => (
                <div key={review.id} className="rounded-2xl border border-outline-variant bg-surface p-7 shadow-card">
                  <StarRating rating={review.rating} />
                  <blockquote className="mt-4 text-body-lg italic leading-relaxed text-on-surface">
                    "{review.content}"
                  </blockquote>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-headline text-sm font-bold text-primary">
                      {review.customer_name.split(' ').pop()?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-label text-sm font-bold text-primary">{review.customer_name}</p>
                      {review.location && <p className="font-label text-xs text-on-surface-variant">{review.location}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Tất cả đánh giá ── */}
      <section className={`px-4 py-16 lg:px-8 lg:py-20 ${featured.length > 0 ? 'bg-surface' : 'bg-surface-bright'}`}>
        <div className="mx-auto max-w-content">
          <p className="mb-3 font-label text-xs uppercase tracking-[0.22em] text-tertiary">Nhận xét</p>
          <h2 className="mb-8 font-headline text-3xl font-bold text-primary">
            {featured.length > 0 ? 'Các đánh giá khác' : 'Nhận xét từ khách hàng'}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(rest.length > 0 ? rest : reviews).map((review) => (
              <div key={review.id} className="rounded-xl border border-outline-variant bg-surface p-5 shadow-card">
                <StarRating rating={review.rating} />
                <p className="mt-3 text-body-sm italic leading-relaxed text-on-surface line-clamp-4">
                  "{review.content}"
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="font-label text-xs font-bold text-primary">{review.customer_name}</p>
                    {review.location && <p className="mt-0.5 font-label text-xs text-on-surface-variant">{review.location}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof stats ── */}
      <section className="bg-primary px-4 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-content">
          <div className="grid gap-8 sm:grid-cols-3 text-center">
            {[
              { value: '500+', label: 'Công trình đã hoàn thành' },
              { value: '4.9/5', label: 'Điểm đánh giá trung bình' },
              { value: '98%', label: 'Khách hàng hài lòng' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-headline text-4xl font-bold text-on-primary md:text-5xl">{value}</p>
                <p className="mt-2 font-label text-xs uppercase tracking-widest text-on-primary/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
