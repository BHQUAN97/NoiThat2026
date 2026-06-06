import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tủ bếp - Inox 304, Acrylic, Cánh kính',
  description:
    'Xưởng sản xuất tủ bếp Inox 304, Acrylic bóng gương, Cánh kính cao cấp. Giá xưởng, bảo hành 5 năm. Phục vụ Hà Nội và các tỉnh.',
}

const CATEGORY_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAFVMp4te8SXY5NkbR163ii3Zbycmbn14ECs1x7Q44xERmpjHcl3eojOjpu-cLftnq9PafiUDIOlvz9sLTEU5hH4d_EivfirG8S5OxhdnVYnQkQwSjDF49RXorL-naiOdCn_2jDai8yHbB7mRlf5Gbdzb3HCeekW3Mu-J7JxgSogHJzijkq8tpUSPFBFbDjUr_vbwfwi2kY1yvHQLv6GFfBLvbHymJe6uTA47soXRcQp4nEJ1Bh27jkxwUcKeeTjCZn36NHpWisZBUX',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDwfeHoOrk-kROj0eXhrnGye_hAr8ZH0DCFNLAUSOVKtSc_LghRAqLiIIgU7EgezwZay5NJrDFqpAb5oqTcn_87eC8kEX1i4ENGRE3ewahTMz2lx3vA7aXH3Ll8LZWnc3f1wv4UZsM6su6MvA9FgI8IiKD2EWDztbM-AdmQ1aUsgmCqbsjHySx4rOhn_12iSpbCddBWcIQ_Nto5uRsr8LiyA_6zuHKMqOFiGXINKm2lJW7GnVXG-k1fXPcIqQ4hWSKDz0iFm1mLtpcA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAyedTNnDcb5WkuOBVaW1Wof3ATrIgW-7aJIT3JX8tPlt9ekzp2TqZJezUCmHe4coXAQTWYlsLNRbq-D3Vm6DCjkgsrxmRsyE9wnWVXFega1s5u6xnxmAc4HHX4J8OfsmlFg-XGuvkiNBies8931Qbg16X5jUClOtbQHxINu5oorCqvVVvsPlhUjOlwwypAN8_AHk3yz4S_w_DE4-XsKdQXwl2ClWe0xs5SDtYp3ngLkmRyD8tokMv2sv7CgQzYcRRVNLjaQzk9j9Wl',
]

const CATEGORIES = [
  {
    slug: 'tu-bep-inox-304',
    name: 'Tủ bếp Inox 304',
    desc: 'Khung xương Inox 304 chính hãng, hàn TIG chuyên dụng, chống rỉ và phù hợp gia đình cần độ bền cao.',
    badge: 'Bán chạy',
    image: CATEGORY_IMAGES[0],
  },
  {
    slug: 'tu-bep-canh-kinh',
    name: 'Tủ bếp cánh kính',
    desc: 'Cánh kính cường lực hoặc kính lùa, bề mặt sắc nét, dễ vệ sinh và hợp phong cách căn hộ hiện đại.',
    badge: 'Cao cấp',
    image: CATEGORY_IMAGES[1],
  },
  {
    slug: 'tu-bep-acrylic',
    name: 'Tủ bếp Acrylic',
    desc: 'Bề mặt bóng gương, nhiều màu lựa chọn, tạo cảm giác rộng và sáng cho không gian bếp.',
    badge: 'Xu hướng',
    image: CATEGORY_IMAGES[2],
  },
]

export default function KitchenCabinetPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-surface px-4 py-20 lg:px-8 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(47,85,85,0.13),transparent_34%),linear-gradient(135deg,#fffdf8_0%,#fbf7f0_54%,#efe5d9_100%)]" />
        <div className="relative mx-auto max-w-content">
          <nav className="mb-7 font-label text-xs uppercase tracking-widest text-on-surface-variant">
            <Link href="/" className="transition hover:text-primary">Trang chủ</Link>
            <span className="mx-3 text-outline">/</span>
            <span className="text-primary">Tủ bếp</span>
          </nav>
          <div className="grid items-end gap-8 lg:grid-cols-[0.8fr_1fr]">
            <div>
              <p className="mb-4 font-label text-xs uppercase tracking-[0.22em] text-tertiary">Danh mục sản phẩm</p>
              <h1 className="font-headline text-4xl font-bold leading-tight text-primary md:text-6xl">
                Tủ bếp thiết kế theo không gian thật
              </h1>
            </div>
            <p className="max-w-xl text-body-lg leading-relaxed text-on-surface-variant lg:justify-self-end">
              Sản xuất theo kích thước thực tế, tư vấn vật liệu dựa trên thói quen sử dụng và ngân sách của từng gia đình.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface-bright px-4 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-content gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/tu-bep/${cat.slug}`}
              className="group overflow-hidden rounded-xl bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
                <span className="absolute left-5 top-5 rounded-md bg-surface-bright/90 px-3 py-1 font-label text-[10px] uppercase tracking-widest text-primary shadow-ambient-sm backdrop-blur">
                  {cat.badge}
                </span>
              </div>
              <div className="p-6">
                <h2 className="font-headline text-2xl font-bold text-primary">{cat.name}</h2>
                <p className="mt-3 min-h-[72px] text-body-sm leading-relaxed text-on-surface-variant">{cat.desc}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-label text-xs font-bold uppercase tracking-widest text-tertiary transition-all group-hover:gap-3">
                  Xem chi tiết <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
