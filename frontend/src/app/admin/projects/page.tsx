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
import { getListData } from '@/lib/api-response'
import { PROVINCES } from '@/lib/constants'
import type { Project } from '@/types'

export default function AdminProjectsPage() {
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [actionError, setActionError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<Project | null>(null)
  const [provinceFilter, setProvinceFilter] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/projects/admin/all') as unknown
      setItems(getListData<Project>(res))
    } catch {
      // Thử endpoint công khai
      try {
        const res2 = await api.get('/projects') as unknown
        setItems(getListData<Project>(res2))
      } catch {
        setActionError('Không tải được danh sách dự án.')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function confirmDelete() {
    if (!deleting) return
    try {
      await api.delete(`/projects/${deleting.id}`)
      setDeleting(null)
      await load()
    } catch {
      setActionError('Xóa dự án thất bại.')
      setDeleting(null)
    }
  }

  const filtered = provinceFilter
    ? items.filter(p => p.province === provinceFilter)
    : items

  const provinceOptions = [
    { label: 'Tất cả', value: '' },
    ...Array.from(new Set([
      ...PROVINCES.map(p => p.value).filter(Boolean),
      ...items.map(p => p.province).filter(Boolean),
    ])).map(value => ({ label: value, value })),
  ]

  const columns: Column<Project>[] = [
    {
      header: 'Ảnh',
      render: (p) => p.thumbnail_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.thumbnail_url} alt={p.name} className="h-12 w-16 rounded-lg object-cover" />
      ) : (
        <div className="h-12 w-16 rounded-lg bg-stone-100" />
      ),
      className: 'w-20',
    },
    {
      header: 'Tên dự án',
      render: (p) => (
        <div>
          <p className="font-medium text-stone-800">{p.name}</p>
          {p.location && <p className="text-xs text-stone-400">{p.location}</p>}
        </div>
      ),
    },
    { header: 'Tỉnh', render: (p) => <span className="text-sm text-stone-500">{p.province}</span> },
    { header: 'Diện tích', render: (p) => <span className="text-sm text-stone-400">{p.area_sqm || '—'}</span> },
    {
      header: 'Nổi bật',
      render: (p) => (
        <span className={`rounded-full px-2 py-0.5 text-xs ${p.is_featured ? 'bg-amber-100 text-amber-700' : 'text-stone-300'}`}>
          {p.is_featured ? 'Nổi bật' : '—'}
        </span>
      ),
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
          <Link href={`/admin/projects/${p.id}`} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-stone-400 transition-colors hover:bg-amber-50 hover:text-amber-600">
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
        title="Dự Án Thực Tế"
        description="Quản lý các dự án đã thi công"
      >
        <Link href="/admin/projects/new">
          <Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Thêm dự án</Button>
        </Link>
      </PageHeader>
      <ActionErrorBanner error={actionError} onDismiss={() => setActionError(null)} />

      <div className="mb-4 flex gap-3">
        <select
          value={provinceFilter}
          onChange={e => setProvinceFilter(e.target.value)}
          className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
        >
          {provinceOptions.map(p => <option key={p.value || 'all'} value={p.value}>{p.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-white" />)}</div>
      ) : (
        <DataTable columns={columns} data={filtered} rowKey={(p) => p.id} />
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Xóa dự án"
        message={`Bạn có chắc muốn xóa dự án "${deleting?.name}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
        confirmLabel="Xóa"
        confirmVariant="danger"
      />
    </div>
  )
}
