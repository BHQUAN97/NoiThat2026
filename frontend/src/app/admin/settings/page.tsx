'use client'

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/shared/PageHeader'
import api from '@/lib/api'
import type { SiteConfig } from '@/types'

const SECTIONS = [
  {
    title: 'Thông tin công ty',
    fields: [
      { key: 'site_name', label: 'Tên website', placeholder: 'Nội Thất Duy Mạnh' },
      { key: 'hotline', label: 'Hotline', placeholder: '094.872.8091' },
      { key: 'address', label: 'Địa chỉ', placeholder: 'Vân Nam - Phúc Thọ - Hà Nội' },
      { key: 'working_hours', label: 'Giờ làm việc', placeholder: '8h00 - 18h00' },
      { key: 'email_contact', label: 'Email liên hệ', placeholder: 'duymanhnoithat@gmail.com' },
      { key: 'zalo_url', label: 'Zalo URL', placeholder: 'https://zalo.me/...' },
      { key: 'facebook_url', label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
    ],
  },
  {
    title: 'SEO',
    fields: [
      { key: 'meta_title', label: 'Meta Title', placeholder: 'Nội Thất Duy Mạnh - Tủ Bếp Đẹp' },
      { key: 'meta_description', label: 'Meta Description', placeholder: 'Xưởng sản xuất tủ bếp...', textarea: true },
      { key: 'og_image_url', label: 'OG Image URL', placeholder: 'https://...' },
    ],
  },
  {
    title: 'Email thông báo',
    fields: [
      { key: 'admin_email', label: 'Email nhận thông báo form', placeholder: 'duymanhnoithat@gmail.com' },
      { key: 'resend_from', label: 'Email gửi đi (Resend)', placeholder: 'no-reply@duymanhnoithat.vn' },
    ],
  },
]

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/settings') as unknown
        const configs = (res as { data: SiteConfig[] }).data || []
        const map: Record<string, string> = {}
        configs.forEach((c: SiteConfig) => { map[c.key] = c.value })
        setValues(map)
      } catch {
        setError('Không tải được cài đặt.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    const payload = Object.entries(values).map(([key, value]) => ({ key, value, type: 'string' }))
    try {
      await api.put('/settings', payload)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Lưu cài đặt thất bại.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-white" />)}
    </div>
  )

  return (
    <div>
      <PageHeader title="Cài Đặt" description="Cấu hình thông tin website" />

      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
      {saved && <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">✓ Đã lưu thành công!</div>}

      <form onSubmit={handleSave} className="space-y-6">
        {SECTIONS.map(section => (
          <div key={section.title} className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-semibold text-stone-700">{section.title}</h2>
            <div className="space-y-4">
              {section.fields.map(field => (
                <div key={field.key}>
                  <label className="mb-1 block text-sm font-medium text-stone-700">{field.label}</label>
                  {field.textarea ? (
                    <textarea
                      value={values[field.key] || ''}
                      onChange={e => setValues(p => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                      rows={3}
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[field.key] || ''}
                      onChange={e => setValues(p => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex gap-3">
          <Button type="submit" loading={saving}>
            <Save className="mr-1.5 h-4 w-4" />
            {saving ? 'Đang lưu...' : 'Lưu tất cả'}
          </Button>
        </div>
      </form>
    </div>
  )
}
