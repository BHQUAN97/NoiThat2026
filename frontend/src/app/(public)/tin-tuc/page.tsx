import type { Metadata } from 'next'
import Link from 'next/link'
import { NewsGrid } from './NewsGrid'

export const metadata: Metadata = {
  title: 'Tin tức & Kinh nghiệm nội thất - Nội Thất Duy Mạnh',
  description:
    'Kinh nghiệm chọn tủ bếp, so sánh vật liệu, xu hướng nội thất mới nhất và bảng giá nội thất cập nhật.',
}

export default function NewsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-surface px-4 py-20 lg:px-8 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(47,85,85,0.13),transparent_34%),linear-gradient(135deg,#fffdf8_0%,#fbf7f0_54%,#efe5d9_100%)]" />
        <div className="relative mx-auto grid max-w-content items-end gap-8 lg:grid-cols-[0.8fr_1fr]">
          <div>
            <nav className="mb-7 font-label text-xs uppercase tracking-widest text-on-surface-variant">
              <Link href="/" className="transition hover:text-primary">Trang chủ</Link>
              <span className="mx-3 text-outline">/</span>
              <span className="text-primary">Tin tức</span>
            </nav>
            <p className="mb-4 font-label text-xs uppercase tracking-[0.22em] text-tertiary">Blog</p>
            <h1 className="font-headline text-4xl font-bold leading-tight text-primary md:text-6xl">
              Tin tức & Kinh nghiệm
            </h1>
          </div>
          <p className="max-w-xl text-body-lg leading-relaxed text-on-surface-variant lg:justify-self-end">
            Chia sẻ kiến thức, kinh nghiệm chọn vật liệu và xu hướng nội thất mới nhất từ đội ngũ thợ Duy Mạnh.
          </p>
        </div>
      </section>

      <NewsGrid />
    </>
  )
}
