'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, AlertCircle, Loader2, Globe, EyeOff } from 'lucide-react'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { RichTextEditor } from '@/components/ui/RichTextEditor'
import api from '@/lib/api'
import type { News } from '@/types'

function toSlug(str: string) {
  return str.toLowerCase().normalize('NFD')
    .replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

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

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 flex-shrink-0 rounded-full transition-colors ${checked ? 'bg-amber-500' : 'bg-stone-200'}`}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
    </button>
  )
}

export default function NewsEditorPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const isNew = id === 'new'

  const [form, setForm] = useState<FormState>(empty)
  const [loading, setLoading] = useState(!isNew)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
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
          published_at: n.published_at
            ? new Date(n.published_at).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16),
        })
      } catch {
        setError('Không tải được dữ liệu bài viết.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isNew])

  async function handleSave() {
    setError(null)
    if (!form.title.trim()) { setError('Tiêu đề không được để trống.'); return }

    setSaveStatus('saving')
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
      if (isNew) {
        await api.post('/news', body)
        setSaveStatus('saved')
        router.push('/admin/news')
      } else {
        await api.put(`/news/${id}`, body)
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      }
    } catch {
      setSaveStatus('error')
      setError('Lưu tin tức thất bại.')
    }
  }

  const field = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm(p => ({ ...p, [k]: v }))

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
    </div>
  )

  return (
    <div className="-mx-4 -mt-1 md:-mx-6">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-stone-200 bg-white/95 px-4 py-3 backdrop-blur md:px-6">
        <Link href="/admin/news"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-stone-800">
            {form.title || (isNew ? 'Bài viết mới' : 'Sửa bài viết')}
          </p>
          <p className="text-[11px] text-stone-400">
            Tin tức · {isNew ? 'Thêm mới' : 'Chỉnh sửa'}
            {form.is_active
              ? <span className="ml-2 inline-flex items-center gap-0.5 text-emerald-600"><Globe className="h-3 w-3" /> Đã đăng</span>
              : <span className="ml-2 inline-flex items-center gap-0.5 text-stone-400"><EyeOff className="h-3 w-3" /> Nháp</span>}
          </p>
        </div>
        {saveStatus !== 'idle' && (
          <span className={`hidden items-center gap-1 text-xs sm:flex ${
            saveStatus === 'saved' ? 'text-emerald-600' : saveStatus === 'error' ? 'text-red-500' : 'text-stone-400'
          }`}>
            {saveStatus === 'saving' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {saveStatus === 'saved' && <Check className="h-3.5 w-3.5" />}
            {saveStatus === 'error' && <AlertCircle className="h-3.5 w-3.5" />}
            {saveStatus === 'saving' ? 'Đang lưu...' : saveStatus === 'saved' ? 'Đã lưu' : 'Lỗi lưu'}
          </span>
        )}
        <button onClick={handleSave} disabled={saveStatus === 'saving'}
          className="flex h-8 items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-60">
          {saveStatus === 'saving'
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : <Check className="h-3.5 w-3.5" />}
          {isNew ? 'Tạo bài viết' : 'Lưu'}
        </button>
      </div>

      <div className="px-4 py-6 md:px-6">
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[1fr_272px]">
          {/* Main column */}
          <div className="space-y-5">
            {/* Thumbnail — large, prominent */}
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/60">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Ảnh bìa bài viết</h2>
              <ImageUpload
                value={form.thumbnail_url}
                onChange={url => field('thumbnail_url', url)}
                aspect="16/9"
                label=""
              />
            </section>

            {/* Title & slug */}
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/60">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Tiêu đề & URL</h2>
              <div className="space-y-3.5">
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-600">Tiêu đề bài viết *</label>
                  <input type="text" value={form.title}
                    onChange={e => {
                      const title = e.target.value
                      setForm(p => ({ ...p, title, slug: isNew ? toSlug(title) : p.slug }))
                    }}
                    className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                    placeholder="Xu hướng thiết kế tủ bếp 2025..." />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-600">Slug (URL)</label>
                  <input type="text" value={form.slug}
                    onChange={e => field('slug', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 px-3 py-2.5 font-mono text-sm transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20" />
                  <p className="mt-1 text-[11px] text-stone-400">
                    URL: /tin-tuc/<span className="font-mono">{form.slug || '...'}</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Excerpt */}
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/60">
              <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-stone-500">Tóm tắt</h2>
              <p className="mb-3 text-[11px] text-stone-400">Hiển thị ở danh sách tin tức và thẻ SEO.</p>
              <textarea value={form.excerpt}
                onChange={e => field('excerpt', e.target.value)}
                className="w-full resize-none rounded-lg border border-stone-200 px-3 py-2.5 text-sm transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                rows={3} maxLength={500}
                placeholder="Tóm tắt ngắn gọn nội dung bài viết (tối đa 500 ký tự)..." />
              <p className="mt-1 text-right text-[11px] text-stone-400">{form.excerpt.length}/500</p>
            </section>

            {/* Rich text content */}
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/60">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Nội dung bài viết</h2>
              <RichTextEditor
                content={form.content}
                onChange={html => field('content', html)}
                placeholder="Bắt đầu viết nội dung bài viết..."
              />
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/60 lg:sticky lg:top-[57px]">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Xuất bản</h2>
              <div className="space-y-4">
                {/* Publish status indicator */}
                <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                  form.is_active
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-stone-100 text-stone-500'
                }`}>
                  {form.is_active
                    ? <><Globe className="h-4 w-4" /> Đã đăng công khai</>
                    : <><EyeOff className="h-4 w-4" /> Đang lưu nháp</>}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-600">Ngày đăng</label>
                  <input type="datetime-local" value={form.published_at}
                    onChange={e => field('published_at', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-amber-400 focus:outline-none" />
                </div>

                <div className="space-y-3 border-t border-stone-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-700">Đăng công khai</span>
                    <Toggle checked={form.is_active} onChange={v => field('is_active', v)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-700">Nổi bật</span>
                    <Toggle checked={form.is_featured} onChange={v => field('is_featured', v)} />
                  </div>
                </div>

                <button onClick={handleSave} disabled={saveStatus === 'saving'}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60">
                  {saveStatus === 'saving' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  {isNew ? 'Tạo bài viết' : 'Lưu thay đổi'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
