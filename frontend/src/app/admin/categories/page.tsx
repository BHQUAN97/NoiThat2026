'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { ActionErrorBanner } from '@/components/shared/ActionErrorBanner'
import { FormModal } from '@/components/shared/FormModal'
import api from '@/lib/api'
import type { ProductCategory, ApiResponse } from '@/types'

type FormData = {
  name: string
  slug: string
  description: string
  thumbnail_url: string
  sort_order: string
  is_active: boolean
}

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

const emptyForm: FormData = {
  name: '', slug: '', description: '', thumbnail_url: '', sort_order: '0', is_active: true,
}

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [actionError, setActionError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState<{ open: boolean; editing: ProductCategory | null }>({ open: false, editing: null })
  const [form, setForm] = useState<FormData>(emptyForm)
  const [deleting, setDeleting] = useState<ProductCategory | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/product-categories') as unknown as { data: ProductCategory[] }
      setItems(res.data || [])
    } catch {
      setActionError('Không tải được danh sách danh mục.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  function openCreate() {
    setForm(emptyForm)
    setModal({ open: true, editing: null })
  }

  function openEdit(cat: ProductCategory) {
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      thumbnail_url: cat.thumbnail_url || '',
      sort_order: String(cat.sort_order),
      is_active: cat.is_active,
    })
    setModal({ open: true, editing: cat })
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setActionError(null)
    if (!form.name.trim()) { setActionError('Tên danh mục không được để trống.'); return }
    if (!form.slug.trim()) { setActionError('Slug không được để trống.'); return }
    setSaving(true)
    const body = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description || null,
      thumbnail_url: form.thumbnail_url || null,
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
    }
    try {
      if (modal.editing) {
        await api.put(`/product-categories/${modal.editing.id}`, body)
      } else {
        await api.post('/product-categories', body)
      }
      setModal({ open: false, editing: null })
      await load()
    } catch {
      setActionError('Lưu danh mục thất bại.')
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    if (!deleting) return
    try {
      await api.delete(`/product-categories/${deleting.id}`)
      setDeleting(null)
      await load()
    } catch {
      setActionError('Xóa danh mục thất bại.')
      setDeleting(null)
    }
  }

  const columns: Column<ProductCategory>[] = [
    {
      header: 'Ảnh',
      render: (c) => c.thumbnail_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={c.thumbnail_url} alt={c.name} className="h-10 w-10 rounded-lg object-cover" />
      ) : (
        <div className="h-10 w-10 rounded-lg bg-stone-100" />
      ),
      className: 'w-16',
    },
    { header: 'Tên', render: (c) => <span className="font-medium text-stone-800">{c.name}</span> },
    { header: 'Slug', render: (c) => <code className="text-xs text-stone-400">{c.slug}</code> },
    {
      header: 'Sort', headerClassName: 'text-center', className: 'w-16 text-center',
      render: (c) => <span className="text-stone-500">{c.sort_order}</span>,
    },
    {
      header: 'Active',
      render: (c) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-400'}`}>
          {c.is_active ? 'Hiện' : 'Ẩn'}
        </span>
      ),
    },
    {
      header: 'Hành động',
      render: (c) => (
        <div className="flex gap-1">
          <button onClick={() => openEdit(c)} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-stone-400 transition-colors hover:bg-amber-50 hover:text-amber-600">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => setDeleting(c)} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Danh Mục Sản Phẩm"
        description="Quản lý danh mục sản phẩm"
      >
        <Button onClick={openCreate} size="sm"><Plus className="mr-1.5 h-4 w-4" />Thêm danh mục</Button>
      </PageHeader>
      <ActionErrorBanner error={actionError} onDismiss={() => setActionError(null)} />
      {loading ? (
        <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-white" />)}</div>
      ) : (
        <DataTable columns={columns} data={items} rowKey={(c) => c.id} />
      )}

      <FormModal
        open={modal.open}
        title={modal.editing ? 'Sửa danh mục' : 'Thêm danh mục'}
        onClose={() => setModal({ open: false, editing: null })}
        onSubmit={handleSave}
        submitLabel={saving ? 'Đang lưu...' : 'Lưu'}
        loading={saving}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Tên danh mục *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => {
                const name = e.target.value
                setForm(p => ({ ...p, name, slug: modal.editing ? p.slug : toSlug(name) }))
              }}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
              placeholder="Tủ Bếp Gỗ Tự Nhiên"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Slug *</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm(p => ({ ...p, slug: e.target.value }))}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm font-mono focus:border-amber-400 focus:outline-none"
              placeholder="tu-bep-go-tu-nhien"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Mô tả</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
              rows={2}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">URL ảnh đại diện</label>
            <input
              type="text"
              value={form.thumbnail_url}
              onChange={(e) => setForm(p => ({ ...p, thumbnail_url: e.target.value }))}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
              placeholder="https://..."
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-stone-700">Thứ tự</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm(p => ({ ...p, sort_order: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div className="flex items-end gap-2 pb-2">
              <input type="checkbox" id="cat-active" checked={form.is_active}
                onChange={(e) => setForm(p => ({ ...p, is_active: e.target.checked }))}
                className="h-4 w-4 rounded" />
              <label htmlFor="cat-active" className="text-sm text-stone-700">Hiển thị</label>
            </div>
          </div>
        </div>
      </FormModal>

      <ConfirmDialog
        open={!!deleting}
        title="Xóa danh mục"
        message={`Bạn có chắc muốn xóa danh mục "${deleting?.name}"? Hành động này không thể hoàn tác.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
        confirmLabel="Xóa"
        confirmVariant="danger"
      />
    </div>
  )
}
