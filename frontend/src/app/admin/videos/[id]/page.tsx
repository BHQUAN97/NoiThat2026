'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, AlertCircle, Loader2, PlayCircle, Upload } from 'lucide-react'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { uploadVideo, validateVideoFile, ALLOWED_VIDEO_TYPES } from '@/lib/media'
import api from '@/lib/api'
import { getResponseData } from '@/lib/api-response'
import type { Video } from '@/types'

function extractYoutubeId(input: string): string {
  const m = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/\s]+)/)
  return m ? m[1] : input.trim()
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

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

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 flex-shrink-0 rounded-full transition-colors ${checked ? 'bg-amber-500' : 'bg-stone-200'}`}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
    </button>
  )
}

export default function VideoEditorPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const isNew = id === 'new'

  const [form, setForm] = useState<FormState>(empty)
  const [loading, setLoading] = useState(!isNew)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const videoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isNew) return
    const load = async () => {
      try {
        const res = await api.get(`/videos/${id}`) as unknown
        const v = getResponseData<Video>(res)
        if (!v) throw new Error('not found')
        setForm({
          title: v.title, video_type: v.video_type,
          youtube_id: v.youtube_id || '', video_url: v.video_url || '',
          thumbnail_url: v.thumbnail_url || '', description: v.description || '',
          sort_order: String(v.sort_order), is_active: v.is_active,
        })
      } catch {
        setError('Không tải được dữ liệu video.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isNew])

  async function handleSave() {
    setError(null)
    if (!form.title.trim()) { setError('Tiêu đề không được để trống.'); return }
    if (form.video_type === 'youtube' && !form.youtube_id.trim()) { setError('Vui lòng nhập YouTube URL hoặc ID.'); return }
    if (form.video_type === 'upload' && !form.video_url.trim()) { setError('Vui lòng nhập URL hoặc upload video.'); return }

    setSaveStatus('saving')
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
      if (isNew) {
        await api.post('/videos', body)
        setSaveStatus('saved')
        router.push('/admin/videos')
      } else {
        await api.put(`/videos/${id}`, body)
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      }
    } catch {
      setSaveStatus('error')
      setError('Lưu video thất bại.')
    }
  }

  async function handleVideoFile(file: File) {
    const validErr = validateVideoFile(file)
    if (validErr) { setError(validErr); return }
    setError(null)
    setUploadingVideo(true)
    try {
      const media = await uploadVideo(file)
      setForm(p => ({ ...p, video_url: media.preview_url || media.original_url }))
    } catch {
      setError('Upload video thất bại. Thử lại hoặc nhập URL trực tiếp.')
    } finally {
      setUploadingVideo(false)
    }
  }

  const field = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm(p => ({ ...p, [k]: v }))

  const ytId = form.video_type === 'youtube' ? extractYoutubeId(form.youtube_id) : ''

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
    </div>
  )

  return (
    <div className="-mx-4 -mt-1 md:-mx-6">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-stone-200 bg-white/95 px-4 py-3 backdrop-blur md:px-6">
        <Link href="/admin/videos"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-stone-800">
            {form.title || (isNew ? 'Video mới' : 'Sửa video')}
          </p>
          <p className="text-[11px] text-stone-400">Video công trình · {isNew ? 'Thêm mới' : 'Chỉnh sửa'}</p>
        </div>
        {saveStatus !== 'idle' && (
          <span className={`hidden items-center gap-1 text-xs sm:flex ${
            saveStatus === 'saved' ? 'text-emerald-600' : saveStatus === 'error' ? 'text-red-500' : 'text-stone-400'
          }`}>
            {saveStatus === 'saving' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {saveStatus === 'saved' && <Check className="h-3.5 w-3.5" />}
            {saveStatus === 'error' && <AlertCircle className="h-3.5 w-3.5" />}
            {saveStatus === 'saving' ? 'Đang lưu...' : saveStatus === 'saved' ? 'Đã lưu' : 'Lỗi lưu'}
          </span>
        )}
        <button onClick={handleSave} disabled={saveStatus === 'saving'}
          className="flex h-8 items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-60">
          {saveStatus === 'saving'
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : <Check className="h-3.5 w-3.5" />}
          {isNew ? 'Tạo video' : 'Lưu'}
        </button>
      </div>

      <div className="px-4 py-6 md:px-6">
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[1fr_272px]">
          {/* Main column */}
          <div className="space-y-5">
            {/* Title */}
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/60">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Thông tin video</h2>
              <div className="space-y-3.5">
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-600">Tiêu đề *</label>
                  <input type="text" value={form.title}
                    onChange={e => field('title', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                    placeholder="Thi công tủ bếp nhà anh Minh — Phúc Thọ, Hà Nội" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-600">Mô tả ngắn</label>
                  <textarea value={form.description}
                    onChange={e => field('description', e.target.value)}
                    className="w-full resize-none rounded-lg border border-stone-200 px-3 py-2.5 text-sm transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                    rows={2} placeholder="Mô tả video..." />
                </div>
              </div>
            </section>

            {/* Video source */}
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/60">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Nguồn video</h2>

              {/* Type selector */}
              <div className="mb-4 flex gap-2">
                {(['youtube', 'upload'] as const).map(type => (
                  <button key={type} type="button"
                    onClick={() => field('video_type', type)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition ${
                      form.video_type === type
                        ? 'bg-amber-50 text-amber-700 ring-2 ring-amber-400'
                        : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                    }`}>
                    {type === 'youtube'
                      ? <><PlayCircle className="h-4 w-4" /> YouTube</>
                      : <><Upload className="h-4 w-4" /> Upload file</>}
                  </button>
                ))}
              </div>

              {form.video_type === 'youtube' ? (
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-600">YouTube URL hoặc ID *</label>
                    <input type="text" value={form.youtube_id}
                      onChange={e => field('youtube_id', e.target.value)}
                      className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-amber-400 focus:outline-none"
                      placeholder="https://youtube.com/watch?v=XXXXXXXX hoặc XXXXXXXX" />
                  </div>
                  {ytId && (
                    <div className="overflow-hidden rounded-xl bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}`}
                        className="aspect-video w-full"
                        allowFullScreen
                        title="YouTube Preview"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <input ref={videoInputRef} type="file"
                    accept={ALLOWED_VIDEO_TYPES.join(',')}
                    className="hidden"
                    onChange={e => {
                      const f = e.target.files?.[0]
                      if (f) handleVideoFile(f)
                      e.target.value = ''
                    }} />

                  {/* Upload zone */}
                  <div
                    className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-stone-200 py-8 transition hover:border-amber-400 hover:bg-amber-50/30"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    {uploadingVideo ? (
                      <><Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                        <p className="text-sm text-stone-500">Đang upload...</p></>
                    ) : (
                      <><Upload className="h-6 w-6 text-stone-400" />
                        <p className="text-sm font-medium text-stone-600">Click để chọn file video</p>
                        <p className="text-[11px] text-stone-400">MP4, WebM, MOV · tối đa 200MB</p></>
                    )}
                  </div>

                  {/* Manual URL fallback */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-600">
                      Hoặc nhập URL video trực tiếp
                    </label>
                    <input type="text" value={form.video_url}
                      onChange={e => field('video_url', e.target.value)}
                      className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-amber-400 focus:outline-none"
                      placeholder="https://..." />
                  </div>

                  {form.video_url && (
                    <video src={form.video_url} controls className="w-full rounded-xl" />
                  )}
                </div>
              )}
            </section>

            {/* Thumbnail */}
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/60">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Ảnh thumbnail</h2>
              <p className="mb-3 text-[11px] text-stone-400">
                {form.video_type === 'youtube' ? 'Tuỳ chọn — nếu để trống sẽ dùng thumbnail mặc định từ YouTube.' : 'Bắt buộc cho video upload.'}
              </p>
              <ImageUpload
                value={form.thumbnail_url}
                onChange={url => field('thumbnail_url', url)}
                aspect="16/9"
                label=""
              />
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/60 lg:sticky lg:top-[57px]">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Cài đặt</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-600">Thứ tự hiển thị</label>
                  <input type="number" value={form.sort_order}
                    onChange={e => field('sort_order', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-amber-400 focus:outline-none" />
                </div>
                <div className="space-y-3 border-t border-stone-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-700">Hiển thị</span>
                    <Toggle checked={form.is_active} onChange={v => field('is_active', v)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
