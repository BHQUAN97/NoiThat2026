'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, AlertCircle, Loader2 } from 'lucide-react'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { GalleryEditor, type GalleryImage } from '@/components/admin/GalleryEditor'
import { RichTextEditor } from '@/components/ui/RichTextEditor'
import api from '@/lib/api'
import { PROVINCES } from '@/lib/constants'
import { getResponseData } from '@/lib/api-response'
import type { Project } from '@/types'

function toSlug(str: string) {
  return str.toLowerCase().normalize('NFD')
    .replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

type FormState = {
  name: string; slug: string; province: string; location: string
  area_sqm: string; description: string
  thumbnail_url: string; gallery: GalleryImage[]
  sort_order: string; is_active: boolean; is_featured: boolean
}

const empty: FormState = {
  name: '', slug: '', province: 'Hà Nội', location: '', area_sqm: '',
  description: '', thumbnail_url: '', gallery: [],
  sort_order: '0', is_active: true, is_featured: false,
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 flex-shrink-0 rounded-full transition-colors ${checked ? 'bg-amber-500' : 'bg-stone-200'}`}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
    </button>
  )
}

export default function ProjectEditorPage() {
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
        const res = await api.get(`/projects/${id}`) as unknown
        const p = getResponseData<Project>(res)
        if (!p) throw new Error('not found')
        setForm({
          name: p.name, slug: p.slug,
          province: p.province, location: p.location || '',
          area_sqm: p.area_sqm || '', description: p.description || '',
          thumbnail_url: p.thumbnail_url || '',
          gallery: (Array.isArray(p.gallery_urls) ? p.gallery_urls : []).map((url: string) => ({
            key: url, mediaId: '', previewUrl: url, caption: '',
          })),
          sort_order: String(p.sort_order),
          is_active: p.is_active, is_featured: p.is_featured,
        })
      } catch {
        setError('Không tải được dữ liệu dự án.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isNew])

  async function handleSave() {
    setError(null)
    if (!form.name.trim()) { setError('Tên dự án không được để trống.'); return }

    setSaveStatus('saving')
    const body = {
      name: form.name.trim(),
      slug: form.slug.trim() || toSlug(form.name),
      province: form.province,
      location: form.location || null,
      area_sqm: form.area_sqm || null,
      description: form.description || null,
      thumbnail_url: form.thumbnail_url || null,
      gallery_urls: form.gallery.filter(g => !g.uploading).map(g => g.previewUrl),
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
      is_featured: form.is_featured,
    }
    try {
      if (isNew) {
        await api.post('/projects', body)
        setSaveStatus('saved')
        router.push('/admin/projects')
      } else {
        await api.put(`/projects/${id}`, body)
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      }
    } catch {
      setSaveStatus('error')
      setError('Lưu dự án thất bại.')
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
        <Link href="/admin/projects"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-stone-800">
            {form.name || (isNew ? 'Dự án mới' : 'Sửa dự án')}
          </p>
          <p className="text-[11px] text-stone-400">Dự án thực tế · {isNew ? 'Thêm mới' : 'Chỉnh sửa'}</p>
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
          {isNew ? 'Tạo dự án' : 'Lưu'}
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
            {/* Basic info */}
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/60">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Thông tin dự án</h2>
              <div className="space-y-3.5">
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-600">Tên dự án *</label>
                  <input type="text" value={form.name}
                    onChange={e => {
                      const name = e.target.value
                      setForm(p => ({ ...p, name, slug: isNew ? toSlug(name) : p.slug }))
                    }}
                    className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                    placeholder="Nhà anh Minh — Xã Vân Nam, Phúc Thọ" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-600">Slug (URL)</label>
                  <input type="text" value={form.slug}
                    onChange={e => field('slug', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 px-3 py-2.5 font-mono text-sm transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20" />
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-600">Tỉnh/Thành phố</label>
                    <input type="text" list="province-list" value={form.province}
                      onChange={e => field('province', e.target.value)}
                      className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-amber-400 focus:outline-none" />
                    <datalist id="province-list">
                      {PROVINCES.filter(p => p.value).map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-600">Khu vực cụ thể</label>
                    <input type="text" value={form.location}
                      onChange={e => field('location', e.target.value)}
                      className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-amber-400 focus:outline-none"
                      placeholder="Xã Vân Nam, Phúc Thọ" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-600">Diện tích</label>
                    <input type="text" value={form.area_sqm}
                      onChange={e => field('area_sqm', e.target.value)}
                      className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-amber-400 focus:outline-none"
                      placeholder="45m²" />
                  </div>
                </div>
              </div>
            </section>

            {/* Thumbnail */}
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/60">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Ảnh đại diện</h2>
              <ImageUpload
                value={form.thumbnail_url}
                onChange={url => field('thumbnail_url', url)}
                aspect="4/3"
                label=""
              />
            </section>

            {/* Description */}
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/60">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Mô tả công trình</h2>
              <RichTextEditor
                content={form.description}
                onChange={html => field('description', html)}
                placeholder="Mô tả về công trình — phong cách thiết kế, yêu cầu của gia chủ, vật liệu sử dụng..."
              />
            </section>

            {/* Gallery */}
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/60">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Thư viện ảnh công trình</h2>
              <GalleryEditor
                images={form.gallery}
                onChange={gallery => field('gallery', gallery)}
                maxImages={30}
              />
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/60 lg:sticky lg:top-[57px]">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Cài đặt</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-600">Thứ tự hiển thị</label>
                  <input type="number" value={form.sort_order}
                    onChange={e => field('sort_order', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-amber-400 focus:outline-none" />
                </div>
                <div className="space-y-3 border-t border-stone-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-700">Hiển thị</span>
                    <Toggle checked={form.is_active} onChange={v => field('is_active', v)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-700">Nổi bật</span>
                    <Toggle checked={form.is_featured} onChange={v => field('is_featured', v)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
