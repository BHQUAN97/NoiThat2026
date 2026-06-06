'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import api from '@/lib/api'
import type { PricingTable, PricingItem } from '@/types'

type FormState = {
  name: string; description: string
  items: PricingItem[]
  sort_order: string; is_active: boolean
}

const empty: FormState = {
  name: '', description: '', items: [], sort_order: '0', is_active: true,
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
    const load = async () => {
      try {
        const res = await api.get(`/pricing/${id}`) as unknown
        const p = (res as { data: PricingTable }).data
        setForm({
          name: p.name, description: p.description || '',
          items: p.items || [], sort_order: String(p.sort_order), is_active: p.is_active,
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
    if (!form.name.trim()) { setError('Tên bảng giá không được để trống.'); return }
    setSaving(true)
    const body = {
      name: form.name.trim(),
      description: form.description || null,
      items: form.items.filter(it => it.label.trim()),
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
    }
    try {
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
    setForm(p => ({ ...p, items: [...p.items, { label: '', price: '', unit: '', note: '' }] }))
  }
  function removeItem(i: number) {
    setForm(p => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }))
  }
  function updateItem(i: number, field: keyof PricingItem, val: string) {
    setForm(p => ({ ...p, items: p.items.map((it, idx) => idx === i ? { ...it, [field]: val } : it) }))
  }

  if (loading) return <div className="flex h-48 items-center justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" /></div>

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
              <input type="text" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                placeholder="Gói Tiêu Chuẩn" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Mô tả</label>
              <textarea value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                rows={2} placeholder="Gỗ công nghiệp MDF, bề mặt Melamine..." />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-stone-700">Hạng mục</h2>
            <button type="button" onClick={addItem}
              className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-sm text-amber-700 hover:bg-amber-100">
              <Plus className="h-3.5 w-3.5" />Thêm dòng
            </button>
          </div>

          {form.items.length === 0 ? (
            <p className="py-4 text-center text-sm text-stone-400">Chưa có hạng mục nào. Nhấn &quot;Thêm dòng&quot; để bắt đầu.</p>
          ) : (
            <div className="space-y-2">
              {/* Header */}
              <div className="grid grid-cols-12 gap-2 px-1 text-xs font-medium uppercase text-stone-400">
                <div className="col-span-4">Tên hạng mục</div>
                <div className="col-span-3">Giá</div>
                <div className="col-span-2">Đơn vị</div>
                <div className="col-span-2">Ghi chú</div>
                <div className="col-span-1" />
              </div>
              {form.items.map((it, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <input type="text" value={it.label} onChange={e => updateItem(i, 'label', e.target.value)}
                    className="col-span-4 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                    placeholder="Tủ bếp dưới" />
                  <input type="text" value={it.price} onChange={e => updateItem(i, 'price', e.target.value)}
                    className="col-span-3 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                    placeholder="2,500,000" />
                  <input type="text" value={it.unit || ''} onChange={e => updateItem(i, 'unit', e.target.value)}
                    className="col-span-2 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                    placeholder="m dài" />
                  <input type="text" value={it.note || ''} onChange={e => updateItem(i, 'note', e.target.value)}
                    className="col-span-2 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                    placeholder="(ghi chú)" />
                  <button type="button" onClick={() => removeItem(i)}
                    className="col-span-1 flex h-10 w-10 items-center justify-center rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-500">
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
              <input type="number" value={form.sort_order}
                onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))}
                className="w-24 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none" />
            </div>
            <div className="flex items-end">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={form.is_active}
                  onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} className="h-4 w-4 rounded" />
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
