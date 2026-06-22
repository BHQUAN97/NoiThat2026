import type { Metadata } from 'next'
import { getServerApiUrl, resolveMediaUrl } from '@/lib/api-url'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  let faviconUrl = '/favicon.ico'
  try {
    const res = await fetch(`${getServerApiUrl()}/settings/public`, {
      next: { revalidate: 60, tags: ['settings'] },
      signal: AbortSignal.timeout(3000),
    })
    if (res.ok) {
      const json = await res.json()
      const data: Record<string, string> = json?.data ?? json
      const logo = resolveMediaUrl(data?.logo_url)
      if (logo) faviconUrl = logo
    }
  } catch { /* API unavailable — use default favicon */ }

  return {
    title: {
      default: 'Nội Thất Duy Mạnh — Tủ Bếp & Nội Thất Gia Đình',
      template: '%s | Nội Thất Duy Mạnh',
    },
    description:
      'Xưởng sản xuất và thi công tủ bếp, nội thất gia đình tại Vân Nam - Phúc Thọ - Hà Nội. Tủ bếp Inox 304, Acrylic, Cánh Kính. Hotline: 094.872.8091',
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8082'
    ),
    icons: { icon: faviconUrl },
    openGraph: {
      type: 'website',
      locale: 'vi_VN',
      siteName: 'Nội Thất Duy Mạnh',
    },
    keywords: ['tủ bếp', 'nội thất', 'tủ bếp inox', 'tủ bếp acrylic', 'Phúc Thọ', 'Hà Nội', 'Duy Mạnh'],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
        {/* VietNet prototype typography: Noto Serif (headline) + Manrope (body/label) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&family=Manrope:wght@300;400;500;600;700;800&display=swap"
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
