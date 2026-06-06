'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import api from '@/lib/api'
import { PROVINCES } from '@/lib/constants'
import { getResponseData } from '@/lib/api-response'
import type { Project } from '@/types'

function toSlug(str: string) {
  return str.toLowerCase().normalize('NFD')
    .replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

type FormState = {
  name: string; slug: string; province: string; location: string
  area_sqm: string; description: string
  thumbnail_url: string; gallery_urls: string[]
  sort_order: string; is_active: boolean; is_featured: boolean
}

const empty: FormState = {
  name: '', slug: '', province: 'Hà Nội', location: '', area_sqm: '',
  description: '', thumbnail_url: '', gallery_urls: [],
  sort_order: '0', is_active: true, is_featured: false,
}

export default function ProjectEditorPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const isNew = id === 'new'

  const [form, setForm] = useState<FormState>(empty)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newGalleryUrl, setNewGalleryUrl] = useState('')

  useEffect(() => {
    if (isNew) return
    const load = async () => {
      try {
        const res = await api.get(`/projects/${id}`) as unknown
        const p = getResponseData<Project>(res)
        if (!p) throw new Error('Project not found')
        setForm({
          name: p.name, slug: p.slug,
          province: p.province, location: p.location || '',
          area_sqm: p.area_sqm || '', description: p.description || '',
          thumbnail_url: p.thumbnail_url || '',
          gallery_urls: Array.isArray(p.gallery_urls) ? p.gallery_urls : [],
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!form.name.trim()) { setError('Tên dự án không được để trống.'); return }

    setSaving(true)
    const body = {
      name: form.name.trim(),
      slug: form.slug.trim() || toSlug(form.name),
      province: form.province,
      location: form.location || null,
      area_sqm: form.area_sqm || null,
      description: form.description || null,
      thumbnail_url: form.thumbnail_url || null,
      gallery_urls: form.gallery_urls.filter(Boolean),
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
      is_featured: form.is_featured,
    }
    try {
      if (isNew) {
        await api.post('/projects', body)
      } else {
        await api.put(`/projects/${id}`, body)
      }
      router.push('/admin/projects')
    } catch {
      setError('Lưu dự án thất bại.')
    } finally {
      setSaving(false)
    }
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
        <Link href="/admin/projects" className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold text-stone-800">{isNew ? 'Thêm dự án mới' : 'Sửa dự án'}</h1>
      </div>

      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-stone-700">Thông tin dự án</h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Tên dự án *</label>
                <input type="text" value={form.name}
                  onChange={e => {
                    const name = e.target.value
                    setForm(p => ({ ...p, name, slug: isNew ? toSlug(name) : p.slug }))
                  }}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="Nhà anh Minh - Phúc Thọ" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Slug</label>
                <input type="text" value={form.slug}
                  onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm font-mono focus:border-amber-400 focus:outline-none" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Tỉnh/Thành phố</label>
                <input
                  type="text"
                  list="province-options"
                  value={form.province}
                  onChange={e => setForm(p => ({ ...p, province: e.target.value }))}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="Hà Nội"
                />
                <datalist id="province-options">
                  {PROVINCES.filter(p => p.value).map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </datalist>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Khu vực</label>
                <input type="text" value={form.location}
                  onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="Xã Vân Nam, Phúc Thọ" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Diện tích</label>
                <input type="text" value={form.area_sqm}
                  onChange={e => setForm(p => ({ ...p, area_sqm: e.target.value }))}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="45m²" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Mô tả</label>
              <textarea value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                rows={3} />
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
                <img src={form.thumbnail_url} alt="thumb" className="mt-2 h-24 w-32 rounded-lg object-cover" />
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Thư viện ảnh</label>
              <div className="flex gap-2">
                <input type="text" value={newGalleryUrl}
                  onChange={e => setNewGalleryUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addGallery())}
                  className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="Nhập URL ảnh" />
                <button type="button" onClick={addGallery}
                  className="rounded-lg bg-stone-100 px-4 py-2 text-sm hover:bg-stone-200">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {form.gallery_urls.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.gallery_urls.map((url, i) => (
                    <div key={i} className="group relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`g-${i}`} className="h-20 w-20 rounded-lg object-cover" />
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
          <h2 className="mb-4 font-semibold text-stone-700">Cài đặt</h2>
          <div className="flex flex-wrap gap-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Thứ tự</label>
              <input type="number" value={form.sort_order}
                onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))}
                className="w-24 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none" />
            </div>
            <div className="flex items-end gap-6">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={form.is_active}
                  onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} className="h-4 w-4 rounded" />
                <span className="text-sm text-stone-700">Hiển thị</span>
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
          <Button type="submit" loading={saving}>{isNew ? 'Tạo dự án' : 'Lưu thay đổi'}</Button>
          <Link href="/admin/projects"><Button type="button" variant="outline">Hủy</Button></Link>
        </div>
      </form>
    </div>
  )
}
