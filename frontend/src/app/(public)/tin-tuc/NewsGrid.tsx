'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import api from '@/lib/api'
import { getListData, getPaginationMeta } from '@/lib/api-response'
import type { News, PaginationMeta } from '@/types'

export function NewsGrid() {
  const [items, setItems] = useState<News[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(false)

    async function load() {
      try {
        const res = await api.get(`/news?page=${page}&limit=12`) as unknown
        const data = getListData<News>(res)
        const pagination = getPaginationMeta(res, { page, limit: 12 })
        if (alive) {
          setItems(data)
          setMeta(pagination)
        }
      } catch {
        if (alive) setError(true)
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
        ) : error || items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center text-on-surface-variant">
            <p className="font-label text-xs uppercase tracking-widest">
              {error ? 'Không thể tải bài viết. Vui lòng thử lại sau.' : 'Chưa có bài viết nào.'}
            </p>
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
