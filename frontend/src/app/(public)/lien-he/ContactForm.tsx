'use client'

import { useState } from 'react'
import { Phone, User, MessageSquare, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContactFormData {
  name: string
  phone: string
  email: string
  message: string
}

export function ContactForm() {
  const [data, setData] = useState<ContactFormData>({ name: '', phone: '', email: '', message: '' })
  const [errors, setErrors] = useState<Partial<ContactFormData>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function validate(): boolean {
    const errs: Partial<ContactFormData> = {}
    if (!data.name.trim()) errs.name = 'Vui lòng nhập họ tên'
    if (!data.phone.trim()) errs.phone = 'Vui lòng nhập số điện thoại'
    if (!data.message.trim()) errs.message = 'Vui lòng nhập nội dung'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setStatus('loading')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forms/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email || undefined,
          content: { message: data.message },
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setData({ name: '', phone: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-success" />
        </div>
        <h3 className="font-semibold text-stone-900 text-lg">Gửi Thành Công!</h3>
        <p className="text-stone-500 text-sm">Chúng tôi sẽ liên hệ lại trong vòng 24h.</p>
        <button onClick={() => setStatus('idle')} className="text-brand text-sm font-semibold hover:underline">
          Gửi tin nhắn khác
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Họ tên <span className="text-danger">*</span></label>
          <div className="relative">
            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder="Nguyễn Văn A"
              className={cn('w-full pl-9 pr-3 py-2.5 border rounded text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20', errors.name ? 'border-danger' : 'border-border')}
            />
          </div>
          {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Điện thoại <span className="text-danger">*</span></label>
          <div className="relative">
            <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
              placeholder="0948 728 091"
              className={cn('w-full pl-9 pr-3 py-2.5 border rounded text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20', errors.phone ? 'border-danger' : 'border-border')}
            />
          </div>
          {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Email (tuỳ chọn)</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          placeholder="email@example.com"
          className="w-full px-3 py-2.5 border border-border rounded text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Nội dung <span className="text-danger">*</span></label>
        <div className="relative">
          <MessageSquare size={15} className="absolute left-3 top-3 text-stone-400" />
          <textarea
            value={data.message}
            onChange={(e) => setData({ ...data, message: e.target.value })}
            placeholder="Tôi muốn tư vấn về..."
            rows={5}
            className={cn('w-full pl-9 pr-3 py-2.5 border rounded text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 resize-none', errors.message ? 'border-danger' : 'border-border')}
          />
        </div>
        {errors.message && <p className="text-danger text-xs mt-1">{errors.message}</p>}
      </div>

      {status === 'error' && <p className="text-danger text-sm text-center">Gửi thất bại. Vui lòng thử lại.</p>}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 bg-brand text-white font-semibold rounded text-sm hover:bg-primary-dark shadow-cta disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
      >
        {status === 'loading' ? 'Đang gửi...' : 'Gửi Tin Nhắn'}
      </button>
    </form>
  )
}
