import type { Metadata } from 'next'
import { getServerApiUrl } from '@/lib/api-url'
import { getListData } from '@/lib/api-response'
import type { Video } from '@/types'
import { VideoCard } from './VideoCard'

export const metadata: Metadata = {
  title: 'Video công trình - Nội Thất Duy Mạnh',
  description: 'Xem video thi công, bàn giao và khảo sát công trình tủ bếp nội thất của Duy Mạnh.',
}

async function getVideos(): Promise<Video[]> {
  try {
    const apiUrl = getServerApiUrl()
    const res = await fetch(`${apiUrl}/videos`, { next: { revalidate: 300 } })
    if (!res.ok) return []
    return getListData<Video>(await res.json())
  } catch {
    return []
  }
}

export default async function VideoPage() {
  const videos = await getVideos()

  return (
    <>
      <section className="bg-surface px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-content">
          <p className="mb-4 font-label text-xs uppercase tracking-[0.22em] text-tertiary">Video</p>
          <h1 className="font-headline text-4xl font-bold leading-tight text-primary md:text-6xl">Video công trình</h1>
          <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-on-surface-variant">
            Theo dõi quá trình thi công, bàn giao và khảo sát thực tế qua video.
          </p>
        </div>
      </section>

      <section className="bg-surface-bright px-4 py-14 lg:px-8">
        <div className="mx-auto max-w-content">
          {videos.length === 0 ? (
            <div className="rounded-xl bg-surface-container-low px-6 py-16 text-center">
              <p className="font-headline text-2xl font-bold text-primary">Chưa có video</p>
              <p className="mt-2 text-body-sm text-on-surface-variant">Video công trình sẽ hiển thị tại đây khi được cập nhật trong admin.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
