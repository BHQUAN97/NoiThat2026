'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import api from '@/lib/api'
import type { News } from '@/types'

function toSlug(str: string) {
  return str.toLowerCase().normalize('NFD')
    .replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

type FormState = {
  title: string; slug: string; excerpt: string; content: string
  thumbnail_url: string; is_active: boolean; is_featured: boolean
  published_at: string
}

const empty: FormState = {
  title: '', slug: '', excerpt: '', content: '',
  thumbnail_url: '', is_active: false, is_featured: false,
  published_at: new Date().toISOString().slice(0, 16),
}

export default function NewsEditorPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const isNew = id === 'new'

  const [form, setForm] = useState<FormState>(empty)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isNew) return
    const load = async () => {
      try {
        const res = await api.get(`/news/${id}`) as unknown
        const n = (res as { data: News }).data
        setForm({
          title: n.title, slug: n.slug, excerpt: n.excerpt || '', content: n.content || '',
          thumbnail_url: n.thumbnail_url || '',
          is_active: n.is_active, is_featured: n.is_featured,
          published_at: n.published_at ? new Date(n.published_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        })
      } catch {
        setError('Không tải được dữ liệu.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isNew])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!form.title.trim()) { setError('Tiêu đề không được để trống.'); return }
    setSaving(true)
    const body = {
      title: form.title.trim(),
      slug: form.slug.trim() || toSlug(form.title),
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim() || null,
      thumbnail_url: form.thumbnail_url.trim() || null,
      is_active: form.is_active,
      is_featured: form.is_featured,
      published_at: form.is_active ? new Date(form.published_at).toISOString() : null,
    }
    try {
      if (isNew) await api.post('/news', body)
      else await api.put(`/news/${id}`, body)
      router.push('/admin/news')
    } catch {
      setError('Lưu tin tức thất bại.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex h-48 items-center justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" /></div>

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/news" className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold text-stone-800">{isNew ? 'Thêm tin tức mới' : 'Sửa tin tức'}</h1>
      </div>

      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-stone-700">Thông tin bài viết</h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Tiêu đề *</label>
                <input type="text" value={form.title}
                  onChange={e => {
                    const title = e.target.value
                    setForm(p => ({ ...p, title, slug: isNew ? toSlug(title) : p.slug }))
                  }}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="Tiêu đề bài viết" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Slug</label>
                <input type="text" value={form.slug}
                  onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm font-mono focus:border-amber-400 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Tóm tắt (max 500 ký tự)</label>
              <textarea value={form.excerpt}
                onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                rows={2} maxLength={500} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Nội dung</label>
              <textarea value={form.content}
                onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                rows={12} placeholder="Nội dung bài viết (hỗ trợ Markdown)..." />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">URL ảnh đại diện</label>
              <input type="text" value={form.thumbnail_url}
                onChange={e => setForm(p => ({ ...p, thumbnail_url: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                placeholder="https://..." />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-stone-700">Xuất bản</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Ngày đăng</label>
              <input type="datetime-local" value={form.published_at}
                onChange={e => setForm(p => ({ ...p, published_at: e.target.value }))}
                className="rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none" />
            </div>
            <div className="flex gap-6">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={form.is_active}
                  onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} className="h-4 w-4 rounded" />
                <span className="text-sm text-stone-700">Đã đăng (published)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={form.is_featured}
                  onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))} className="h-4 w-4 rounded" />
                <span className="text-sm text-stone-700">Nổi bật</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={saving}>{isNew ? 'Tạo bài viết' : 'Lưu thay đổi'}</Button>
          <Link href="/admin/news"><Button type="button" variant="outline">Hủy</Button></Link>
        </div>
      </form>
    </div>
  )
}
