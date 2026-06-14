import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const DEFAULT_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAUH7WPHs7Hdu5hOLGrf6EuKO5To8WzIOMWY0x_WHYgsIPpL6374msknhNrOGdRNlhRyaNY_6C8yFyD9Jb9kwWt6BVl8UDmk2Puf5C5JOCEwpwqYOJpb_wivvrJlRnFjLg0bcPUtdLcdUXL_2ssmNkCOvFpNXVB841-MeAiLhnbdBO2N0MTcBKKNCOAWkjdXwRo0fKeJp8sshokh3mSVA8WW_q-SMfxi-ot7h559D8g1BCjglMUSi-fnT3RgBlH2uryZzTn51wgB7gK',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDvB3-HpRPKYcrraeXQYFcMfo51YpjCax6qv4WHMDJr6V-gxo9SnL5g5pL3W3fjAoaWKN6YacxNx5-yYG0Eig6vNG-pQtEdO0s-Gy4hLDikAcHkYCy-RyXQgfL2FTn_C721v6UO9fjBkfeSb1T8IS4AZcCxiw33Y5Ti6WCLA6Umepze-5sS247y2XF4e1FfUFkqQMTsUmfx2tP6DWC9JzcaMm5zHdR75QYUoRFGzFU9lvkI4E8wZ5ISAYcwAMdNUY3xbiI4_GJXPVzo',
]

const DEFAULT_STATS = [
  { value: '500+', label: 'Công trình hoàn thành' },
  { value: '10+', label: 'Năm kinh nghiệm' },
]

interface ImgItem { url: string; pos?: string }

interface CompanyIntroProps {
  label?: string
  headline?: string
  body?: string
  quote?: string
  stats?: Array<{ value: string; label: string }>
  images?: Array<string | ImgItem>
  linkText?: string
  linkHref?: string
}

export function CompanyIntro({
  label = 'The Atelier Philosophy',
  headline = 'Thiết kế là cuộc đối thoại giữa vật liệu, ánh sáng và thói quen sống.',
  body = 'Nội Thất Duy Mạnh tập trung vào các hệ tủ bếp, tủ áo và không gian gia đình được đo ni đóng giày theo từng căn nhà. Ngôn ngữ VietNet giúp phần trình bày giữ được cảm giác cao cấp, có khoảng thở và đặt ảnh công trình ở vị trí trung tâm.',
  quote = 'Không chỉ lấp đầy căn phòng, chúng tôi hoàn thiện bầu không khí của ngôi nhà.',
  stats = DEFAULT_STATS,
  images = [],
  linkText = 'Xem quy trình',
  linkHref = '/gioi-thieu',
}: CompanyIntroProps) {
  function resolveItem(v: string | ImgItem | undefined, fallback: string): ImgItem {
    if (!v) return { url: fallback, pos: 'center' }
    if (typeof v === 'string') return { url: v || fallback, pos: 'center' }
    return { url: v.url || fallback, pos: v.pos || 'center' }
  }

  const img0 = resolveItem(images?.[0], DEFAULT_IMAGES[0])
  const img1 = resolveItem(images?.[1], DEFAULT_IMAGES[1])

  return (
    <section className="bg-surface px-4 py-20 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          {label && (
            <span className="mb-4 block font-label text-xs uppercase tracking-[0.2em] text-primary">
              {label}
            </span>
          )}
          <h2 className="mb-8 font-headline text-4xl font-bold leading-tight text-primary md:text-5xl">
            {headline}
          </h2>
          <p className="mb-6 text-body-lg leading-relaxed text-on-surface-variant">{body}</p>
          {quote && (
            <p className="mb-8 text-body-lg italic leading-relaxed text-on-surface-variant">
              "{quote}"
            </p>
          )}
          {stats && stats.length > 0 && (
            <div className={`grid grid-cols-${Math.min(stats.length, 4)} gap-8 border-t border-outline-variant/30 pt-8`}>
              {stats.map((stat, i) => (
                <div key={i}>
                  <p className="font-headline text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}
          <Link
            href={linkHref}
            className="mt-8 inline-flex items-center gap-2 font-label text-label-lg font-bold uppercase tracking-label-wide text-primary transition-all hover:gap-4"
          >
            {linkText}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:col-span-7">
          <div className="pt-12">
            <img
              className="h-[360px] w-full rounded-2xl object-cover shadow-ambient-lg md:h-[440px]"
              src={img0.url}
              alt="Nội thất cao cấp"
              style={{ objectPosition: img0.pos }}
            />
          </div>
          <div>
            <img
              className="h-[360px] w-full rounded-2xl object-cover shadow-ambient-lg md:h-[440px]"
              src={img1.url}
              alt="Chi tiết không gian nội thất"
              style={{ objectPosition: img1.pos }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
