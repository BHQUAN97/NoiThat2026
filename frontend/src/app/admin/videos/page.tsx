'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Play, Video } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { ActionErrorBanner } from '@/components/shared/ActionErrorBanner'
import api from '@/lib/api'
import type { Video as VideoType } from '@/types'

export default function AdminVideosPage() {
  const [items, setItems] = useState<VideoType[]>([])
  const [loading, setLoading] = useState(true)
  const [actionError, setActionError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<VideoType | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/videos/admin/all') as unknown
      setItems((res as { data: VideoType[] }).data || [])
    } catch {
      setActionError('Không tải được danh sách video.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function confirmDelete() {
    if (!deleting) return
    try {
      await api.delete(`/videos/${deleting.id}`)
      setDeleting(null)
      await load()
    } catch {
      setActionError('Xóa video thất bại.')
      setDeleting(null)
    }
  }

  const columns: Column<VideoType>[] = [
    {
      header: 'Thumbnail',
      render: (v) => v.thumbnail_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={v.video_type === 'youtube' && v.youtube_id
          ? `https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`
          : v.thumbnail_url}
          alt={v.title} className="h-12 w-20 rounded-lg object-cover" />
      ) : v.video_type === 'youtube' && v.youtube_id ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`}
          alt={v.title} className="h-12 w-20 rounded-lg object-cover" />
      ) : (
        <div className="flex h-12 w-20 items-center justify-center rounded-lg bg-stone-100">
          <Video className="h-5 w-5 text-stone-400" />
        </div>
      ),
      className: 'w-24',
    },
    {
      header: 'Tiêu đề',
      render: (v) => (
        <div>
          <p className="font-medium text-stone-800">{v.title}</p>
          {v.description && <p className="text-xs text-stone-400 line-clamp-1">{v.description}</p>}
        </div>
      ),
    },
    {
      header: 'Loại',
      render: (v) => (
        <div className="flex items-center gap-1.5">
          {v.video_type === 'youtube' ? (
            <><Play className="h-4 w-4 text-red-500" /><span className="text-sm text-stone-500">YouTube</span></>
          ) : (
            <><Video className="h-4 w-4 text-blue-500" /><span className="text-sm text-stone-500">Upload</span></>
          )}
        </div>
      ),
    },
    {
      header: 'Sort', headerClassName: 'text-center', className: 'w-16 text-center',
      render: (v) => <span className="text-stone-400">{v.sort_order}</span>,
    },
    {
      header: 'Active',
      render: (v) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${v.is_active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-400'}`}>
          {v.is_active ? 'Hiện' : 'Ẩn'}
        </span>
      ),
    },
    {
      header: 'Hành động',
      render: (v) => (
        <div className="flex gap-1">
          <Link href={`/admin/videos/${v.id}`} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-stone-400 transition-colors hover:bg-amber-50 hover:text-amber-600">
            <Pencil className="h-4 w-4" />
          </Link>
          <button onClick={() => setDeleting(v)} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Video Công Trình"
        description="Quản lý video YouTube và video upload"
      >
        <Link href="/admin/videos/new">
          <Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Thêm video</Button>
        </Link>
      </PageHeader>
      <ActionErrorBanner error={actionError} onDismiss={() => setActionError(null)} />
      {loading ? (
        <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-white" />)}</div>
      ) : (
        <DataTable columns={columns} data={items} rowKey={(v) => v.id} />
      )}
      <ConfirmDialog
        open={!!deleting} title="Xóa video"
        message={`Bạn có chắc muốn xóa video "${deleting?.title}"?`}
        onConfirm={confirmDelete} onCancel={() => setDeleting(null)}
        confirmLabel="Xóa" confirmVariant="danger"
      />
    </div>
  )
}
