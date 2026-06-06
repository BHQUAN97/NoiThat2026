import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PRODUCT_CATEGORIES } from '@/lib/constants'

const CATEGORY_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAFVMp4te8SXY5NkbR163ii3Zbycmbn14ECs1x7Q44xERmpjHcl3eojOjpu-cLftnq9PafiUDIOlvz9sLTEU5hH4d_EivfirG8S5OxhdnVYnQkQwSjDF49RXorL-naiOdCn_2jDai8yHbB7mRlf5Gbdzb3HCeekW3Mu-J7JxgSogHJzijkq8tpUSPFBFbDjUr_vbwfwi2kY1yvHQLv6GFfBLvbHymJe6uTA47soXRcQp4nEJ1Bh27jkxwUcKeeTjCZn36NHpWisZBUX',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDwfeHoOrk-kROj0eXhrnGye_hAr8ZH0DCFNLAUSOVKtSc_LghRAqLiIIgU7EgezwZay5NJrDFqpAb5oqTcn_87eC8kEX1i4ENGRE3ewahTMz2lx3vA7aXH3Ll8LZWnc3f1wv4UZsM6su6MvA9FgI8IiKD2EWDztbM-AdmQ1aUsgmCqbsjHySx4rOhn_12iSpbCddBWcIQ_Nto5uRsr8LiyA_6zuHKMqOFiGXINKm2lJW7GnVXG-k1fXPcIqQ4hWSKDz0iFm1mLtpcA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAyedTNnDcb5WkuOBVaW1Wof3ATrIgW-7aJIT3JX8tPlt9ekzp2TqZJezUCmHe4coXAQTWYlsLNRbq-D3Vm6DCjkgsrxmRsyE9wnWVXFega1s5u6xnxmAc4HHX4J8OfsmlFg-XGuvkiNBies8931Qbg16X5jUClOtbQHxINu5oorCqvVVvsPlhUjOlwwypAN8_AHk3yz4S_w_DE4-XsKdQXwl2ClWe0xs5SDtYp3ngLkmRyD8tokMv2sv7CgQzYcRRVNLjaQzk9j9Wl',
]

export function ProductCategoriesSection() {
  return (
    <section className="bg-surface px-4 py-20 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="mb-4 block font-label text-xs uppercase tracking-[0.2em] text-primary">
              Bespoke Furniture
            </span>
            <h2 className="font-headline text-4xl font-bold text-primary md:text-5xl">
              Danh mục sản phẩm
            </h2>
          </div>
          <Link
            href="/tu-bep"
            className="group flex items-center gap-2 font-label text-label-lg font-bold uppercase tracking-label-wide text-primary transition-all hover:gap-4"
          >
            Xem tất cả
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_CATEGORIES.slice(0, 6).map((cat, index) => (
            <Link
              key={cat.slug}
              href={cat.href}
              className={index % 2 === 1 ? 'group md:mt-12' : 'group'}
            >
              <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-xl bg-surface-container-low shadow-ambient-sm">
                <img
                  src={CATEGORY_IMAGES[index % CATEGORY_IMAGES.length]}
                  alt={cat.label}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary-container/20" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-lg bg-surface/90 p-4 shadow-ambient-sm backdrop-blur-md">
                  <div>
                    <p className="font-label text-[10px] uppercase tracking-widest text-primary/60">
                      Collection
                    </p>
                    <h3 className="font-headline text-lg font-bold text-primary">{cat.label}</h3>
                  </div>
                  <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
