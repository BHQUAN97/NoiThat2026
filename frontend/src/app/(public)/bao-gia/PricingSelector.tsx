'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
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
}

interface PricingSelectorProps {
  tables: PricingOption[]
}

export function PricingSelector({ tables }: PricingSelectorProps) {
  const [dynamicTables, setDynamicTables] = useState<PricingOption[]>(tables)
  const [selected, setSelected] = useState(0)
  const selectedTable = dynamicTables[selected]

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
            }
          })

        if (alive && mapped.length > 0) {
          setDynamicTables(mapped)
          setSelected(0)
        }
      } catch {
        // Keep static fallback when API is unavailable.
      }
    }

    loadPricing()
    return () => { alive = false }
  }, [])

  const summary = useMemo(() => {
    if (!selectedTable) return ''
    return `${selectedTable.material} - ${selectedTable.priceRange}`
  }, [selectedTable])

  function scrollToQuote() {
    document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="bg-surface-container-low px-4 py-16 lg:px-8">
      <div className="mx-auto max-w-content">
        <div className="mb-10 flex items-start gap-3 rounded-xl border border-warning-container bg-warning-container/60 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <p className="text-body-sm leading-relaxed text-on-warning-container">
            <strong>Lưu ý:</strong> Đây là bảng giá tham khảo. Giá thực tế phụ thuộc kích thước, thiết kế, chất liệu và phụ kiện. Chọn một gói để gửi yêu cầu báo giá chính xác hơn.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {dynamicTables.map((table, index) => {
            const isSelected = selected === index

            return (
              <button
                key={table.material}
                type="button"
                onClick={() => setSelected(index)}
                className={cn(
                  'group relative overflow-hidden rounded-xl border-2 bg-surface text-left shadow-card transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary',
                  isSelected
                    ? 'border-tertiary shadow-card-hover'
                    : table.highlight
                      ? 'border-primary/70 hover:border-tertiary'
                      : 'border-outline-variant hover:border-tertiary/70 hover:shadow-card-hover',
                )}
                aria-pressed={isSelected}
              >
                {table.highlight && (
                  <div className="bg-primary py-2 text-center font-label text-[10px] font-bold uppercase tracking-widest text-white">
                    Phổ biến nhất
                  </div>
                )}
                {isSelected && (
                  <div className="absolute right-4 top-4 rounded-full bg-tertiary px-3 py-1 font-label text-[10px] font-bold uppercase tracking-widest text-white">
                    Đã chọn
                  </div>
                )}

                <div className="p-6">
                  <h3 className="pr-20 font-headline text-2xl font-bold leading-tight text-primary">{table.material}</h3>
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

                  <span
                    className={cn(
                      'mt-6 inline-flex w-full items-center justify-center rounded-lg px-4 py-3 font-label text-xs font-bold uppercase tracking-widest transition-colors',
                      isSelected
                        ? 'bg-tertiary text-white'
                        : 'bg-surface-container-low text-primary group-hover:bg-tertiary group-hover:text-white',
                    )}
                  >
                    {isSelected ? 'Đang chọn gói này' : 'Chọn gói này'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-8 rounded-xl bg-surface p-5 shadow-card">
          <p className="font-label text-[10px] uppercase tracking-widest text-tertiary">Gói đang chọn</p>
          <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="font-headline text-xl font-bold text-primary">{summary}</p>
            <button
              type="button"
              onClick={scrollToQuote}
              className="rounded-lg bg-primary px-5 py-3 font-label text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-primary-dark"
            >
              Nhận báo giá gói này
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
