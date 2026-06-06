'use client'

import { useState } from 'react'
import { AlertTriangle, PlayCircle } from 'lucide-react'
import type { Video } from '@/types'

function VideoError({ label = 'Video lỗi' }: { label?: string }) {
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-t-xl bg-surface-container text-center">
      <AlertTriangle className="h-8 w-8 text-error" />
      <div>
        <p className="font-headline text-lg font-bold text-primary">{label}</p>
        <p className="mt-1 text-body-sm text-on-surface-variant">Nguồn video chưa có hoặc không tải được.</p>
      </div>
    </div>
  )
}

export function VideoCard({ video }: { video: Video }) {
  const [failed, setFailed] = useState(false)
  const hasYoutube = video.video_type === 'youtube' && !!video.youtube_id
  const hasUpload = video.video_type === 'upload' && !!video.video_url

  return (
    <article className="overflow-hidden rounded-xl bg-surface shadow-card transition-shadow hover:shadow-card-hover">
      {failed || (!hasYoutube && !hasUpload) ? (
        <VideoError />
      ) : hasYoutube ? (
        <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-primary">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtube_id}`}
            title={video.title}
            className="h-full w-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onError={() => setFailed(true)}
          />
        </div>
      ) : (
        <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-primary">
          <video
            src={video.video_url || undefined}
            poster={video.thumbnail_url || undefined}
            controls
            preload="metadata"
            className="h-full w-full"
            aria-label={video.title}
            onError={() => setFailed(true)}
          />
          <PlayCircle className="pointer-events-none absolute left-4 top-4 h-7 w-7 text-white/70" />
        </div>
      )}
      <div className="p-5">
        <h3 className="font-headline text-xl font-bold text-primary line-clamp-2">{video.title}</h3>
        {video.description && (
          <p className="mt-2 text-body-sm leading-relaxed text-on-surface-variant line-clamp-2">{video.description}</p>
        )}
      </div>
    </article>
  )
}
