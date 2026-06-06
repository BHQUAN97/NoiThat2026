'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import api from '@/lib/api'
import { getListData } from '@/lib/api-response'
import type { ProductCategory } from '@/types'

const CATEGORY_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAFVMp4te8SXY5NkbR163ii3Zbycmbn14ECs1x7Q44xERmpjHcl3eojOjpu-cLftnq9PafiUDIOlvz9sLTEU5hH4d_EivfirG8S5OxhdnVYnQkQwSjDF49RXorL-naiOdCn_2jDai8yHbB7mRlf5Gbdzb3HCeekW3Mu-J7JxgSogHJzijkq8tpUSPFBFbDjUr_vbwfwi2kY1yvHQLv6GFfBLvbHymJe6uTA47soXRcQp4nEJ1Bh27jkxwUcKeeTjCZn36NHpWisZBUX',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDwfeHoOrk-kROj0eXhrnGye_hAr8ZH0DCFNLAUSOVKtSc_LghRAqLiIIgU7EgezwZay5NJrDFqpAb5oqTcn_87eC8kEX1i4ENGRE3ewahTMz2lx3vA7aXH3Ll8LZWnc3f1wv4UZsM6su6MvA9FgI8IiKD2EWDztbM-AdmQ1aUsgmCqbsjHySx4rOhn_12iSpbCddBWcIQ_Nto5uRsr8LiyA_6zuHKMqOFiGXINKm2lJW7GnVXG-k1fXPcIqQ4hWSKDz0iFm1mLtpcA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAyedTNnDcb5WkuOBVaW1Wof3ATrIgW-7aJIT3JX8tPlt9ekzp2TqZJezUCmHe4coXAQTWYlsLNRbq-D3Vm6DCjkgsrxmRsyE9wnWVXFega1s5u6xnxmAc4HHX4J8OfsmlFg-XGuvkiNBies8931Qbg16X5jUClOtbQHxINu5oorCqvVVvsPlhUjOlwwypAN8_AHk3yz4S_w_DE4-XsKdQXwl2ClWe0xs5SDtYp3ngLkmRyD8tokMv2sv7CgQzYcRRVNLjaQzk9j9Wl',
]

const FALLBACK_CATEGORIES = [
  { id: 'tu-bep-inox-304', slug: 'tu-bep-inox-304', name: 'Tủ bếp Inox 304', description: 'Khung xương Inox 304 chính hãng, hàn TIG chuyên dụng, chống rỉ và phù hợp gia đình cần độ bền cao.', badge: 'Bán chạy', thumbnail_url: CATEGORY_IMAGES[0] },
  { id: 'tu-bep-canh-kinh', slug: 'tu-bep-canh-kinh', name: 'Tủ bếp cánh kính', description: 'Cánh kính cường lực hoặc kính lùa, bề mặt sắc nét, dễ vệ sinh và hợp phong cách căn hộ hiện đại.', badge: 'Cao cấp', thumbnail_url: CATEGORY_IMAGES[1] },
  { id: 'tu-bep-acrylic', slug: 'tu-bep-acrylic', name: 'Tủ bếp Acrylic', description: 'Bề mặt bóng gương, nhiều màu lựa chọn, tạo cảm giác rộng và sáng cho không gian bếp.', badge: 'Xu hướng', thumbnail_url: CATEGORY_IMAGES[2] },
]

type CategoryItem = {
  id: string
  slug: string
  name: string
  description: string
  badge?: string
  thumbnail_url: string
}

function isTuBep(cat: ProductCategory) {
  const text = `${cat.slug} ${cat.name}`.toLowerCase()
  return text.includes('tu-bep') || text.includes('tủ bếp') || text.includes('bep')
}

export function KitchenGrid() {
  const [categories, setCategories] = useState<CategoryItem[]>(FALLBACK_CATEGORIES)

  useEffect(() => {
    let alive = true

    async function load() {
      try {
        const res = await api.get('/product-categories?active=true') as unknown
        const data = getListData<ProductCategory>(res)
          .filter(isTuBep)
          .map<CategoryItem>((cat, i) => ({
            id: cat.id,
            slug: cat.slug,
            name: cat.name,
            description: cat.description || FALLBACK_CATEGORIES[i % FALLBACK_CATEGORIES.length].description,
            thumbnail_url: cat.thumbnail_url || CATEGORY_IMAGES[i % CATEGORY_IMAGES.length],
          }))

        if (alive && data.length > 0) setCategories(data)
      } catch {
        // Keep fallback when API unavailable.
      }
    }

    load()
    return () => { alive = false }
  }, [])

  return (
    <section className="bg-surface-bright px-4 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-content gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/tu-bep/${cat.slug}`}
            className="group overflow-hidden rounded-xl bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
              <img
                src={cat.thumbnail_url}
                alt={cat.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
              {cat.badge && (
                <span className="absolute left-5 top-5 rounded-md bg-surface-bright/90 px-3 py-1 font-label text-[10px] uppercase tracking-widest text-primary shadow-ambient-sm backdrop-blur">
                  {cat.badge}
                </span>
              )}
            </div>
            <div className="p-6">
              <h2 className="font-headline text-2xl font-bold text-primary">{cat.name}</h2>
              <p className="mt-3 min-h-[72px] text-body-sm leading-relaxed text-on-surface-variant">{cat.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 font-label text-xs font-bold uppercase tracking-widest text-tertiary transition-all group-hover:gap-3">
                Xem chi tiết <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
