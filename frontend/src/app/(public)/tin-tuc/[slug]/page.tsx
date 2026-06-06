'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Calendar, ArrowLeft, Clock } from 'lucide-react'
import api from '@/lib/api'
import type { News } from '@/types'

function estimateReadTime(content?: string | null) {
  if (!content) return null
  const words = content.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} phút đọc`
}

export default function NewsDetailPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [post, setPost] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    let alive = true

    async function load() {
      try {
        const res = await api.get(`/news/slug/${slug}`) as unknown
        const data = (res as { data?: News } | News)
        const item = ('data' in data && data.data) ? data.data : data as News
        if (alive) setPost(item)
      } catch {
        if (alive) setNotFound(true)
      } finally {
        if (alive) setLoading(false)
      }
    }

    load()
    return () => { alive = false }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-32 rounded bg-surface-container" />
            <div className="aspect-[16/9] rounded-2xl bg-surface-container" />
            <div className="space-y-3">
              <div className="h-8 rounded bg-surface-container" />
              <div className="h-6 w-3/4 rounded bg-surface-container" />
            </div>
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`h-4 rounded bg-surface-container ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 bg-surface px-4 text-center">
        <p className="font-label text-xs uppercase tracking-widest text-tertiary">404</p>
        <h1 className="font-headline text-3xl font-bold text-primary">Bài viết không tồn tại</h1>
        <p className="text-on-surface-variant">Bài viết có thể đã bị xóa hoặc đường dẫn không đúng.</p>
        <Link href="/tin-tuc" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-label text-sm font-bold uppercase tracking-widest text-on-primary transition hover:opacity-90">
          <ArrowLeft className="h-4 w-4" />
          Về trang tin tức
        </Link>
      </div>
    )
  }

  const readTime = estimateReadTime(post.content)

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero thumbnail */}
      {post.thumbnail_url && (
        <div className="relative h-[40vh] max-h-[480px] overflow-hidden bg-surface-container lg:h-[55vh]">
          <img
            src={post.thumbnail_url}
            alt={post.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8 lg:py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 font-label text-xs uppercase tracking-widest text-on-surface-variant">
          <Link href="/" className="transition hover:text-primary">Trang chủ</Link>
          <span className="text-outline">/</span>
          <Link href="/tin-tuc" className="transition hover:text-primary">Tin tức</Link>
          <span className="text-outline">/</span>
          <span className="truncate text-primary">{post.title}</span>
        </nav>

        {/* Title */}
        <h1 className="mb-6 font-headline text-3xl font-bold leading-tight text-primary md:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="mb-8 flex flex-wrap items-center gap-5 border-b border-outline-variant pb-8">
          {post.published_at && (
            <span className="flex items-center gap-1.5 text-on-surface-variant">
              <Calendar className="h-4 w-4" />
              <span className="font-label text-sm">
                {new Date(post.published_at).toLocaleDateString('vi-VN', {
                  day: '2-digit', month: 'long', year: 'numeric',
                })}
              </span>
            </span>
          )}
          {readTime && (
            <span className="flex items-center gap-1.5 text-on-surface-variant">
              <Clock className="h-4 w-4" />
              <span className="font-label text-sm">{readTime}</span>
            </span>
          )}
          {post.is_featured && (
            <span className="rounded-full bg-tertiary/15 px-3 py-1 font-label text-xs font-bold uppercase tracking-widest text-tertiary">
              Nổi bật
            </span>
          )}
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mb-8 rounded-xl border-l-4 border-tertiary bg-surface-container pl-5 pr-4 py-4 text-body-lg italic leading-relaxed text-on-surface-variant">
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        {post.content ? (
          <div className="prose-custom text-body-base leading-[1.85] text-on-surface whitespace-pre-wrap">
            {post.content}
          </div>
        ) : (
          <p className="text-on-surface-variant">Nội dung đang được cập nhật...</p>
        )}

        {/* Back */}
        <div className="mt-16 border-t border-outline-variant pt-8">
          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-2 font-label text-sm font-bold uppercase tracking-widest text-primary transition-all hover:gap-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Xem tất cả bài viết
          </Link>
        </div>
      </div>
    </div>
  )
}
