'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import api from '@/lib/api'
import { getResponseData } from '@/lib/api-response'
import type { Video } from '@/types'

function extractYoutubeId(input: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/\s]+)/,
  ]
  for (const p of patterns) {
    const m = input.match(p)
    if (m) return m[1]
  }
  // Assume raw ID if no URL pattern matched
  return input.trim()
}

type FormState = {
  title: string; video_type: 'youtube' | 'upload'
  youtube_id: string; video_url: string
  thumbnail_url: string; description: string
  sort_order: string; is_active: boolean
}

const empty: FormState = {
  title: '', video_type: 'youtube', youtube_id: '', video_url: '',
  thumbnail_url: '', description: '', sort_order: '0', is_active: true,
}

export default function VideoEditorPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const isNew = id === 'new'

  const [form, setForm] = useState<FormState>(empty)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ytPreviewId, setYtPreviewId] = useState('')

  useEffect(() => {
    if (isNew) return
    const load = async () => {
      try {
        const res = await api.get(`/videos/${id}`) as unknown
        const v = getResponseData<Video>(res)
        if (!v) throw new Error('Video not found')
        setForm({
          title: v.title, video_type: v.video_type,
          youtube_id: v.youtube_id || '', video_url: v.video_url || '',
          thumbnail_url: v.thumbnail_url || '', description: v.description || '',
          sort_order: String(v.sort_order), is_active: v.is_active,
        })
        if (v.youtube_id) setYtPreviewId(v.youtube_id)
      } catch {
        setError('Không tải được dữ liệu video.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isNew])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!form.title.trim()) { setError('Tiêu đề không được để trống.'); return }
    if (form.video_type === 'youtube' && !form.youtube_id.trim()) { setError('Vui lòng nhập YouTube ID hoặc URL.'); return }
    if (form.video_type === 'upload' && !form.video_url.trim()) { setError('Vui lòng nhập URL video.'); return }

    setSaving(true)
    const body = {
      title: form.title.trim(),
      video_type: form.video_type,
      youtube_id: form.video_type === 'youtube' ? (extractYoutubeId(form.youtube_id) || null) : null,
      video_url: form.video_type === 'upload' ? (form.video_url.trim() || null) : null,
      thumbnail_url: form.thumbnail_url.trim() || null,
      description: form.description.trim() || null,
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
    }
    try {
      if (isNew) await api.post('/videos', body)
      else await api.put(`/videos/${id}`, body)
      router.push('/admin/videos')
    } catch {
      setError('Lưu video thất bại.')
    } finally {
      setSaving(false)
    }
  }

  const currentYtId = form.video_type === 'youtube' ? extractYoutubeId(form.youtube_id) : ''

  if (loading) return <div className="flex h-48 items-center justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" /></div>

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/videos" className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold text-stone-800">{isNew ? 'Thêm video mới' : 'Sửa video'}</h1>
      </div>

      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-stone-700">Thông tin video</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Tiêu đề *</label>
              <input type="text" value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                placeholder="Thi công tủ bếp nhà anh Minh - Phúc Thọ" />
            </div>

            {/* Video type radio */}
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Loại video</label>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="radio" value="youtube" checked={form.video_type === 'youtube'}
                    onChange={() => setForm(p => ({ ...p, video_type: 'youtube' }))} className="h-4 w-4" />
                  <span className="text-sm">Link YouTube</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="radio" value="upload" checked={form.video_type === 'upload'}
                    onChange={() => setForm(p => ({ ...p, video_type: 'upload' }))} className="h-4 w-4" />
                  <span className="text-sm">Upload video (URL)</span>
                </label>
              </div>
            </div>

            {form.video_type === 'youtube' ? (
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">YouTube URL hoặc ID *</label>
                <input type="text" value={form.youtube_id}
                  onChange={e => setForm(p => ({ ...p, youtube_id: e.target.value }))}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="https://youtube.com/watch?v=XXXX hoặc XXXX" />
                {currentYtId && (
                  <div className="mt-3 overflow-hidden rounded-xl">
                    <iframe
                      src={`https://www.youtube.com/embed/${currentYtId}`}
                      className="h-48 w-full"
                      allowFullScreen
                      title="YouTube Preview"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">URL video *</label>
                <input type="text" value={form.video_url}
                  onChange={e => setForm(p => ({ ...p, video_url: e.target.value }))}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="https://... (mp4/webm/mov, max 100MB)" />
                {form.video_url && (
                  <video src={form.video_url} controls className="mt-3 max-h-48 w-full rounded-xl" />
                )}
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">
                URL thumbnail {form.video_type === 'youtube' ? '(nếu không điền → dùng YouTube default)' : '*'}
              </label>
              <input type="text" value={form.thumbnail_url}
                onChange={e => setForm(p => ({ ...p, thumbnail_url: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                placeholder="https://..." />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Mô tả</label>
              <textarea value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                rows={2} />
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
          <Button type="submit" loading={saving}>{isNew ? 'Tạo video' : 'Lưu thay đổi'}</Button>
          <Link href="/admin/videos"><Button type="button" variant="outline">Hủy</Button></Link>
        </div>
      </form>
    </div>
  )
}
