'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import api from '@/lib/api'
import { getListData } from '@/lib/api-response'
import type { ProductCategory } from '@/types'

const CATEGORY_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDBNDHQJqf79UVtDcI542v6D5Ep0qrWkZQ9JslMmAvqAs6AW_o0P4-1lGxPtoBir-8XxZzVT49NGqeV3AxSlRa52ktZHMfg5Nb7GFaqzHGFzHcoICXkdG4axiuM7QWdz_rkSJwhG-IuIPLC15o1cqJB2IW0y9ntFmWrZDia6EUO6_FgEPWdas5c3w6Isl1UMAkUMDxWr_MGAjg5POvhfWvrwdABJAo0xU2BradeIIITYcIu-1onH5tx23tJhGmBWvaBFtv4G2_iB6ho',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDvQ9kB1eYmGQibk-Fqxe04YoKx6bMa6LqZm6KiOKtEQRIMGeD4C1m02BtLL5sNLrUJwefUeG0dENJS7QMKBw1hVs5BTIEVRTc_yL0UQNpnsXNjLBSjCUgMS1s8ZPwZlGvwSJzlEuNEkKHdUwCGptU9lT3sWyXu5mnwAiBdfsM85x_YGJI9r59x1OOiryzaaqarehogcS-EyDO0QnaKEmO0Vl5ZLwk3WXSk6yWV1BKzKxWbtnQ6Y1K63afP4n12-N9I4CJ050rtXmlb',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDvB3-HpRPKYcrraeXQYFcMfo51YpjCax6qv4WHMDJr6V-gxo9SnL5g5pL3W3fjAoaWKN6YacxNx5-yYG0Eig6vNG-pQtEdO0s-Gy4hLDikAcHkYCy-RyXQgfL2FTn_C721v6UO9fjBkfeSb1T8IS4AZcCxiw33Y5Ti6WCLA6Umepze-5sS247y2XF4e1FfUFkqQMTsUmfx2tP6DWC9JzcaMm5zHdR75QYUoRFGzFU9lvkI4E8wZ5ISAYcwAMdNUY3xbiI4_GJXPVzo',
]

type FurnitureCategory = {
  id: string
  slug: string
  name: string
  description: string
  thumbnail_url: string | null
}

const FALLBACK_CATEGORIES: FurnitureCategory[] = [
  {
    id: 'tu-quan-ao',
    slug: 'tu-quan-ao',
    name: 'Tủ quần áo',
    description: 'Tủ âm tường, tủ đứng, cánh trượt, thiết kế theo kích thước phòng.',
    thumbnail_url: CATEGORY_IMAGES[0],
  },
  {
    id: 'vach-tivi',
    slug: 'vach-tivi',
    name: 'Vách Tivi',
    description: 'Kệ tivi, vách ngăn phòng khách, kệ sách kết hợp, nhiều màu vật liệu.',
    thumbnail_url: CATEGORY_IMAGES[1],
  },
  {
    id: 'noi-that-phong-ngu',
    slug: 'noi-that-phong-ngu',
    name: 'Nội thất phòng ngủ',
    description: 'Giường, tủ đầu giường, bàn trang điểm và bộ phòng ngủ đồng bộ.',
    thumbnail_url: CATEGORY_IMAGES[2],
  },
]

function isOtherFurniture(category: ProductCategory) {
  const text = `${category.slug} ${category.name}`.toLowerCase()
  return !text.includes('tu-bep') && !text.includes('tủ bếp')
}

export function OtherFurnitureGrid() {
  const [categories, setCategories] = useState<FurnitureCategory[]>(FALLBACK_CATEGORIES)

  useEffect(() => {
    let alive = true

    async function loadCategories() {
      try {
        const res = await api.get('/product-categories?active=true') as unknown
        const data = getListData<ProductCategory>(res)
          .filter(isOtherFurniture)
          .map<FurnitureCategory>((category, index) => ({
            id: category.id,
            slug: category.slug,
            name: category.name,
            description: category.description || FALLBACK_CATEGORIES[index % FALLBACK_CATEGORIES.length].description,
            thumbnail_url: category.thumbnail_url || CATEGORY_IMAGES[index % CATEGORY_IMAGES.length],
          }))

        if (alive && data.length > 0) setCategories(data)
      } catch {
        // Keep fallback categories when API is unavailable.
      }
    }

    loadCategories()
    return () => { alive = false }
  }, [])

  return (
    <section className="bg-surface-bright px-4 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-content gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/noi-that-khac/${cat.slug}`}
            className="group overflow-hidden rounded-xl bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
              {cat.thumbnail_url ? (
                <img
                  src={cat.thumbnail_url}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#efe5d9,#b7c7c2)]">
                  <span className="font-label text-xs uppercase tracking-widest text-primary/60">Ảnh danh mục</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
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
