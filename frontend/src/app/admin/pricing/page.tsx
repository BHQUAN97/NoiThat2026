'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { ActionErrorBanner } from '@/components/shared/ActionErrorBanner'
import api from '@/lib/api'
import type { PricingTable } from '@/types'

export default function AdminPricingPage() {
  const [items, setItems] = useState<PricingTable[]>([])
  const [loading, setLoading] = useState(true)
  const [actionError, setActionError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<PricingTable | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/pricing') as unknown
      setItems((res as { data: PricingTable[] }).data || [])
    } catch {
      setActionError('Không tải được bảng giá.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function confirmDelete() {
    if (!deleting) return
    try {
      await api.delete(`/pricing/${deleting.id}`)
      setDeleting(null)
      await load()
    } catch {
      setActionError('Xóa bảng giá thất bại.')
      setDeleting(null)
    }
  }

  const columns: Column<PricingTable>[] = [
    { header: 'Tên gói', render: (p) => <span className="font-medium text-stone-800">{p.name}</span> },
    {
      header: 'Số hạng mục',
      render: (p) => <span className="text-stone-500">{p.items?.length || 0} hạng mục</span>,
    },
    {
      header: 'Sort', headerClassName: 'text-center', className: 'w-16 text-center',
      render: (p) => <span className="text-stone-400">{p.sort_order}</span>,
    },
    {
      header: 'Active',
      render: (p) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-400'}`}>
          {p.is_active ? 'Hiện' : 'Ẩn'}
        </span>
      ),
    },
    {
      header: 'Hành động',
      render: (p) => (
        <div className="flex gap-1">
          <Link href={`/admin/pricing/${p.id}`} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-stone-400 transition-colors hover:bg-amber-50 hover:text-amber-600">
            <Pencil className="h-4 w-4" />
          </Link>
          <button onClick={() => setDeleting(p)} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Bảng Giá"
        description="Quản lý các gói bảng giá"
      >
        <Link href="/admin/pricing/new">
          <Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Thêm bảng giá</Button>
        </Link>
      </PageHeader>
      <ActionErrorBanner error={actionError} onDismiss={() => setActionError(null)} />
      {loading ? (
        <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-white" />)}</div>
      ) : (
        <DataTable columns={columns} data={items} rowKey={(p) => p.id} />
      )}
      <ConfirmDialog
        open={!!deleting} title="Xóa bảng giá"
        message={`Bạn có chắc muốn xóa bảng giá "${deleting?.name}"?`}
        onConfirm={confirmDelete} onCancel={() => setDeleting(null)}
        confirmLabel="Xóa" confirmVariant="danger"
      />
    </div>
  )
}
