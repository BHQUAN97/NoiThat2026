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
import type { Product, ProductCategory } from '@/types'

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [actionError, setActionError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [productsRes, catsRes] = await Promise.all([
        api.get('/products/admin/all') as Promise<unknown>,
        api.get('/product-categories') as Promise<unknown>,
      ])
      setItems((productsRes as { data: Product[] }).data || [])
      setCategories((catsRes as { data: ProductCategory[] }).data || [])
    } catch {
      setActionError('Không tải được danh sách sản phẩm.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function confirmDelete() {
    if (!deleting) return
    try {
      await api.delete(`/products/${deleting.id}`)
      setDeleting(null)
      await load()
    } catch {
      setActionError('Xóa sản phẩm thất bại.')
      setDeleting(null)
    }
  }

  const getCatName = (id: string) => categories.find(c => c.id === id)?.name || '—'

  const filtered = items.filter(p => {
    if (categoryFilter && p.category_id !== categoryFilter) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const columns: Column<Product>[] = [
    {
      header: 'Ảnh',
      render: (p) => p.thumbnail_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.thumbnail_url} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
      ) : (
        <div className="h-12 w-12 rounded-lg bg-stone-100" />
      ),
      className: 'w-16',
    },
    {
      header: 'Tên',
      render: (p) => (
        <div>
          <p className="font-medium text-stone-800">{p.name}</p>
          <code className="text-xs text-stone-400">{p.slug}</code>
        </div>
      ),
    },
    { header: 'Danh mục', render: (p) => <span className="text-sm text-stone-500">{getCatName(p.category_id)}</span> },
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
          <Link href={`/admin/products/${p.id}`} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-stone-400 transition-colors hover:bg-amber-50 hover:text-amber-600">
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
        title="Sản Phẩm"
        description="Quản lý danh sách sản phẩm"
      >
        <Link href="/admin/products/new">
          <Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Thêm sản phẩm</Button>
        </Link>
      </PageHeader>
      <ActionErrorBanner error={actionError} onDismiss={() => setActionError(null)} />

      {/* Filters */}
      <div className="mb-4 flex gap-3">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Tìm theo tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-white" />)}</div>
      ) : (
        <DataTable columns={columns} data={filtered} rowKey={(p) => p.id} />
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Xóa sản phẩm"
        message={`Bạn có chắc muốn xóa sản phẩm "${deleting?.name}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
        confirmLabel="Xóa"
        confirmVariant="danger"
      />
    </div>
  )
}
