import Link from 'next/link'
import { Phone, MapPin, Clock, Mail } from 'lucide-react'
import { CONTACT, NAV_LINKS, PRODUCT_CATEGORIES } from '@/lib/constants'

// Footer 4 cột: thông tin công ty | danh mục SP | dự án nổi bật | liên hệ
export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-content mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Cột 1: Thông tin công ty */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
                <span className="text-white font-serif font-bold text-base">D</span>
              </div>
              <span className="font-serif font-bold text-white text-base">Nội Thất Duy Mạnh</span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed mb-4">
              Xưởng sản xuất và thi công tủ bếp, nội thất gia đình uy tín tại Hà Nội. Cam kết chất lượng, giá tốt, bảo hành dài hạn.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-2">
              <a
                href={CONTACT.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-stone-700 hover:bg-brand flex items-center justify-center transition-colors duration-200"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href={CONTACT.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-stone-700 hover:bg-[#0068FF] flex items-center justify-center transition-colors duration-200 text-xs font-bold text-white"
                aria-label="Zalo"
              >
                Zalo
              </a>
            </div>
          </div>

          {/* Cột 2: Danh mục sản phẩm */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Danh Mục Sản Phẩm</h3>
            <ul className="flex flex-col gap-2">
              {PRODUCT_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={cat.href}
                    className="text-sm text-stone-400 hover:text-brand transition-colors duration-200"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Dự án nổi bật */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Dự Án Nổi Bật</h3>
            <ul className="flex flex-col gap-2">
              {[
                { label: 'Công Trình Hà Nội', href: '/du-an-thuc-te?province=hanoi' },
                { label: 'Công Trình Bắc Ninh', href: '/du-an-thuc-te?province=bacninh' },
                { label: 'Công Trình Hưng Yên', href: '/du-an-thuc-te?province=hungyen' },
                { label: 'Công Trình Phú Thọ', href: '/du-an-thuc-te?province=phutho' },
                { label: 'Công Trình Ninh Bình', href: '/du-an-thuc-te?province=ninhbinh' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-stone-400 hover:text-brand transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Liên Hệ</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href={`tel:${CONTACT.hotlineRaw}`}
                  className="flex items-start gap-2 text-sm text-stone-400 hover:text-brand transition-colors duration-200"
                >
                  <Phone size={15} className="shrink-0 mt-0.5" />
                  <span className="font-semibold text-white">{CONTACT.hotline}</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-stone-400">
                <MapPin size={15} className="shrink-0 mt-0.5 text-brand" />
                <span>{CONTACT.address}</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-stone-400">
                <Clock size={15} className="shrink-0 mt-0.5" />
                <span>Thứ 2 - Chủ Nhật: {CONTACT.workHours}</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-stone-400">
                <Mail size={15} className="shrink-0 mt-0.5" />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-brand transition-colors">
                  {CONTACT.email}
                </a>
              </li>
            </ul>

            <Link
              href="/bao-gia"
              className="mt-4 inline-flex items-center px-4 py-2 bg-brand text-white text-sm font-semibold rounded hover:bg-primary-dark transition-colors duration-200"
            >
              Nhận Báo Giá Ngay
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-800">
        <div className="max-w-content mx-auto px-4 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
          <span>© {currentYear} Nội Thất Duy Mạnh. Bảo lưu mọi quyền.</span>
          <span>Thiết kế bởi VietNet Technology</span>
        </div>
      </div>
    </footer>
  )
}
