import { Mail, Phone } from 'lucide-react'
import { QuoteForm } from '@/components/forms/QuoteForm'
import { CONTACT } from '@/lib/constants'

export function QuoteFormSection() {
  return (
    <section className="bg-primary px-4 py-20 md:px-8 md:py-32" id="consultation">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
        <div className="text-surface">
          <span className="mb-4 block font-label text-xs uppercase tracking-[0.2em] text-on-primary-container">
            Begin the Journey
          </span>
          <h2 className="mb-8 font-headline text-4xl font-bold leading-tight md:text-6xl">
            Sẵn sàng định hình không gian của bạn?
          </h2>
          <p className="mb-12 max-w-lg text-body-lg leading-relaxed text-surface/70">
            Gửi kích thước, vật liệu mong muốn hoặc ảnh hiện trạng. Đội ngũ tư vấn sẽ phản hồi
            phương án và khoảng giá trong 24 giờ.
          </p>

          <div className="space-y-8">
            <a href={`tel:${CONTACT.hotlineRaw}`} className="flex items-start gap-6">
              <span className="rounded-lg bg-surface/10 p-3 backdrop-blur-sm">
                <Phone className="h-5 w-5 text-surface" />
              </span>
              <span>
                <span className="mb-1 block font-label text-[10px] uppercase tracking-widest text-surface/60">
                  Direct Line
                </span>
                <span className="font-headline text-xl font-bold text-surface">{CONTACT.hotline}</span>
              </span>
            </a>
            <a href={`mailto:${CONTACT.email}`} className="flex items-start gap-6">
              <span className="rounded-lg bg-surface/10 p-3 backdrop-blur-sm">
                <Mail className="h-5 w-5 text-surface" />
              </span>
              <span>
                <span className="mb-1 block font-label text-[10px] uppercase tracking-widest text-surface/60">
                  Email Inquiry
                </span>
                <span className="font-headline text-xl font-bold text-surface">{CONTACT.email}</span>
              </span>
            </a>
          </div>
        </div>

        <div className="rounded-2xl bg-surface p-6 shadow-ambient-lg md:p-10">
          <h3 className="mb-8 font-headline text-2xl font-bold text-primary">
            Nhận tư vấn & báo giá
          </h3>
          <QuoteForm />
        </div>
      </div>
    </section>
  )
}
