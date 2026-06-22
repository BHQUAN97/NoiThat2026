'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, X, Search, ExternalLink, FileText, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import api from '@/lib/api'
import { getResponseData, getListData } from '@/lib/api-response'
import type { PricingItem, PricingTable, News } from '@/types'

type FormState = {
  name: string
  description: string
  detail_url: string
  items: PricingItem[]
  sort_order: string
  is_active: boolean
}

const empty: FormState = {
  name: '',
  description: '',
  detail_url: '',
  items: [],
  sort_order: '0',
  is_active: true,
}

const ITEM_TEMPLATES: Record<string, PricingItem[]> = {
  mdf: [
    { label: 'Tủ dưới', price: '1.500.000 - 2.000.000', unit: 'm dài', note: 'Cánh + ngăn kéo' },
    { label: 'Tủ trên', price: '800.000 - 1.200.000', unit: 'm dài', note: '' },
    { label: 'Phụ kiện cơ bản', price: 'Bao gồm', unit: '', note: 'Bản lề, ray kéo, tay nắm' },
    { label: 'Thi công lắp đặt', price: 'Bao gồm', unit: '', note: '' },
  ],
  acrylic: [
    { label: 'Tủ dưới cánh Acrylic', price: '2.200.000 - 3.000.000', unit: 'm dài', note: 'Bề mặt bóng gương' },
    { label: 'Tủ trên cánh Acrylic', price: '1.200.000 - 1.800.000', unit: 'm dài', note: '' },
    { label: 'Phụ kiện Blum Đức', price: 'Bao gồm', unit: '', note: '' },
    { label: 'Thi công + vệ sinh sau thi công', price: 'Bao gồm', unit: '', note: '' },
  ],
  inox: [
    { label: 'Tủ dưới Inox 304', price: '2.500.000 - 4.000.000', unit: 'm dài', note: 'Khung xương Inox 304' },
    { label: 'Tủ trên Inox 304', price: '1.500.000 - 2.000.000', unit: 'm dài', note: '' },
    { label: 'Khung xương + phụ kiện', price: 'Bao gồm', unit: '', note: '' },
    { label: 'Hàn TIG chuyên dụng', price: 'Bao gồm', unit: '', note: '' },
  ],
}

