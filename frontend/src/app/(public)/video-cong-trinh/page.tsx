import type { Metadata } from 'next'
import type { Video } from '@/types'

export const metadata: Metadata = {
  title: 'Video Công Trình — Nội Thất Duy Mạnh',
  description: 'Xem video thi công, bàn giao và khảo sát công trình tủ bếp nội thất của Duy Mạnh.',
}

async function getVideos(): Promise<Video[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002'
    const res = await fetch(`${apiUrl}/videos`, { next: { revalidate: 300 } })
    if (!res.ok) return []
    const data = await res.json()
    return (data.data || data) as Video[]
  } catch {
    return []
  }
}

function YouTubeEmbed({ youtubeId, title }: { youtubeId: string; title: string }) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-t-xl">
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

function VideoPlayer({ src, poster, title }: { src: string; poster?: string | null; title: string }) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-stone-900">
      <video src={src} poster={poster || undefined} controls preload="none"
        className="h-full w-full" aria-label={title} />
    </div>
  )
}

export default async function VideoPage() {
  const videos = await getVideos()

  return (
    <>
      <section className="bg-stone-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-400">Video</p>
          <h1 className="mb-3 font-serif text-4xl font-bold leading-tight">Video Công Trình</h1>
          <p className="text-stone-300">Theo dõi quá trình thi công và bàn giao thực tế qua video</p>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {videos.length === 0 ? (
            <p className="py-16 text-center text-stone-400">Chưa có video nào.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <div key={video.id} className="overflow-hidden rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                  {video.video_type === 'youtube' && video.youtube_id ? (
                    <YouTubeEmbed youtubeId={video.youtube_id} title={video.title} />
                  ) : video.video_url ? (
                    <VideoPlayer src={video.video_url} poster={video.thumbnail_url} title={video.title} />
                  ) : (
                    <div className="flex aspect-video items-center justify-center rounded-t-xl bg-stone-100">
                      <span className="text-stone-400">No video</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-medium text-stone-800 line-clamp-2">{video.title}</h3>
                    {video.description && (
                      <p className="mt-1 text-sm text-stone-500 line-clamp-2">{video.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
