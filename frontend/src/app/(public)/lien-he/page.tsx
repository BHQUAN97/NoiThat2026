import type { Metadata } from 'next'
import { Phone, MapPin, Clock, Mail } from 'lucide-react'
import { CONTACT } from '@/lib/constants'
import { PageBanner } from '@/components/shared/PageBanner'
import { ContactForm } from './ContactForm'
import { getServerApiUrl } from '@/lib/api-url'

export const metadata: Metadata = {
  title: 'Liên Hệ — Nội Thất Duy Mạnh',
  description: 'Liên hệ xưởng Nội Thất Duy Mạnh. Hotline: 094.872.8091. Địa chỉ: Vân Nam - Phúc Thọ - Hà Nội.',
}

const DEFAULT_MAPS_URL =
  'https://maps.google.com/maps?q=V%C3%A2n+Nam+Ph%C3%BAc+Th%E1%BB%8D+H%C3%A0+N%E1%BB%99i&t=&z=14&ie=UTF8&iwloc=&output=embed'

async function getMapsUrl(): Promise<string> {
  try {
    const res = await fetch(`${getServerApiUrl()}/settings/public`, {
      next: { revalidate: 3600, tags: ['settings'] },
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) return DEFAULT_MAPS_URL
    const json = await res.json()
    const data: Record<string, string> = json?.data ?? json
    return data?.google_maps_embed_url || DEFAULT_MAPS_URL
  } catch {
    return DEFAULT_MAPS_URL
  }
}

export default async function ContactPage() {
  const mapsUrl = await getMapsUrl()
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

              {/* Google Maps */}
              <div className="mt-6 aspect-[4/3] rounded-xl overflow-hidden border border-border">
                <iframe
                  src={mapsUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bản đồ xưởng Nội Thất Duy Mạnh"
                />
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
