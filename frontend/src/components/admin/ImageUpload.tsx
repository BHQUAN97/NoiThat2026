'use client'

import { useRef, useState } from 'react'
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react'
import { uploadMedia, validateImageFile, fileToBase64 } from '@/lib/media'

interface Props {
  value: string
  onChange: (url: string) => void
  aspect?: '4/3' | '16/9' | '1/1' | '3/2'
  label?: string
  className?: string
}

export function ImageUpload({ value, onChange, aspect = '4/3', label = 'Ảnh', className = '' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const ASPECT_MAP: Record<string, string> = {
    '4/3': 'aspect-[4/3]',
    '16/9': 'aspect-[16/9]',
    '1/1': 'aspect-square',
    '3/2': 'aspect-[3/2]',
  }

  async function handleFile(file: File) {
    const validErr = validateImageFile(file)
    if (validErr) { setErr(validErr); return }
    setErr(null)
    setUploading(true)
    const preview = await fileToBase64(file)
    onChange(preview) // show immediately
    try {
      const media = await uploadMedia(file)
      onChange(media.preview_url || media.original_url)
    } catch {
      setErr('Upload thất bại. Thử lại.')
      onChange('') // reset on failure
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={className}>
      {label && (
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-on-surface-variant/70">{label}</p>
      )}
      <div
        className={`relative overflow-hidden rounded-xl transition-all ${ASPECT_MAP[aspect]} ${
          value ? '' : `border-2 border-dashed ${dragging ? 'border-primary bg-primary/5' : 'border-on-surface/15 bg-surface-container'}`
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault(); setDragging(false)
          const f = e.dataTransfer.files[0]
          if (f) handleFile(f)
        }}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} />

        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt={label} className="absolute inset-0 h-full w-full object-cover" />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-on-surface/30">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
            {!uploading && (
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/50 to-transparent opacity-0 transition-opacity hover:opacity-100">
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button type="button" onClick={() => inputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-lg bg-surface/90 px-2.5 py-1.5 text-[12px] font-medium text-on-surface shadow-lg backdrop-blur hover:bg-surface">
                    <Upload className="h-3 w-3" /> Đổi ảnh
                  </button>
                  <button type="button" onClick={() => onChange('')}
                    className="flex items-center gap-1 rounded-lg bg-error/90 px-2.5 py-1.5 text-[12px] font-medium text-white shadow-lg hover:bg-error">
                    <X className="h-3 w-3" /> Xóa
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <button type="button" onClick={() => inputRef.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-2.5 text-on-surface-variant/40 transition-colors hover:text-on-surface-variant/70">
            {uploading
              ? <Loader2 className="h-7 w-7 animate-spin" />
              : <><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-high"><ImageIcon className="h-5 w-5" /></div>
                <div className="text-center">
                  <p className="text-body-sm font-medium">Kéo thả hoặc click để chọn</p>
                  <p className="mt-0.5 text-[11px]">JPEG, PNG, WebP · tối đa 10MB</p>
                </div></>
            }
          </button>
        )}
      </div>
      {err && <p className="mt-1 text-[11px] text-error">{err}</p>}
    </div>
  )
}
