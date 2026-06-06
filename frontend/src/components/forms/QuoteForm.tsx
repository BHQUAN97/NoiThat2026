'use client'

import { useState } from 'react'
import { Phone, User, ChevronDown, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuoteFormData {
  name: string
  phone: string
  email: string
  type: string
  area: string
  note: string
}

const PRODUCT_TYPES = [
  'Tủ Bếp Inox 304',
  'Tủ Bếp Cánh Kính',
  'Tủ Bếp Acrylic',
  'Tủ Quần Áo',
  'Vách Tivi',
  'Nội Thất Phòng Ngủ',
  'Khác',
]

interface QuoteFormProps {
  variant?: 'inline' | 'modal'
  className?: string
}

// Form nhận báo giá — reusable cho homepage, trang báo giá, liên hệ
export function QuoteForm({ variant = 'inline', className }: QuoteFormProps) {
  const [data, setData] = useState<QuoteFormData>({
    name: '', phone: '', email: '', type: '', area: '', note: '',
  })
  const [errors, setErrors] = useState<Partial<QuoteFormData>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function validate(): boolean {
    const errs: Partial<QuoteFormData> = {}
    if (!data.name.trim()) errs.name = 'Vui lòng nhập họ tên'
    if (!data.phone.trim()) errs.phone = 'Vui lòng nhập số điện thoại'
    else if (!/^[0-9]{9,11}$/.test(data.phone.replace(/\s/g, ''))) {
      errs.phone = 'Số điện thoại không hợp lệ'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setStatus('loading')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forms/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email || undefined,
          content: {
            type: data.type,
            area: data.area,
            note: data.note,
          },
        }),
      })

      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
      setData({ name: '', phone: '', email: '', type: '', area: '', note: '' })
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-4 py-8 text-center', className)}>
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-success" />
        </div>
        <h3 className="font-semibold text-stone-900 text-lg">Gửi Thành Công!</h3>
        <p className="text-stone-500 text-sm max-w-sm">
          Chúng tôi đã nhận được yêu cầu của bạn. Đội tư vấn sẽ liên hệ trong vòng 24h.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-brand text-sm font-semibold hover:underline"
        >
          Gửi yêu cầu khác
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cn('space-y-4', className)}>
      {/* Hàng 1: Tên + SĐT */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Họ và tên <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              onBlur={() => validate()}
              placeholder="Nguyễn Văn A"
              className={cn(
                'w-full pl-9 pr-3 py-2.5 border rounded text-sm outline-none transition-colors duration-200',
                'focus:border-brand focus:ring-1 focus:ring-brand/20',
                errors.name ? 'border-danger' : 'border-border'
              )}
            />
          </div>
          {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Số điện thoại <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
              onBlur={() => validate()}
              placeholder="0948 728 091"
              className={cn(
                'w-full pl-9 pr-3 py-2.5 border rounded text-sm outline-none transition-colors duration-200',
                'focus:border-brand focus:ring-1 focus:ring-brand/20',
                errors.phone ? 'border-danger' : 'border-border'
              )}
            />
          </div>
          {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>

      {/* Hàng 2: Email + Loại nội thất */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Email (tuỳ chọn)</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            placeholder="email@example.com"
            className="w-full px-3 py-2.5 border border-border rounded text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-colors duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Loại nội thất</label>
          <div className="relative">
            <select
              value={data.type}
              onChange={(e) => setData({ ...data, type: e.target.value })}
              className="w-full px-3 py-2.5 border border-border rounded text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 appearance-none bg-white transition-colors duration-200"
            >
              <option value="">Chọn loại nội thất</option>
              {PRODUCT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Ghi chú */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Ghi chú (tuỳ chọn)</label>
        <textarea
          value={data.note}
          onChange={(e) => setData({ ...data, note: e.target.value })}
          placeholder="Diện tích bếp, yêu cầu đặc biệt..."
          rows={3}
          className="w-full px-3 py-2.5 border border-border rounded text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 resize-none transition-colors duration-200"
        />
      </div>

      {/* Submit */}
      {status === 'error' && (
        <p className="text-danger text-sm text-center">Gửi thất bại. Vui lòng thử lại hoặc gọi hotline.</p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className={cn(
          'w-full py-3 bg-brand text-white font-semibold rounded text-sm transition-all duration-200',
          status === 'loading'
            ? 'opacity-70 cursor-not-allowed'
            : 'hover:bg-primary-dark shadow-cta hover:shadow-cta-hover'
        )}
      >
        {status === 'loading' ? 'Đang gửi...' : 'Nhận Báo Giá Miễn Phí'}
      </button>

      <p className="text-center text-stone-400 text-xs">
        Chúng tôi sẽ liên hệ trong vòng 24h. Không spam, không phiền nhiễu.
      </p>
    </form>
  )
}
