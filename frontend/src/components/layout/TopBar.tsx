'use client'

import Link from 'next/link'
import { Phone, MapPin, Clock } from 'lucide-react'
import { CONTACT } from '@/lib/constants'

// Thanh thông tin đầu trang — ẩn trên mobile (sm breakpoint)
export function TopBar() {
  return (
    <div className="hidden md:block md:fixed md:top-0 md:left-0 md:right-0 md:z-50 bg-stone-900 text-stone-300 text-sm">
      <div className="max-w-content mx-auto px-4 lg:px-8 h-10 flex items-center justify-between">
        {/* Thông tin liên hệ bên trái */}
        <div className="flex items-center gap-6">
          <a
            href={`tel:${CONTACT.hotlineRaw}`}
            className="flex items-center gap-1.5 hover:text-brand transition-colors duration-200"
          >
            <Phone size={13} className="shrink-0" />
            <span className="font-medium">{CONTACT.hotline}</span>
          </a>
          <span className="flex items-center gap-1.5">
            <MapPin size={13} className="shrink-0" />
            <span>{CONTACT.address}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} className="shrink-0" />
            <span>{CONTACT.workHours}</span>
          </span>
        </div>

        {/* CTA buttons bên phải */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${CONTACT.hotlineRaw}`}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-brand text-white text-xs font-semibold hover:bg-primary-dark transition-colors duration-200"
          >
            <Phone size={12} />
            Gọi Ngay
          </a>
          <a
            href={CONTACT.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#0068FF] text-white text-xs font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Zalo Tư Vấn
          </a>
          <Link
            href="/bao-gia"
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-stone-700 text-white text-xs font-semibold hover:bg-stone-600 transition-colors duration-200"
          >
            Nhận Báo Giá
          </Link>
        </div>
      </div>
    </div>
  )
}
