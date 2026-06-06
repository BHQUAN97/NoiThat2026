import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Nội Thất Duy Mạnh — Tủ Bếp & Nội Thất Gia Đình',
    template: '%s | Nội Thất Duy Mạnh',
  },
  description:
    'Xưởng sản xuất và thi công tủ bếp, nội thất gia đình tại Vân Nam - Phúc Thọ - Hà Nội. Tủ bếp Inox 304, Acrylic, Cánh Kính. Hotline: 094.872.8091',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8082'
  ),
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Nội Thất Duy Mạnh',
  },
  keywords: ['tủ bếp', 'nội thất', 'tủ bếp inox', 'tủ bếp acrylic', 'Phúc Thọ', 'Hà Nội', 'Duy Mạnh'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
        {/* Merriweather (heading) + Inter (body) — Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Preconnect R2 CDN */}
        <link rel="preconnect" href="https://pub-noithat.r2.dev" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen antialiased font-body bg-background text-on-surface">
        {children}
      </body>
    </html>
  )
}
