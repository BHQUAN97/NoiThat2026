import type { Metadata } from 'next'
import { Phone, MapPin, Clock, Mail } from 'lucide-react'
import { CONTACT } from '@/lib/constants'
import { PageBanner } from '@/components/shared/PageBanner'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Liên Hệ — Nội Thất Duy Mạnh',
  description: 'Liên hệ xưởng Nội Thất Duy Mạnh. Hotline: 094.872.8091. Địa chỉ: Vân Nam - Phúc Thọ - Hà Nội.',
}

export default function ContactPage() {
  return (
    <>
      <PageBanner
        slug="lien-he"
        title="Liên Hệ Với Chúng Tôi"
        subtitle="Sẵn sàng tư vấn miễn phí — Thứ 2 đến Chủ Nhật, 8h-18h"
        label="Liên Hệ"
      />

      <section className="py-16 bg-white">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Thông tin liên hệ */}
            <div>
              <h2 className="font-serif font-bold text-stone-900 text-2xl mb-6">Thông Tin Liên Hệ</h2>
              <div className="space-y-4">
                <a
                  href={`tel:${CONTACT.hotlineRaw}`}
                  className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl border border-border hover:border-brand/30 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center group-hover:bg-brand/20 transition-colors">
                    <Phone size={22} className="text-brand" />
                  </div>
                  <div>
                    <p className="text-stone-500 text-xs mb-0.5">Hotline</p>
                    <p className="font-bold text-stone-900 text-xl">{CONTACT.hotline}</p>
                  </div>
                </a>
                <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center">
                    <MapPin size={22} className="text-brand" />
                  </div>
                  <div>
                    <p className="text-stone-500 text-xs mb-0.5">Địa chỉ xưởng</p>
                    <p className="font-semibold text-stone-900">{CONTACT.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center">
                    <Clock size={22} className="text-brand" />
                  </div>
                  <div>
                    <p className="text-stone-500 text-xs mb-0.5">Giờ làm việc</p>
                    <p className="font-semibold text-stone-900">Thứ 2 – Chủ Nhật: {CONTACT.workHours}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center">
                    <Mail size={22} className="text-brand" />
                  </div>
                  <div>
                    <p className="text-stone-500 text-xs mb-0.5">Email</p>
                    <a href={`mailto:${CONTACT.email}`} className="font-semibold text-stone-900 hover:text-brand transition-colors">
                      {CONTACT.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Google Maps placeholder */}
              <div className="mt-6 aspect-[4/3] bg-stone-100 rounded-xl overflow-hidden border border-border flex items-center justify-center">
                <p className="text-stone-400 text-sm">Google Maps sẽ được nhúng tại đây</p>
              </div>
            </div>

            {/* Form liên hệ */}
            <div>
              <h2 className="font-serif font-bold text-stone-900 text-2xl mb-6">Gửi Tin Nhắn</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
