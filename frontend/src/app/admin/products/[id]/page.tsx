'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import api from '@/lib/api'
import { getListData, getResponseData } from '@/lib/api-response'
import type { Product, ProductCategory } from '@/types'

function toSlug(str: string) {
  return str.toLowerCase().normalize('NFD')
    .replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

type SpecEntry = { key: string; value: string }

type FormState = {
  name: string; slug: string; category_id: string
  short_description: string; description: string
  thumbnail_url: string; gallery_urls: string[]
  specs: SpecEntry[]
  sort_order: string; is_active: boolean; is_featured: boolean
}

const empty: FormState = {
  name: '', slug: '', category_id: '', short_description: '', description: '',
  thumbnail_url: '', gallery_urls: [], specs: [],
  sort_order: '0', is_active: true, is_featured: false,
}

export default function ProductEditorPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const isNew = id === 'new'

  const [form, setForm] = useState<FormState>(empty)
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newGalleryUrl, setNewGalleryUrl] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [catsRes] = await Promise.all([
          api.get('/product-categories') as Promise<unknown>,
        ])
        setCategories(getListData<ProductCategory>(catsRes))

        if (!isNew) {
          const prodRes = await api.get(`/products/${id}`) as unknown
          const p = getResponseData<Product>(prodRes)
          if (!p) throw new Error('Product not found')
          setForm({
            name: p.name,
            slug: p.slug,
            category_id: p.category_id,
            short_description: p.short_description || '',
            description: p.description || '',
            thumbnail_url: p.thumbnail_url || '',
            gallery_urls: Array.isArray(p.gallery_urls) ? p.gallery_urls : [],
            specs: p.specs && typeof p.specs === 'object' ? Object.entries(p.specs).map(([k, v]) => ({ key: k, value: String(v) })) : [],
            sort_order: String(p.sort_order),
            is_active: p.is_active,
            is_featured: p.is_featured,
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!form.name.trim()) { setError('Tên sản phẩm không được để trống.'); return }
    if (!form.category_id) { setError('Vui lòng chọn danh mục.'); return }

    setSaving(true)
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
      gallery_urls: form.gallery_urls.filter(Boolean),
      specs: Object.keys(specsObj).length ? specsObj : null,
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
      is_featured: form.is_featured,
    }

    try {
      if (isNew) {
        await api.post('/products', body)
      } else {
        await api.put(`/products/${id}`, body)
      }
      router.push('/admin/products')
    } catch {
      setError('Lưu sản phẩm thất bại.')
    } finally {
      setSaving(false)
    }
  }

  function addSpec() {
    setForm(p => ({ ...p, specs: [...p.specs, { key: '', value: '' }] }))
  }
  function removeSpec(i: number) {
    setForm(p => ({ ...p, specs: p.specs.filter((_, idx) => idx !== i) }))
  }
  function updateSpec(i: number, field: 'key' | 'value', val: string) {
    setForm(p => ({ ...p, specs: p.specs.map((s, idx) => idx === i ? { ...s, [field]: val } : s) }))
  }
  function addGallery() {
    if (!newGalleryUrl.trim()) return
    setForm(p => ({ ...p, gallery_urls: [...p.gallery_urls, newGalleryUrl.trim()] }))
    setNewGalleryUrl('')
  }
  function removeGallery(i: number) {
    setForm(p => ({ ...p, gallery_urls: p.gallery_urls.filter((_, idx) => idx !== i) }))
  }

  if (loading) return <div className="flex h-48 items-center justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" /></div>

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/products" className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold text-stone-800">{isNew ? 'Thêm sản phẩm mới' : 'Sửa sản phẩm'}</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-stone-700">Thông tin cơ bản</h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Tên sản phẩm *</label>
                <input type="text" value={form.name}
                  onChange={e => {
                    const name = e.target.value
                    setForm(p => ({ ...p, name, slug: isNew ? toSlug(name) : p.slug }))
                  }}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="Tủ bếp gỗ sồi Pháp" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Slug</label>
                <input type="text" value={form.slug}
                  onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm font-mono focus:border-amber-400 focus:outline-none"
                  placeholder="tu-bep-go-soi-phap" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Danh mục *</label>
              <select value={form.category_id}
                onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none">
                <option value="">-- Chọn danh mục --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Mô tả ngắn</label>
              <textarea value={form.short_description}
                onChange={e => setForm(p => ({ ...p, short_description: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                rows={2} placeholder="Tóm tắt sản phẩm (tối đa 500 ký tự)" maxLength={500} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Mô tả chi tiết</label>
              <textarea value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                rows={6} placeholder="Nội dung chi tiết sản phẩm..." />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-stone-700">Hình ảnh</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Ảnh đại diện (URL)</label>
              <input type="text" value={form.thumbnail_url}
                onChange={e => setForm(p => ({ ...p, thumbnail_url: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                placeholder="https://..." />
              {form.thumbnail_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.thumbnail_url} alt="thumb" className="mt-2 h-24 w-24 rounded-lg object-cover" />
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Thư viện ảnh</label>
              <div className="flex gap-2">
                <input type="text" value={newGalleryUrl}
                  onChange={e => setNewGalleryUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addGallery())}
                  className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="Nhập URL ảnh và nhấn Thêm" />
                <button type="button" onClick={addGallery}
                  className="rounded-lg bg-stone-100 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-200">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {form.gallery_urls.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.gallery_urls.map((url, i) => (
                    <div key={i} className="group relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`gallery-${i}`} className="h-20 w-20 rounded-lg object-cover" />
                      <button type="button" onClick={() => removeGallery(i)}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-stone-700">Thông số kỹ thuật</h2>
            <button type="button" onClick={addSpec}
              className="flex items-center gap-1.5 rounded-lg bg-stone-100 px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-200">
              <Plus className="h-3.5 w-3.5" />Thêm dòng
            </button>
          </div>
          {form.specs.length === 0 ? (
            <p className="text-sm text-stone-400">Chưa có thông số nào.</p>
          ) : (
            <div className="space-y-2">
              {form.specs.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={s.key} placeholder="Tên thông số"
                    onChange={e => updateSpec(i, 'key', e.target.value)}
                    className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none" />
                  <input type="text" value={s.value} placeholder="Giá trị"
                    onChange={e => updateSpec(i, 'value', e.target.value)}
                    className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none" />
                  <button type="button" onClick={() => removeSpec(i)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-500">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-stone-700">Cài đặt</h2>
          <div className="flex flex-wrap gap-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Thứ tự hiển thị</label>
              <input type="number" value={form.sort_order}
                onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))}
                className="w-24 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none" />
            </div>
            <div className="flex items-end gap-6">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={form.is_active}
                  onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))}
                  className="h-4 w-4 rounded" />
                <span className="text-sm text-stone-700">Hiển thị</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={form.is_featured}
                  onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))}
                  className="h-4 w-4 rounded" />
                <span className="text-sm text-stone-700">Nổi bật</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={saving}>{saving ? 'Đang lưu...' : (isNew ? 'Tạo sản phẩm' : 'Lưu thay đổi')}</Button>
          <Link href="/admin/products">
            <Button type="button" variant="outline">Hủy</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
