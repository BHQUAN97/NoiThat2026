'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import api from '@/lib/api'
import { getListData, getPaginationMeta } from '@/lib/api-response'
import type { News, PaginationMeta } from '@/types'

const FALLBACK_NEWS: News[] = [
  {
    id: '1',
    slug: 'so-sanh-tu-bep-inox-vs-mdf',
    title: 'So sánh tủ bếp Inox 304 vs tủ bếp MDF — nên chọn loại nào?',
    excerpt: 'Phân tích ưu nhược điểm từng loại vật liệu để giúp bạn chọn đúng tủ bếp phù hợp ngân sách và không gian.',
    thumbnail_url: null,
    is_active: true,
    is_featured: false,
    published_at: new Date(2024, 10, 15).toISOString(),
    created_at: new Date(2024, 10, 15).toISOString(),
    updated_at: new Date(2024, 10, 15).toISOString(),
  },
  {
    id: '2',
    slug: 'xu-huong-tu-bep-2025',
    title: 'Xu hướng thiết kế tủ bếp 2025 — màu sắc và phong cách nổi bật',
    excerpt: 'Các xu hướng nội thất bếp đang dẫn đầu thị trường năm 2025, từ tông màu trung tính đến chất liệu cao cấp.',
    thumbnail_url: null,
    is_active: true,
    is_featured: true,
    published_at: new Date(2024, 10, 10).toISOString(),
    created_at: new Date(2024, 10, 10).toISOString(),
    updated_at: new Date(2024, 10, 10).toISOString(),
  },
  {
    id: '3',
    slug: 'chi-phi-lam-tu-bep-tron-bo',
    title: 'Chi phí làm tủ bếp trọn bộ hết bao nhiêu? Bảng giá chi tiết',
    excerpt: 'Tổng hợp bảng giá tủ bếp theo từng loại vật liệu và diện tích, giúp bạn dự tính ngân sách chính xác.',
    thumbnail_url: null,
    is_active: true,
    is_featured: false,
    published_at: new Date(2024, 10, 5).toISOString(),
    created_at: new Date(2024, 10, 5).toISOString(),
    updated_at: new Date(2024, 10, 5).toISOString(),
  },
]

export function NewsGrid() {
  const [items, setItems] = useState<News[]>(FALLBACK_NEWS)
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    setLoading(true)

    async function load() {
      try {
        const res = await api.get(`/news?page=${page}&limit=12`) as unknown
        const data = getListData<News>(res)
        const pagination = getPaginationMeta(res, { page, limit: 12 })
        if (alive) {
          if (data.length > 0) setItems(data)
          setMeta(pagination)
        }
      } catch {
        // Keep fallback when API is unavailable.
      } finally {
        if (alive) setLoading(false)
      }
    }

    load()
    return () => { alive = false }
  }, [page])

  return (
    <section className="bg-surface-bright px-4 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-content">
        {loading ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-xl bg-surface">
                <div className="aspect-[16/9] bg-surface-container" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-20 rounded bg-surface-container" />
                  <div className="h-5 rounded bg-surface-container" />
                  <div className="h-4 w-3/4 rounded bg-surface-container" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((post) => (
              <Link
                key={post.id}
                href={`/tin-tuc/${post.slug}`}
                className="group overflow-hidden rounded-xl bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-surface-container">
                  {post.thumbnail_url ? (
                    <img
                      src={post.thumbnail_url}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#efe5d9,#b7c7c2)]">
                      <span className="font-label text-xs uppercase tracking-widest text-primary/50">Ảnh bài viết</span>
                    </div>
                  )}
                  {post.is_featured && (
                    <span className="absolute left-3 top-3 rounded-full bg-tertiary/90 px-3 py-1 font-label text-[10px] uppercase tracking-widest text-white">
                      Nổi bật
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="mb-3 flex items-center gap-1.5 text-on-surface-variant">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="font-label text-xs">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                        : '—'}
                    </span>
                  </div>
                  <h2 className="mb-2 font-headline text-lg font-bold leading-snug text-primary line-clamp-2 transition-colors group-hover:text-tertiary">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-body-sm leading-relaxed text-on-surface-variant line-clamp-2">{post.excerpt}</p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1.5 font-label text-xs font-bold uppercase tracking-widest text-tertiary transition-all group-hover:gap-2.5">
                    Đọc tiếp <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-10 min-w-[40px] rounded-lg px-3 font-label text-sm font-medium transition-colors ${
                  p === page
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
