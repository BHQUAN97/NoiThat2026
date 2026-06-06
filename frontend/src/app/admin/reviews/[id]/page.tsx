'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import api from '@/lib/api'
import type { Review } from '@/types'

type FormState = {
  customer_name: string; location: string; rating: number
  content: string; avatar_url: string
  is_active: boolean; is_featured: boolean; sort_order: string
}

const empty: FormState = {
  customer_name: '', location: '', rating: 5, content: '',
  avatar_url: '', is_active: true, is_featured: false, sort_order: '0',
}

export default function ReviewEditorPage() {
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
        const res = await api.get(`/reviews/${id}`) as unknown
        const r = (res as { data: Review }).data
        setForm({
          customer_name: r.customer_name, location: r.location || '',
          rating: r.rating, content: r.content,
          avatar_url: r.avatar_url || '',
          is_active: r.is_active, is_featured: r.is_featured,
          sort_order: String(r.sort_order),
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
    if (!form.customer_name.trim()) { setError('Tên khách hàng không được để trống.'); return }
    if (!form.content.trim()) { setError('Nội dung đánh giá không được để trống.'); return }
    setSaving(true)
    const body = {
      customer_name: form.customer_name.trim(),
      location: form.location.trim() || null,
      rating: form.rating,
      content: form.content.trim(),
      avatar_url: form.avatar_url.trim() || null,
      is_active: form.is_active,
      is_featured: form.is_featured,
      sort_order: Number(form.sort_order) || 0,
    }
    try {
      if (isNew) await api.post('/reviews', body)
      else await api.put(`/reviews/${id}`, body)
      router.push('/admin/reviews')
    } catch {
      setError('Lưu đánh giá thất bại.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex h-48 items-center justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" /></div>

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/reviews" className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold text-stone-800">{isNew ? 'Thêm đánh giá mới' : 'Sửa đánh giá'}</h1>
      </div>

      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-stone-700">Thông tin khách hàng</h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Tên khách hàng *</label>
                <input type="text" value={form.customer_name}
                  onChange={e => setForm(p => ({ ...p, customer_name: e.target.value }))}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="Anh Nguyễn Văn A" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Địa điểm</label>
                <input type="text" value={form.location}
                  onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="Hà Nội" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Số sao *</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} type="button" onClick={() => setForm(p => ({ ...p, rating: star }))}
                    className="transition-transform hover:scale-110">
                    <Star className={`h-7 w-7 ${star <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'}`} />
                  </button>
                ))}
                <span className="ml-2 self-center text-sm text-stone-400">{form.rating}/5 sao</span>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Nội dung đánh giá *</label>
              <textarea value={form.content}
                onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                rows={4} placeholder="Nhận xét của khách hàng..." />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">URL ảnh đại diện (tùy chọn)</label>
              <input type="text" value={form.avatar_url}
                onChange={e => setForm(p => ({ ...p, avatar_url: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                placeholder="https://..." />
              {form.avatar_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.avatar_url} alt="avatar" className="mt-2 h-12 w-12 rounded-full object-cover" />
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
          <Button type="submit" loading={saving}>{isNew ? 'Tạo đánh giá' : 'Lưu thay đổi'}</Button>
          <Link href="/admin/reviews"><Button type="button" variant="outline">Hủy</Button></Link>
        </div>
      </form>
    </div>
  )
}
