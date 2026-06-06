'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { ActionErrorBanner } from '@/components/shared/ActionErrorBanner'
import { Pagination } from '@/components/shared/Pagination'
import api from '@/lib/api'
import { getListData, getPaginationMeta } from '@/lib/api-response'
import type { News, PaginationMeta } from '@/types'

const STATUS_TABS = [
  { value: '', label: 'Tất cả' },
  { value: 'published', label: 'Đã đăng' },
  { value: 'draft', label: 'Nháp' },
]

export default function AdminNewsPage() {
  const [items, setItems] = useState<News[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionError, setActionError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<News | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (status) params.set('status', status)
      const res = await api.get(`/news/admin/all?${params}`) as unknown
      setItems(getListData<News>(res))
      setMeta(getPaginationMeta(res, { page, limit: 20 }))
    } catch {
      setActionError('Không tải được danh sách tin tức.')
    } finally {
      setLoading(false)
    }
  }, [page, status])

  useEffect(() => { load() }, [load])

  async function confirmDelete() {
    if (!deleting) return
    try {
      await api.delete(`/news/${deleting.id}`)
      setDeleting(null)
      await load()
    } catch {
      setActionError('Xóa tin tức thất bại.')
      setDeleting(null)
    }
  }

  const columns: Column<News>[] = [
    {
      header: 'Ảnh',
      render: (n) => n.thumbnail_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={n.thumbnail_url} alt={n.title} className="h-12 w-16 rounded-lg object-cover" />
      ) : (
        <div className="h-12 w-16 rounded-lg bg-stone-100" />
      ),
      className: 'w-20',
    },
    {
      header: 'Tiêu đề',
      render: (n) => (
        <div>
          <p className="font-medium text-stone-800 line-clamp-1">{n.title}</p>
          {n.excerpt && <p className="text-xs text-stone-400 line-clamp-1">{n.excerpt}</p>}
        </div>
      ),
    },
    {
      header: 'Ngày đăng',
      render: (n) => (
        <span className="text-sm text-stone-400">
          {n.published_at ? new Date(n.published_at).toLocaleDateString('vi-VN') : '—'}
        </span>
      ),
    },
    {
      header: 'Nổi bật',
      render: (n) => (
        <span className={`rounded-full px-2 py-0.5 text-xs ${n.is_featured ? 'bg-amber-100 text-amber-700' : 'text-stone-300'}`}>
          {n.is_featured ? 'Nổi bật' : '—'}
        </span>
      ),
    },
    {
      header: 'Trạng thái',
      render: (n) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${n.is_active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-400'}`}>
          {n.is_active ? 'Đã đăng' : 'Nháp'}
        </span>
      ),
    },
    {
      header: 'Hành động',
      render: (n) => (
        <div className="flex gap-1">
          <Link href={`/admin/news/${n.id}`} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-stone-400 transition-colors hover:bg-amber-50 hover:text-amber-600">
            <Pencil className="h-4 w-4" />
          </Link>
          <button onClick={() => setDeleting(n)} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Tin Tức"
        description="Quản lý bài viết tin tức"
      >
        <Link href="/admin/news/new">
          <Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Thêm tin tức</Button>
        </Link>
      </PageHeader>
      <ActionErrorBanner error={actionError} onDismiss={() => setActionError(null)} />

      <div className="mb-4 flex gap-2">
        {STATUS_TABS.map(t => (
          <button key={t.value} onClick={() => { setStatus(t.value); setPage(1) }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${status === t.value ? 'bg-amber-600 text-white' : 'bg-white text-stone-600 hover:bg-stone-100'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-white" />)}</div>
      ) : (
        <DataTable columns={columns} data={items} rowKey={(n) => n.id} />
      )}

      {meta && meta.totalPages > 1 && (
        <div className="mt-6"><Pagination meta={meta} currentPage={page} onPageChange={setPage} /></div>
      )}

      <ConfirmDialog
        open={!!deleting} title="Xóa tin tức"
        message={`Bạn có chắc muốn xóa bài viết "${deleting?.title}"?`}
        onConfirm={confirmDelete} onCancel={() => setDeleting(null)}
        confirmLabel="Xóa" confirmVariant="danger"
      />
    </div>
  )
}
