'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, FileText, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import api from '@/lib/api'
import { getListData } from '@/lib/api-response'
import type { PricingTable } from '@/types'

export interface PricingOption {
  material: string
  priceRange: string
  highlight?: boolean
  items: Array<{ name: string; price: string; unit?: string }>
  note: string
  detailUrl?: string | null
}

interface PricingSelectorProps {
  tables: PricingOption[]
}

export function PricingSelector({ tables }: PricingSelectorProps) {
  const [dynamicTables, setDynamicTables] = useState<PricingOption[]>(tables)

  useEffect(() => {
    let alive = true

    async function loadPricing() {
      try {
        const res = await api.get('/pricing') as unknown
        const data = getListData<PricingTable>(res)
        const mapped = data
          .filter((table) => table.is_active)
          .map<PricingOption>((table, index) => {
            const items = Array.isArray(table.items)
              ? table.items.map((item) => ({
                  name: item.label,
                  price: item.price,
                  unit: item.unit,
                }))
              : []
            const firstPrice = items.find((item) => item.price)?.price

            return {
              material: table.name,
              priceRange: firstPrice ? `Từ ${firstPrice}` : 'Liên hệ để nhận báo giá',
              highlight: index === 1,
              items,
              note: table.description || 'Giá thực tế phụ thuộc kích thước, vật liệu và phụ kiện.',
              detailUrl: table.detail_url,
            }
          })

        if (alive && mapped.length > 0) {
          setDynamicTables(mapped)
        }
      } catch {
        // Keep static fallback when API is unavailable.
      }
    }

    loadPricing()
    return () => { alive = false }
  }, [])

  function scrollToQuote() {
    document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="bg-surface-container-low px-4 py-16 lg:px-8">
      <div className="mx-auto max-w-content">
        <div className="mb-10 flex items-start gap-3 rounded-xl border border-warning-container bg-warning-container/60 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <p className="text-body-sm leading-relaxed text-on-warning-container">
            <strong>Lưu ý:</strong> Đây là bảng giá tham khảo. Giá thực tế phụ thuộc kích thước, thiết kế, chất liệu và phụ kiện. Nhấn &quot;Nhận báo giá&quot; để được tư vấn chính xác.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {dynamicTables.map((table, index) => (
            <div
              key={table.material}
              className={cn(
                'relative flex flex-col overflow-hidden rounded-xl border-2 bg-surface text-left shadow-card transition-all duration-300',
                table.highlight ? 'border-primary/70' : 'border-outline-variant',
              )}
            >
              {table.highlight && (
                <div className="bg-primary py-2 text-center font-label text-[10px] font-bold uppercase tracking-widest text-white">
                  Phổ biến nhất
                </div>
              )}

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-headline text-2xl font-bold leading-tight text-primary">{table.material}</h3>
                <p className="mt-2 font-label text-sm font-bold text-tertiary">{table.priceRange}</p>

                <ul className="mt-6 space-y-3.5">
                  {table.items.map((item) => (
                    <li key={item.name} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-tertiary" />
                      <div className="flex-1 text-body-sm leading-relaxed text-on-surface-variant">
                        <span>{item.name}</span>
                        {item.price && (
                          <span className="ml-1 text-on-surface-variant/80">
                            {item.unit ? `- ${item.price} đ/${item.unit}` : `- ${item.price}`}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <p className="mt-6 text-body-sm italic leading-relaxed text-on-surface-variant/70">{table.note}</p>

                {/* 2 buttons */}
                <div className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row">
                  <button
                    type="button"
                    onClick={scrollToQuote}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-3 font-label text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-primary-dark"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Nhận báo giá
                  </button>
                  {table.detailUrl && (
                    <a
                      href={table.detailUrl}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-outline-variant px-4 py-3 font-label text-xs font-bold uppercase tracking-widest text-on-surface transition-colors hover:border-primary hover:text-primary"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Xem chi tiết
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
