import type { Metadata } from 'next'
import Link from 'next/link'
import { Phone, ChevronRight, Ruler, Shield, Truck, CheckCircle2 } from 'lucide-react'
import { QuoteForm } from '@/components/forms/QuoteForm'
import { CONTACT } from '@/lib/constants'
import { getServerApiUrl, resolveMediaUrl } from '@/lib/api-url'
import { getResponseData } from '@/lib/api-response'
import { GalleryGrid } from '@/components/shared/GalleryGrid'
import { ProductImagePanel } from '@/components/shared/ProductImagePanel'
import type { Product } from '@/types'

interface Props { params: Promise<{ slug: string }> }

function slugToName(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${getServerApiUrl()}/products/${slug}`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    return getResponseData<Product>(await res.json())
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  const name = product?.name || slugToName(slug)
  return {
    title: `${name} — Nội Thất Duy Mạnh`,
    description: product?.short_description || `Xem sản phẩm ${name} từ xưởng Nội Thất Duy Mạnh. Giá xưởng, bảo hành 5 năm.`,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)
  const name = product?.name || slugToName(slug)

  const gallery: string[] = Array.isArray(product?.gallery_urls) && product.gallery_urls.length > 0
    ? product.gallery_urls.map(resolveMediaUrl).filter(Boolean)
    : product?.thumbnail_url
      ? [resolveMediaUrl(product.thumbnail_url)]
      : []

  const specs = product?.specs && Object.keys(product.specs).length > 0
    ? Object.entries(product.specs)
    : null

  const description = product?.description?.trim() || null

  return (
    <div className="min-h-screen bg-surface-bright">
      {/* Breadcrumb */}
      <div className="border-b border-outline-variant bg-surface">
        <div className="mx-auto flex h-10 max-w-content items-center gap-1.5 px-4 text-xs text-on-surface-variant lg:px-8">
          <Link href="/" className="transition hover:text-primary">Trang chủ</Link>
          <ChevronRight size={12} className="shrink-0" />
          <Link href="/tu-bep" className="transition hover:text-primary">Tủ Bếp</Link>
          <ChevronRight size={12} className="shrink-0" />
          <span className="truncate text-primary">{name}</span>
        </div>
      </div>

      {/* ── Main panel ── */}
      <section className="bg-surface py-8 md:py-14">
        <div className="mx-auto max-w-content px-4 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">

            {/* Gallery */}
            <ProductImagePanel gallery={gallery} name={name} />

            {/* Product info */}
            <div>
              <p className="mb-2 font-label text-xs uppercase tracking-[0.22em] text-tertiary">
                {product?.category?.name || 'Tủ bếp'}
              </p>
              <h1 className="mb-4 font-headline text-3xl font-bold leading-tight text-primary md:text-4xl">{name}</h1>

              <p className="mb-6 text-body-md leading-relaxed text-on-surface-variant">
                {product?.short_description || 'Sản phẩm được sản xuất tại xưởng Duy Mạnh theo yêu cầu riêng của từng khách hàng. Vật liệu chính hãng, bảo hành 5 năm.'}
              </p>

              {/* Highlights */}
              <div className="mb-7 flex flex-wrap gap-2.5">
                {[
                  { icon: Shield, text: 'Bảo hành 5 năm' },
                  { icon: Ruler, text: 'Theo kích thước thực tế' },
                  { icon: Truck, text: 'Thi công tận nơi' },
                ].map(({ icon: Icon, text }) => (
                  <span key={text} className="flex items-center gap-1.5 rounded-full border border-outline-variant bg-surface px-3 py-1.5 font-label text-xs font-medium text-on-surface-variant shadow-sm">
                    <Icon size={13} className="shrink-0 text-tertiary" />
                    {text}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="mb-4 flex gap-3">
                <Link
                  href="/bao-gia"
                  className="flex h-12 flex-1 items-center justify-center rounded-xl bg-primary font-label text-sm font-bold uppercase tracking-widest text-on-primary shadow-cta transition hover:opacity-90"
                >
                  Nhận Báo Giá
                </Link>
                <a
                  href={`tel:${CONTACT.hotlineRaw}`}
                  className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-primary font-label text-sm font-bold uppercase tracking-widest text-primary transition hover:bg-primary/5"
                >
                  <Phone size={15} />
                  Gọi Ngay
                </a>
              </div>

              <a
                href={CONTACT.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-7 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#0068FF]/30 bg-[#0068FF]/8 font-label text-sm font-semibold text-[#0068FF] transition hover:bg-[#0068FF]/15"
              >
                Tư Vấn Qua Zalo Ngay
              </a>

              {/* Quote form */}
              <div className="rounded-2xl border border-outline-variant bg-surface p-5 shadow-card">
                <h3 className="mb-1 font-headline text-lg font-bold text-primary">Yêu Cầu Báo Giá Chi Tiết</h3>
                <p className="mb-5 text-xs text-on-surface-variant">Điền thông tin — chúng tôi gọi lại trong 24h</p>
                <QuoteForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mô tả chi tiết ── */}
      {description && (
        <section className="bg-surface-bright px-4 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-content">
            <p className="mb-3 font-label text-xs uppercase tracking-[0.22em] text-tertiary">Thông tin sản phẩm</p>
            <h2 className="mb-8 font-headline text-3xl font-bold text-primary">Mô tả chi tiết</h2>
            <div className="prose-custom max-w-3xl whitespace-pre-wrap text-body-base leading-[1.85] text-on-surface">
              {description}
            </div>
          </div>
        </section>
      )}

      {/* ── Specs ── */}
      {specs && (
        <section className={`px-4 py-16 lg:px-8 lg:py-20 ${description ? 'bg-surface' : 'bg-surface-bright'}`}>
          <div className="mx-auto max-w-content">
            <p className="mb-3 font-label text-xs uppercase tracking-[0.22em] text-tertiary">Chi tiết kỹ thuật</p>
            <h2 className="mb-8 font-headline text-3xl font-bold text-primary">Thông số kỹ thuật</h2>
            <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-card">
              {specs.map(([key, value], i) => (
                <div
                  key={key}
                  className={`flex gap-4 px-6 py-4 ${i % 2 === 0 ? 'bg-surface' : 'bg-surface-bright'}`}
                >
                  <span className="w-40 shrink-0 font-label text-sm font-medium text-on-surface-variant">{key}</span>
                  <span className="text-body-sm text-primary">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Gallery mở rộng ── */}
      {gallery.length > 1 && (
        <section className="bg-surface-bright px-4 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-content">
            <p className="mb-3 font-label text-xs uppercase tracking-[0.22em] text-tertiary">Hình ảnh thực tế</p>
            <h2 className="mb-8 font-headline text-3xl font-bold text-primary">Thư viện ảnh</h2>
            <GalleryGrid images={gallery} altPrefix={name} columns={3} />
          </div>
        </section>
      )}

      {/* ── Giới thiệu xưởng (fallback khi không có description) ── */}
      {!description && (
        <section className="bg-surface px-4 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-content">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="mb-3 font-label text-xs uppercase tracking-[0.22em] text-tertiary">Vì sao chọn chúng tôi</p>
                <h2 className="mb-6 font-headline text-3xl font-bold leading-tight text-primary md:text-4xl">
                  Xưởng sản xuất <br className="hidden lg:block" />trực tiếp, giá tốt nhất
                </h2>
                <p className="mb-8 text-body-lg leading-relaxed text-on-surface-variant">
                  Nội Thất Duy Mạnh sản xuất trực tiếp tại xưởng, không qua trung gian — giúp tiết kiệm 20–30% chi phí so với mua tại showroom. Mỗi sản phẩm đều được đo đạc, thiết kế và thi công theo kích thước thực tế của từng không gian.
                </p>
                <ul className="space-y-3">
                  {[
                    'Sản xuất đúng kích thước yêu cầu',
                    'Vật liệu chính hãng: Inox 304, Acrylic, MDF phủ Melamine',
                    'Đội thợ thi công có kinh nghiệm 10+ năm',
                    'Bảo hành 5 năm, bảo trì trọn đời',
                    'Hơn 500 công trình đã hoàn thành tại Hà Nội và các tỉnh',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-body-sm text-on-surface">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-tertiary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#efe5d9,#b7c7c2)] shadow-card">
                <div className="aspect-[4/3] flex items-center justify-center">
                  <span className="font-label text-xs uppercase tracking-widest text-primary/50">Ảnh xưởng sản xuất</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA cuối trang ── */}
      <section className="bg-primary px-4 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-content text-center">
          <p className="mb-3 font-label text-xs uppercase tracking-[0.22em] text-on-primary/60">Liên hệ ngay</p>
          <h2 className="mb-4 font-headline text-3xl font-bold text-on-primary md:text-4xl">
            Nhận báo giá miễn phí trong 24h
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-body-lg text-on-primary/80">
            Gọi hoặc nhắn Zalo để được tư vấn kích thước, vật liệu và nhận bản vẽ 3D miễn phí.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`tel:${CONTACT.hotlineRaw}`}
              className="flex items-center gap-2 rounded-xl bg-on-primary px-7 py-3.5 font-label text-sm font-bold uppercase tracking-widest text-primary shadow-cta transition hover:opacity-90"
            >
              <Phone size={15} />
              {CONTACT.hotline}
            </a>
            <a
              href={CONTACT.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border-2 border-on-primary/40 px-7 py-3.5 font-label text-sm font-bold uppercase tracking-widest text-on-primary transition hover:border-on-primary/70"
            >
              Nhắn Zalo
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
