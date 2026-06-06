'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { ActionErrorBanner } from '@/components/shared/ActionErrorBanner'
import api from '@/lib/api'
import type { Review } from '@/types'

export default function AdminReviewsPage() {
  const [items, setItems] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [actionError, setActionError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<Review | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/reviews/admin/all') as unknown
      setItems((res as { data: Review[] }).data || [])
    } catch {
      // Fallback to public endpoint
      try {
        const res2 = await api.get('/reviews') as unknown
        setItems((res2 as { data: Review[] }).data || [])
      } catch {
        setActionError('Không tải được danh sách đánh giá.')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function confirmDelete() {
    if (!deleting) return
    try {
      await api.delete(`/reviews/${deleting.id}`)
      setDeleting(null)
      await load()
    } catch {
      setActionError('Xóa đánh giá thất bại.')
      setDeleting(null)
    }
  }

  const columns: Column<Review>[] = [
    {
      header: 'Khách hàng',
      render: (r) => (
        <div className="flex items-center gap-3">
          {r.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={r.avatar_url} alt={r.customer_name} className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-sm font-medium text-amber-700">
              {r.customer_name.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-medium text-stone-800">{r.customer_name}</p>
            {r.location && <p className="text-xs text-stone-400">{r.location}</p>}
          </div>
        </div>
      ),
    },
    {
      header: 'Đánh giá',
      render: (r) => (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'}`} />
          ))}
        </div>
      ),
    },
    {
      header: 'Nội dung',
      render: (r) => <p className="max-w-xs text-sm text-stone-500 line-clamp-2">{r.content}</p>,
    },
    {
      header: 'Nổi bật',
      render: (r) => (
        <span className={`rounded-full px-2 py-0.5 text-xs ${r.is_featured ? 'bg-amber-100 text-amber-700' : 'text-stone-300'}`}>
          {r.is_featured ? 'Nổi bật' : '—'}
        </span>
      ),
    },
    {
      header: 'Active',
      render: (r) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${r.is_active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-400'}`}>
          {r.is_active ? 'Hiện' : 'Ẩn'}
        </span>
      ),
    },
    {
      header: 'Hành động',
      render: (r) => (
        <div className="flex gap-1">
          <Link href={`/admin/reviews/${r.id}`} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-stone-400 transition-colors hover:bg-amber-50 hover:text-amber-600">
            <Pencil className="h-4 w-4" />
          </Link>
          <button onClick={() => setDeleting(r)} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Đánh Giá Khách Hàng"
        description="Quản lý đánh giá từ khách hàng"
      >
        <Link href="/admin/reviews/new">
          <Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Thêm đánh giá</Button>
        </Link>
      </PageHeader>
      <ActionErrorBanner error={actionError} onDismiss={() => setActionError(null)} />
      {loading ? (
        <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-white" />)}</div>
      ) : (
        <DataTable columns={columns} data={items} rowKey={(r) => r.id} />
      )}
      <ConfirmDialog
        open={!!deleting} title="Xóa đánh giá"
        message={`Bạn có chắc muốn xóa đánh giá của "${deleting?.customer_name}"?`}
        onConfirm={confirmDelete} onCancel={() => setDeleting(null)}
        confirmLabel="Xóa" confirmVariant="danger"
      />
    </div>
  )
}
