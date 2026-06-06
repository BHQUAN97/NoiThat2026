'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, AlertCircle, Loader2, Plus, X } from 'lucide-react'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { GalleryEditor, type GalleryImage } from '@/components/admin/GalleryEditor'
import { RichTextEditor } from '@/components/ui/RichTextEditor'
import api from '@/lib/api'
import { getListData, getResponseData } from '@/lib/api-response'
import type { Product, ProductCategory } from '@/types'

function toSlug(str: string) {
  return str.toLowerCase().normalize('NFD')
    .replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

type SpecEntry = { key: string; value: string }
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

type FormState = {
  name: string; slug: string; category_id: string
  short_description: string; description: string
  thumbnail_url: string; gallery: GalleryImage[]
  specs: SpecEntry[]
  sort_order: string; is_active: boolean; is_featured: boolean
}

const empty: FormState = {
  name: '', slug: '', category_id: '', short_description: '', description: '',
  thumbnail_url: '', gallery: [], specs: [],
  sort_order: '0', is_active: true, is_featured: false,
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 flex-shrink-0 rounded-full transition-colors ${checked ? 'bg-amber-500' : 'bg-stone-200'}`}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'left-4.5 translate-x-0.5' : 'left-0.5'}`} />
    </button>
  )
}

export default function ProductEditorPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const isNew = id === 'new'

  const [form, setForm] = useState<FormState>(empty)
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(!isNew)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const catsRes = await api.get('/product-categories') as unknown
        setCategories(getListData<ProductCategory>(catsRes))

        if (!isNew) {
          const prodRes = await api.get(`/products/${id}`) as unknown
          const p = getResponseData<Product>(prodRes)
          if (!p) throw new Error('not found')
          setForm({
            name: p.name, slug: p.slug, category_id: p.category_id,
            short_description: p.short_description || '',
            description: p.description || '',
            thumbnail_url: p.thumbnail_url || '',
            gallery: (Array.isArray(p.gallery_urls) ? p.gallery_urls : []).map((url: string) => ({
              key: url, mediaId: '', previewUrl: url, caption: '',
            })),
            specs: p.specs && typeof p.specs === 'object'
              ? Object.entries(p.specs as Record<string, unknown>).map(([k, v]) => ({ key: k, value: String(v) }))
              : [],
            sort_order: String(p.sort_order),
            is_active: p.is_active, is_featured: p.is_featured,
          })
        }
      } catch {
        setError('Không tải được dữ liệu.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isNew])

  async function handleSave() {
    setError(null)
    if (!form.name.trim()) { setError('Tên sản phẩm không được để trống.'); return }
    if (!form.category_id) { setError('Vui lòng chọn danh mục.'); return }

    setSaveStatus('saving')
    const specsObj = form.specs.reduce<Record<string, string>>((acc, s) => {
      if (s.key.trim()) acc[s.key.trim()] = s.value
      return acc
    }, {})

    const body = {
      name: form.name.trim(),
      slug: form.slug.trim() || toSlug(form.name),
      category_id: form.category_id,
      short_description: form.short_description || null,
      description: form.description || null,
      thumbnail_url: form.thumbnail_url || null,
      gallery_urls: form.gallery.filter(g => !g.uploading).map(g => g.previewUrl),
      specs: Object.keys(specsObj).length ? specsObj : null,
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
      is_featured: form.is_featured,
    }

    try {
      if (isNew) {
        await api.post('/products', body)
        setSaveStatus('saved')
        router.push('/admin/products')
      } else {
        await api.put(`/products/${id}`, body)
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      }
    } catch {
      setSaveStatus('error')
      setError('Lưu sản phẩm thất bại.')
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
        <Link href="/admin/products"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-stone-800">
            {form.name || (isNew ? 'Sản phẩm mới' : 'Sửa sản phẩm')}
          </p>
          <p className="text-[11px] text-stone-400">Sản phẩm · {isNew ? 'Thêm mới' : 'Chỉnh sửa'}</p>
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
          {isNew ? 'Tạo mới' : 'Lưu'}
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
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Thông tin sản phẩm</h2>
              <div className="space-y-3.5">
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-600">Tên sản phẩm *</label>
                  <input type="text" value={form.name}
                    onChange={e => {
                      const name = e.target.value
                      setForm(p => ({ ...p, name, slug: isNew ? toSlug(name) : p.slug }))
                    }}
                    className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                    placeholder="Tủ bếp Inox 304 cao cấp" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-600">Slug (URL)</label>
                  <input type="text" value={form.slug}
                    onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                    className="w-full rounded-lg border border-stone-200 px-3 py-2.5 font-mono text-sm transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                    placeholder="tu-bep-inox-304-cao-cap" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-600">Mô tả ngắn</label>
                  <textarea value={form.short_description}
                    onChange={e => field('short_description', e.target.value)}
                    className="w-full resize-none rounded-lg border border-stone-200 px-3 py-2.5 text-sm transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                    rows={2} placeholder="Tóm tắt nhanh về sản phẩm (hiển thị dưới tiêu đề)..." maxLength={500} />
                  <p className="mt-1 text-right text-[11px] text-stone-400">{form.short_description.length}/500</p>
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

            {/* Rich text description */}
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/60">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Mô tả chi tiết</h2>
              <RichTextEditor
                content={form.description}
                onChange={html => field('description', html)}
                placeholder="Viết mô tả chi tiết — vật liệu, quy cách sản xuất, ưu điểm nổi bật..."
              />
            </section>

            {/* Gallery */}
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/60">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Thư viện ảnh sản phẩm</h2>
              <GalleryEditor
                images={form.gallery}
                onChange={gallery => field('gallery', gallery)}
                maxImages={20}
              />
            </section>

            {/* Specs */}
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/60">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Thông số kỹ thuật</h2>
                <button type="button"
                  onClick={() => setForm(p => ({ ...p, specs: [...p.specs, { key: '', value: '' }] }))}
                  className="flex items-center gap-1 rounded-lg bg-stone-100 px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-200">
                  <Plus className="h-3 w-3" /> Thêm dòng
                </button>
              </div>
              {form.specs.length === 0 ? (
                <p className="rounded-lg bg-stone-50 px-4 py-6 text-center text-sm text-stone-400">
                  Chưa có thông số nào. Nhấn &quot;Thêm dòng&quot; để thêm.
                </p>
              ) : (
                <div className="space-y-2">
                  {form.specs.map((s, i) => (
                    <div key={i} className="flex gap-2">
                      <input type="text" value={s.key} placeholder="Tên thông số (VD: Vật liệu)"
                        onChange={e => setForm(p => ({ ...p, specs: p.specs.map((x, j) => j === i ? { ...x, key: e.target.value } : x) }))}
                        className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none" />
                      <input type="text" value={s.value} placeholder="Giá trị"
                        onChange={e => setForm(p => ({ ...p, specs: p.specs.map((x, j) => j === i ? { ...x, value: e.target.value } : x) }))}
                        className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none" />
                      <button type="button"
                        onClick={() => setForm(p => ({ ...p, specs: p.specs.filter((_, j) => j !== i) }))}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-stone-300 hover:bg-red-50 hover:text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/60 lg:sticky lg:top-[57px]">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Cài đặt</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-600">Danh mục *</label>
                  <select value={form.category_id}
                    onChange={e => field('category_id', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-amber-400 focus:outline-none">
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
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
