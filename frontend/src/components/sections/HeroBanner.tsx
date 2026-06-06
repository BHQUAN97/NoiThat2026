import Link from 'next/link'
import { Phone } from 'lucide-react'
import { CONTACT } from '@/lib/constants'

interface HeroBannerProps {
  title?: string
  subtitle?: string
  imageUrl?: string
}

// Banner chính trang chủ — full-width, text overlay, 2 CTA buttons
export function HeroBanner({
  title = 'Tủ Bếp & Nội Thất Cao Cấp\nTại Xưởng Sản Xuất',
  subtitle = 'Thiết kế theo yêu cầu — Thi công chuyên nghiệp — Bảo hành 5 năm\nPhục vụ Hà Nội và các tỉnh lân cận',
  imageUrl,
}: HeroBannerProps) {
  return (
    <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center overflow-hidden bg-stone-900">
      {/* Background image */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Nội thất Duy Mạnh"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
      ) : (
        // Placeholder gradient khi chưa có ảnh thực
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 opacity-90" />
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-content mx-auto px-4 lg:px-8 py-16 md:py-20">
        <div className="max-w-2xl">
          {/* Label */}
          <p className="inline-flex items-center gap-2 text-brand text-sm font-semibold uppercase tracking-widest mb-4">
            <span className="w-8 h-px bg-brand" />
            Xưởng Sản Xuất Trực Tiếp
          </p>

          {/* Heading */}
          <h1 className="font-serif font-bold text-white leading-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.1' }}
          >
            {title.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i < title.split('\n').length - 1 && <br />}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p className="text-stone-300 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
            {subtitle.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i < subtitle.split('\n').length - 1 && <br />}
              </span>
            ))}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/bao-gia"
              className="inline-flex items-center px-6 py-3 bg-brand text-white font-semibold rounded hover:bg-primary-dark transition-colors duration-200 shadow-cta text-sm md:text-base"
            >
              Nhận Báo Giá Miễn Phí
            </Link>
            <a
              href={`tel:${CONTACT.hotlineRaw}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded hover:bg-white/20 transition-colors duration-200 text-sm md:text-base"
            >
              <Phone size={16} />
              {CONTACT.hotline}
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            {[
              '10+ năm kinh nghiệm',
              '500+ công trình hoàn thành',
              'Bảo hành 5 năm',
            ].map((badge) => (
              <span key={badge} className="flex items-center gap-1.5 text-stone-300 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