export default function PricingEditorPage() {
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

    async function load() {
      try {
        const res = await api.get(`/pricing/${id}`) as unknown
        const pricing = getResponseData<PricingTable>(res)
        if (!pricing) throw new Error('Pricing table not found')

        setForm({
          name: pricing.name,
          description: pricing.description || '',
          detail_url: pricing.detail_url || '',
          items: Array.isArray(pricing.items) ? pricing.items : [],
          sort_order: String(pricing.sort_order),
          is_active: pricing.is_active,
        })
      } catch {
        setError('Không tải được dữ liệu bảng giá.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id, isNew])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    if (!form.name.trim()) {
      setError('Tên gói không được để trống.')
      return
    }

    const items = form.items
      .map((item) => ({
        label: item.label.trim(),
        price: item.price.trim(),
        unit: item.unit?.trim() || '',
        note: item.note?.trim() || '',
      }))
      .filter((item) => item.label)

    if (items.length === 0) {
      setError('Vui lòng nhập ít nhất một hạng mục báo giá.')
      return
    }

    setSaving(true)
    try {
      const body = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        detail_url: form.detail_url.trim() || null,
        items,
        sort_order: Number(form.sort_order) || 0,
        is_active: form.is_active,
      }

      if (isNew) await api.post('/pricing', body)
      else await api.put(`/pricing/${id}`, body)

      router.push('/admin/pricing')
    } catch {
      setError('Lưu bảng giá thất bại.')
    } finally {
      setSaving(false)
    }
  }

  function addItem() {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { label: '', price: '', unit: '', note: '' }],
    }))
  }

  function removeItem(index: number) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  function updateItem(index: number, field: keyof PricingItem, value: string) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? { ...item, [field]: value } : item),
    }))
  }

  function applyTemplate(key: keyof typeof ITEM_TEMPLATES) {
    setForm((prev) => ({
      ...prev,
      items: ITEM_TEMPLATES[key].map((item) => ({ ...item })),
    }))
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/pricing" className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold text-stone-800">{isNew ? 'Thêm bảng giá mới' : 'Sửa bảng giá'}</h1>
      </div>

      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-stone-700">Thông tin chung</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Tên gói *</label>
              <input
                type="text"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                placeholder="Tủ bếp MDF phủ Melamine"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Ghi chú/mô tả gói</label>
              <textarea
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                rows={3}
                placeholder="Giá tham khảo, chưa bao gồm VAT. Thực tế phụ thuộc kích thước và thiết kế."
              />
            </div>
            <ArticlePicker
              value={form.detail_url}
              onChange={(url) => setForm((prev) => ({ ...prev, detail_url: url }))}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-semibold text-stone-700">Hạng mục báo giá</h2>
              <p className="mt-1 text-xs text-stone-400">
                Dữ liệu này hiển thị trực tiếp ngoài trang Báo giá. Nên nhập đủ tên, giá, đơn vị và ghi chú.
              </p>
            </div>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 hover:bg-amber-100"
            >
              <Plus className="h-3.5 w-3.5" />
              Thêm dòng
            </button>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            <button type="button" onClick={() => applyTemplate('mdf')} className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-200">
              Mẫu MDF
            </button>
            <button type="button" onClick={() => applyTemplate('acrylic')} className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-200">
              Mẫu Acrylic
            </button>
            <button type="button" onClick={() => applyTemplate('inox')} className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-200">
              Mẫu Inox 304
            </button>
          </div>

          {form.items.length === 0 ? (
            <p className="rounded-xl bg-stone-50 px-4 py-8 text-center text-sm text-stone-400">
              Chưa có hạng mục nào. Chọn mẫu nhanh hoặc nhấn "Thêm dòng".
            </p>
          ) : (
            <div className="space-y-3">
              <div className="hidden grid-cols-12 gap-2 px-1 text-xs font-medium uppercase text-stone-400 md:grid">
                <div className="col-span-4">Tên hạng mục</div>
                <div className="col-span-3">Giá</div>
                <div className="col-span-2">Đơn vị</div>
                <div className="col-span-2">Ghi chú</div>
                <div className="col-span-1" />
              </div>

              {form.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 gap-2 rounded-xl border border-stone-100 p-3 md:grid-cols-12 md:items-center md:border-0 md:p-0">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(event) => updateItem(index, 'label', event.target.value)}
                    className="rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none md:col-span-4"
                    placeholder="Tên hạng mục, ví dụ: Tủ bếp dưới"
                  />
                  <input
                    type="text"
                    value={item.price}
                    onChange={(event) => updateItem(index, 'price', event.target.value)}
                    className="rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none md:col-span-3"
                    placeholder="Giá, ví dụ: 2.500.000 - 3.000.000"
                  />
                  <input
                    type="text"
                    value={item.unit || ''}
                    onChange={(event) => updateItem(index, 'unit', event.target.value)}
                    className="rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none md:col-span-2"
                    placeholder="Đơn vị: m dài"
                  />
                  <input
                    type="text"
                    value={item.note || ''}
                    onChange={(event) => updateItem(index, 'note', event.target.value)}
                    className="rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none md:col-span-2"
                    placeholder="Ghi chú"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-500 md:col-span-1"
                  >
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
              <label className="mb-1 block text-sm font-medium text-stone-700">Thứ tự</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(event) => setForm((prev) => ({ ...prev, sort_order: event.target.value }))}
                className="w-24 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(event) => setForm((prev) => ({ ...prev, is_active: event.target.checked }))}
                  className="h-4 w-4 rounded"
                />
                <span className="text-sm text-stone-700">Hiển thị</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={saving}>{isNew ? 'Tạo bảng giá' : 'Lưu thay đổi'}</Button>
          <Link href="/admin/pricing"><Button type="button" variant="outline">Hủy</Button></Link>
        </div>
      </form>
    </div>
  )
}

// ─── Article Picker ──────────────────────────────────────────────────────────

function ArticlePicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [articles, setArticles] = useState<News[]>([])
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'article' | 'manual'>(value && !value.startsWith('/tin-tuc/') ? 'manual' : 'article')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/news/admin/all?limit=100') as unknown
        setArticles(getListData<News>(res))
      } catch { /* keep empty */ }
    }
    load()
  }, [])

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const selectedSlug = value?.startsWith('/tin-tuc/') ? value.slice('/tin-tuc/'.length) : null
  const selectedArticle = selectedSlug ? articles.find((a) => a.slug === selectedSlug) : null

  const filtered = articles.filter((a) =>
    !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.slug.includes(search.toLowerCase()),
  )

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-stone-700">Link xem chi tiết</label>

      {/* Mode tabs */}
      <div className="mb-2 flex gap-1">
        <button
          type="button"
          onClick={() => setMode('article')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${mode === 'article' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}
        >
          Chọn bài viết
        </button>
        <button
          type="button"
          onClick={() => setMode('manual')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${mode === 'manual' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}
        >
          Nhập URL thủ công
        </button>
      </div>

      {mode === 'manual' ? (
        <>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
            placeholder="/tin-tuc/bai-viet-slug hoặc URL đầy đủ"
          />
          <p className="mt-1 text-xs text-stone-400">Để trống = ẩn nút "Xem chi tiết" trên trang Báo Giá.</p>
        </>
      ) : (
        <div ref={ref} className="relative">
          {/* Selected article display / trigger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex w-full items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-left text-sm transition-colors hover:border-stone-300"
          >
            <FileText className="h-4 w-4 shrink-0 text-stone-400" />
            {selectedArticle ? (
              <span className="flex-1 truncate text-stone-800">{selectedArticle.title}</span>
            ) : value && selectedSlug ? (
              <span className="flex-1 truncate text-stone-500">{value}</span>
            ) : (
              <span className="flex-1 text-stone-400">Chọn bài viết...</span>
            )}
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-stone-400" />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-72 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg">
              {/* Search */}
              <div className="flex items-center gap-2 border-b border-stone-100 px-3 py-2">
                <Search className="h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
                  placeholder="Tìm bài viết..."
                  autoFocus
                />
              </div>

              {/* Article list */}
              <div className="max-h-52 overflow-y-auto">
                {/* Clear option */}
                <button
                  type="button"
                  onClick={() => { onChange(''); setOpen(false) }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-stone-400 hover:bg-stone-50"
                >
                  <X className="h-3.5 w-3.5" />
                  Bỏ chọn (ẩn nút)
                </button>

                {filtered.length === 0 ? (
                  <p className="px-3 py-4 text-center text-sm text-stone-400">Không tìm thấy bài viết</p>
                ) : (
                  filtered.map((article) => (
                    <button
                      key={article.id}
                      type="button"
                      onClick={() => { onChange(`/tin-tuc/${article.slug}`); setOpen(false); setSearch('') }}
                      className={`flex w-full items-start gap-2 px-3 py-2.5 text-left transition-colors hover:bg-amber-50 ${selectedSlug === article.slug ? 'bg-amber-50' : ''}`}
                    >
                      {article.thumbnail_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={article.thumbnail_url} alt="" className="mt-0.5 h-8 w-12 shrink-0 rounded object-cover" />
                      ) : (
                        <div className="mt-0.5 flex h-8 w-12 shrink-0 items-center justify-center rounded bg-stone-100">
                          <FileText className="h-3.5 w-3.5 text-stone-400" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-stone-800">{article.title}</p>
                        <p className="truncate text-xs text-stone-400">/tin-tuc/{article.slug}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Create new article */}
              <div className="border-t border-stone-100 p-2">
                <a
                  href="/admin/news/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-stone-50 px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 hover:text-amber-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Tạo bài viết mới
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}

          {/* Current URL hint */}
          {value && (
            <p className="mt-1 flex items-center gap-1 text-xs text-stone-400">
              <span>Link:</span>
              <code className="rounded bg-stone-100 px-1 font-mono">{value}</code>
            </p>
          )}
        </div>
      )}
    </div>
  )
}
