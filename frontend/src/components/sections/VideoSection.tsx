import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'

interface Video {
  id: string
  title: string
  youtube_url: string
  thumbnail_url: string | null
  type: 'thi_cong' | 'ban_giao' | 'khao_sat'
}

interface VideoSectionProps {
  videos?: Video[]
}

// Extract YouTube video ID từ URL
function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

const TYPE_LABELS = {
  thi_cong: 'Thi Công',
  ban_giao: 'Bàn Giao',
  khao_sat: 'Khảo Sát',
}

// Section video công trình — grid 3 video YouTube
export function VideoSection({ videos = [] }: VideoSectionProps) {
  const displayVideos = videos.length > 0 ? videos : [
    { id: '1', title: 'Thi công tủ bếp Inox 304 tại Hà Nội', youtube_url: '', thumbnail_url: null, type: 'thi_cong' as const },
    { id: '2', title: 'Bàn giao nội thất phòng ngủ tại Bắc Ninh', youtube_url: '', thumbnail_url: null, type: 'ban_giao' as const },
    { id: '3', title: 'Khảo sát và tư vấn tại nhà khách hàng', youtube_url: '', thumbnail_url: null, type: 'khao_sat' as const },
  ]

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-content mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-2">Video</p>
            <h2 className="font-serif font-bold text-stone-900 text-3xl md:text-4xl leading-tight">
              Video Công Trình
            </h2>
          </div>
          <Link
            href="/video-cong-trinh"
            className="inline-flex items-center gap-1.5 text-brand font-semibold text-sm hover:gap-2.5 transition-all duration-200 shrink-0"
          >
            Xem tất cả <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayVideos.map((video) => {
            const ytId = getYouTubeId(video.youtube_url)
            const thumbnail = video.thumbnail_url || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null)

            const isPlayable = Boolean(video.youtube_url)
            const CardTag = isPlayable ? 'a' : 'div'

            return (
              <CardTag
                key={video.id}
                {...(isPlayable ? { href: video.youtube_url, target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group overflow-hidden rounded-xl bg-stone-100 shadow-card transition-shadow duration-300 hover:shadow-card-hover"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-stone-200 overflow-hidden">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-stone-700 to-stone-900" />
                  )}
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 group-hover:bg-brand group-hover:scale-110 flex items-center justify-center transition-all duration-300 shadow-lg">
                      <Play size={18} className="text-stone-900 group-hover:text-white ml-0.5 transition-colors" />
                    </div>
                  </div>
                  {/* Type badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 bg-brand text-white text-xs font-semibold rounded">
                      {TYPE_LABELS[video.type]}
                    </span>
                  </div>
                </div>
                {/* Title */}
                <div className="p-3">
                  <h3 className="font-medium text-stone-800 text-sm line-clamp-2 group-hover:text-brand transition-colors duration-200">
                    {video.title}
                  </h3>
                </div>
              </CardTag>
            )
          })}
        </div>
      </div>
    </section>
  )
}
