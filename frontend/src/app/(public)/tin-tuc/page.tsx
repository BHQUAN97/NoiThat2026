import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tin Tức & Kinh Nghiệm Nội Thất — Nội Thất Duy Mạnh',
  description: 'Kinh nghiệm chọn tủ bếp, so sánh các loại vật liệu, xu hướng nội thất mới nhất và bảng giá nội thất cập nhật.',
}

const CATEGORIES = [
  { label: 'Tất Cả', value: '' },
  { label: 'Kinh Nghiệm Chọn Tủ Bếp', value: 'kinh-nghiem' },
  { label: 'So Sánh Vật Liệu', value: 'so-sanh' },
  { label: 'Xu Hướng Nội Thất', value: 'xu-huong' },
  { label: 'Báo Giá & Chi Phí', value: 'bao-gia' },
]

// Placeholder bài viết
const PLACEHOLDER_POSTS = Array.from({ length: 9 }, (_, i) => ({
  id: String(i + 1),
  slug: `bai-viet-${i + 1}`,
  title: [
    'So Sánh Tủ Bếp Inox 304 vs Tủ Bếp MDF — Nên Chọn Loại Nào?',
    'Xu Hướng Thiết Kế Tủ Bếp 2024 — Màu Sắc Và Phong Cách Nổi Bật',
    'Chi Phí Làm Tủ Bếp Trọn Bộ Hết Bao Nhiêu Tiền? Bảng Giá Chi Tiết',
    'Kinh Nghiệm Chọn Tủ Bếp Acrylic — Ưu Nhược Điểm Cần Biết',
    'Tủ Bếp Inox 304 Có Thực Sự Tốt? Review Thực Tế Sau 5 Năm Sử Dụng',
    'Cách Bố Trí Bếp Hình Chữ L Tối Ưu Không Gian Nhỏ',
    'Giá Làm Tủ Bếp Tại Hà Nội 2024 — Cập Nhật Mới Nhất',
    'Nên Chọn Tủ Bếp Cánh Kính Hay Cánh Gỗ? Phân Tích Chi Tiết',
    'Bảo Quản Và Vệ Sinh Tủ Bếp Inox — Hướng Dẫn Chi Tiết',
  ][i],
  summary: 'Bài viết kinh nghiệm và tư vấn chuyên sâu từ đội ngũ Nội Thất Duy Mạnh...',
  thumbnail_url: null as string | null,
  category: CATEGORIES[1 + (i % 4)].label,
  published_at: new Date(2024, 11 - (i % 6), 15 - i).toISOString(),
}))

export default function NewsPage() {
  return (
    <>
      <section className="py-16 bg-stone-900 text-white">
        <div className="max-w-content mx-auto px-4 lg:px-8 text-center">
          <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-3">Blog</p>
          <h1 className="font-serif font-bold text-4xl leading-tight mb-3">Tin Tức & Kinh Nghiệm</h1>
          <p className="text-stone-300">Chia sẻ kiến thức, kinh nghiệm và xu hướng nội thất mới nhất</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(({ label }) => (
              <button
                key={label}
                className="px-4 py-2 rounded-full text-sm font-medium bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Posts grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLACEHOLDER_POSTS.map((post) => (
              <Link
                key={post.id}
                href={`/tin-tuc/${post.slug}`}
                className="group overflow-hidden rounded-xl border border-border hover:shadow-card-hover transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="aspect-[16/9] bg-gradient-to-br from-stone-200 to-stone-300 overflow-hidden">
                  <div className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <span className="text-brand text-xs font-semibold uppercase tracking-wide">{post.category}</span>
                  <h2 className="font-semibold text-stone-900 text-sm mt-1 mb-2 line-clamp-2 group-hover:text-brand transition-colors">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-1 text-stone-400 text-xs">
                    <Calendar size={11} />
                    {new Date(post.published_at).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination placeholder */}
          <div className="flex justify-center gap-2 mt-10">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`w-9 h-9 rounded text-sm font-medium transition-colors ${
                  page === 1 ? 'bg-brand text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {page}
              </button>
            ))}
            <button className="w-9 h-9 rounded flex items-center justify-center bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
