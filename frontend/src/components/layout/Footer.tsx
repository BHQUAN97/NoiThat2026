'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { CONTACT, NAV_LINKS, SITE_NAME } from '@/lib/constants'

const MAPS_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3722.4!2d105.5!3d21.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zTuG7mWkgVGjhuqV0IER1eSBN4bqhbmggLSBWw6JuIE5hbSAtIFBow7pjIFToqJUsIEjDoCBO4buZaQ!5e0!3m2!1svi!2svn!4v1'

export function Footer() {
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) return null

  return (
    <footer className="bg-primary pb-28 pt-16 text-surface md:pb-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">

        {/* Cột 1 — Thương hiệu */}
        <div className="lg:col-span-1">
          <Link href="/" className="font-headline text-2xl font-bold tracking-tight text-surface">
            {SITE_NAME}
          </Link>
          <p className="mt-5 text-body-sm leading-relaxed text-surface/70">
            Xưởng sản xuất và thi công tủ bếp, nội thất gia đình theo yêu cầu.
            Tập trung vào vật liệu, ảnh công trình và quy trình rõ ràng.
          </p>
          <div className="mt-7 flex items-center gap-3">
            <a
              href={CONTACT.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface/10 font-label text-label-sm font-bold transition-colors hover:bg-surface/20"
              aria-label="Zalo"
            >
              Za
            </a>
            <a
              href={CONTACT.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface/10 transition-colors hover:bg-surface/20"
              aria-label="Facebook"
            >
              Fb
            </a>
            <a
              href={`tel:${CONTACT.hotlineRaw}`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface/10 transition-colors hover:bg-surface/20"
              aria-label="Gọi điện"
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Cột 2 — Điều hướng */}
        <div>
          <h4 className="border-b border-surface/10 pb-2 font-label text-xs font-bold uppercase tracking-widest text-surface">
            Điều hướng
          </h4>
          <div className="mt-5 grid grid-cols-1 gap-2.5 text-body-sm">
            {NAV_LINKS.slice(0, 8).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-surface/70 transition-colors hover:text-surface"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Cột 3 — Liên hệ */}
        <div>
          <h4 className="border-b border-surface/10 pb-2 font-label text-xs font-bold uppercase tracking-widest text-surface">
            Liên hệ showroom
          </h4>
          <div className="mt-5 space-y-3.5 text-body-sm text-surface/70">
            <a href={`tel:${CONTACT.hotlineRaw}`} className="flex items-start gap-3 transition-colors hover:text-surface">
              <Phone className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{CONTACT.hotline}</span>
            </a>
            <a href={`mailto:${CONTACT.email}`} className="flex items-start gap-3 break-all transition-colors hover:text-surface">
              <Mail className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{CONTACT.email}</span>
            </a>
            <p className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{CONTACT.address}</span>
            </p>
            <p className="italic text-surface/60">Mở cửa {CONTACT.workHours} hàng ngày.</p>
          </div>
          <Link
            href="/bao-gia"
            className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-surface px-5 py-3 font-label text-label-lg font-bold uppercase tracking-label-wide text-primary transition-colors hover:bg-secondary-container"
          >
            Nhận tư vấn
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Cột 4 — Google Maps */}
        <div>
          <h4 className="border-b border-surface/10 pb-2 font-label text-xs font-bold uppercase tracking-widest text-surface">
            Vị trí showroom
          </h4>
          <div className="mt-5 overflow-hidden rounded-xl" style={{ height: 200 }}>
            <iframe
              src={MAPS_URL}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ Nội Thất Duy Mạnh"
            />
          </div>
          <p className="mt-2.5 text-[11px] leading-relaxed text-surface/50">
            Vân Nam — Phúc Thọ — Hà Nội
          </p>
        </div>

      </div>

      <div className="mx-auto mt-14 max-w-7xl border-t border-surface/5 px-8 pt-8 text-center">
        <p className="font-label text-[10px] uppercase tracking-widest text-surface/40">
          © {new Date().getFullYear()} {SITE_NAME}. Mọi quyền được bảo lưu.
        </p>
      </div>
    </footer>
  )
}
