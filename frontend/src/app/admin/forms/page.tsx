'use client'

import { useState, useEffect, useCallback } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { Pagination } from '@/components/shared/Pagination'
import { ActionErrorBanner } from '@/components/shared/ActionErrorBanner'
import api from '@/lib/api'
import { getListData, getPaginationMeta } from '@/lib/api-response'
import type { FormSubmission, ApiResponse, PaginationMeta } from '@/types'

const STATUS_TABS = [
  { value: '', label: 'Tất cả' },
  { value: 'new', label: 'Mới' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'done', label: 'Đã xong' },
]

const STATUS_LABELS: Record<string, string> = { new: 'Mới', processing: 'Đang xử lý', done: 'Đã xong' }
const STATUS_CLASSES: Record<string, string> = {
  new: 'bg-red-100 text-red-700',
  processing: 'bg-yellow-100 text-yellow-700',
  done: 'bg-green-100 text-green-700',
}

function getContentSummary(form: FormSubmission): string {
  if (!form.content) return ''
  const c = form.content as Record<string, unknown>
  if (c.service) return String(c.service)
  if (c.message) return String(c.message).slice(0, 60)
  if (c.note) return String(c.note).slice(0, 60)
  return ''
}

export default function AdminFormsPage() {
  const [items, setItems] = useState<FormSubmission[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionError, setActionError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (status) params.set('status', status)
      const res = await api.get(`/forms/admin/submissions?${params}`) as ApiResponse<FormSubmission[]>
      setItems(getListData<FormSubmission>(res))
      setMeta(getPaginationMeta(res, { page, limit: 20 }))
    } catch {
      setActionError('Không tải được danh sách form.')
    } finally {
      setLoading(false)
    }
  }, [page, status])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id: string, newStatus: FormSubmission['status']) => {
    setUpdatingId(id)
    try {
      await api.patch(`/forms/admin/submissions/${id}/status`, { status: newStatus })
      setItems(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f))
    } catch {
      setActionError('Cập nhật trạng thái thất bại.')
    } finally {
      setUpdatingId(null)
    }
  }

  const columns: Column<FormSubmission>[] = [
    {
      header: 'Loại',
      render: (f) => (
        <span className="text-xs font-medium text-stone-500">
          {f.form_type === 'quote' ? 'Báo giá' : 'Liên hệ'}
        </span>
      ),
      className: 'w-24',
    },
    {
      header: 'Tên',
      render: (f) => <span className="font-medium text-stone-800">{f.name}</span>,
    },
    {
      header: 'SĐT',
      render: (f) => (
        <a href={`tel:${f.phone}`} className="text-amber-600 hover:underline">{f.phone}</a>
      ),
    },
    {
      header: 'Email',
      render: (f) => <span className="text-stone-500 text-sm">{f.email || '—'}</span>,
    },
    {
      header: 'Nội dung',
      render: (f) => <span className="text-stone-500 text-sm max-w-xs block truncate">{getContentSummary(f)}</span>,
    },
    {
      header: 'Thời gian',
      render: (f) => (
        <span className="text-stone-400 text-sm">
          {new Date(f.created_at).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
    {
      header: 'Trạng thái',
      render: (f) => (
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[f.status] || ''}`}>
            {STATUS_LABELS[f.status] || f.status}
          </span>
          {f.status !== 'done' && (
            <select
              value={f.status}
              disabled={updatingId === f.id}
              onChange={(e) => updateStatus(f.id, e.target.value as FormSubmission['status'])}
              className="rounded border border-stone-200 bg-white px-2 py-0.5 text-xs text-stone-700 focus:outline-none"
            >
              {STATUS_TABS.filter(t => t.value).map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Form Yêu Cầu" description="Danh sách form báo giá và liên hệ từ khách hàng" />

      <ActionErrorBanner error={actionError} onDismiss={() => setActionError(null)} />

      {/* Status tabs */}
      <div className="mb-4 flex gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatus(tab.value); setPage(1) }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              status === tab.value
                ? 'bg-amber-600 text-white'
                : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            {tab.label}
            {tab.value === 'new' && meta && status !== 'new' && (
              <span className="ml-1.5 rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white">!</span>
            )}
          </button>
        ))}
      </div>

      {/* Mobile card layout */}
      <div className="block sm:hidden space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-white" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-stone-400">Không có form nào.</p>
        ) : (
          items.map((f) => (
            <div key={f.id} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-stone-800">{f.name}</p>
                  <p className="text-sm text-amber-600">{f.phone}</p>
                  {f.email && <p className="text-xs text-stone-400">{f.email}</p>}
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[f.status]}`}>
                  {STATUS_LABELS[f.status]}
                </span>
              </div>
              {getContentSummary(f) && (
                <p className="mt-2 text-sm text-stone-500 line-clamp-2">{getContentSummary(f)}</p>
              )}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-stone-400">
                  {new Date(f.created_at).toLocaleString('vi-VN')}
                </span>
                {f.status !== 'done' && (
                  <select
                    value={f.status}
                    disabled={updatingId === f.id}
                    onChange={(e) => updateStatus(f.id, e.target.value as FormSubmission['status'])}
                    className="rounded border border-stone-200 bg-white px-2 py-1 text-xs focus:outline-none"
                  >
                    {STATUS_TABS.filter(t => t.value).map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block">
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-white" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-stone-400">Không có form nào.</p>
        ) : (
          <DataTable columns={columns} data={items} rowKey={(f) => f.id} />
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="mt-6">
          <Pagination meta={meta} currentPage={page} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}
