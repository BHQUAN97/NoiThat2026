'use client'

import { useRef, useState, useEffect } from 'react'
import {
  Save, ImageIcon, Loader2, X, Building2, Search, Mail, Image as ImageLucide,
  ChevronDown, ChevronUp, MapPin, ExternalLink, Info,
  CheckCircle2, Circle, Eye, EyeOff, AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/shared/PageHeader'
import api from '@/lib/api'
import { uploadMedia, validateImageFile } from '@/lib/media'
import { getListData, getResponseData } from '@/lib/api-response'
import type { SiteConfig } from '@/types'
import { cn } from '@/lib/utils'

// ─── Field definitions ──────────────────────────────────────────────────────

type FieldDef = {
  key: string
  label: string
  placeholder: string
  hint: string
  textarea?: boolean
  type?: 'text' | 'url' | 'email'
  wide?: boolean        // chiếm full width trong grid 2 cột
  mapsPreview?: boolean // hiện iframe preview inline
}

type SectionDef = {
  id: string
  title: string
  icon: React.ElementType
  accent: string
  description: string
  fields: FieldDef[]
  guide?: React.ReactNode
}

const SECTIONS: SectionDef[] = [
  {
    id: 'company',
    title: 'Thông tin công ty',
    icon: Building2,
    accent: 'amber',
    description: 'Hiển thị trên header, footer và trang Liên hệ.',
    fields: [
      {
        key: 'site_name',
        label: 'Tên website',
        placeholder: 'Nội Thất Duy Mạnh',
        hint: 'Tên hiển thị ở header, tab trình duyệt và email tự động. Nên ngắn gọn, dưới 30 ký tự.',
      },
      {
        key: 'hotline',
        label: 'Hotline',
        placeholder: '094.872.8091',
        hint: 'Số điện thoại chính. Hiển thị ở header, footer và nút "Gọi ngay". Định dạng: 094.872.8091 hoặc 0948728091.',
      },
      {
        key: 'address',
        label: 'Địa chỉ showroom',
        placeholder: 'Vân Nam - Phúc Thọ - Hà Nội',
        hint: 'Địa chỉ đầy đủ hiển thị ở footer và trang Liên hệ. VD: Thôn Vân Nam, Xã Vân Nam, H. Phúc Thọ, Hà Nội.',
        wide: true,
      },
      {
        key: 'working_hours',
        label: 'Giờ làm việc',
        placeholder: '8h00 - 18h00, Thứ 2 - Chủ nhật',
        hint: 'Hiển thị ở footer bên cạnh địa chỉ.',
      },
      {
        key: 'email_contact',
        label: 'Email liên hệ công khai',
        placeholder: 'duymanhnoithat@gmail.com',
        type: 'email',
        hint: 'Email hiển thị công khai để khách hàng liên hệ trực tiếp. Khác với email nhận thông báo form (ở mục Email bên dưới).',
      },
      {
        key: 'zalo_url',
        label: 'Zalo URL',
        placeholder: 'https://zalo.me/0948728091',
        type: 'url',
        hint: 'Link chat Zalo. Cách lấy: mở Zalo trên máy tính → Trang cá nhân → Copy link trang. Hoặc dùng: https://zalo.me/{số_điện_thoại}',
      },
      {
        key: 'facebook_url',
        label: 'Facebook Page URL',
        placeholder: 'https://facebook.com/duymanhnoithat',
        type: 'url',
        hint: 'Link fanpage Facebook. Lấy từ: Facebook → Fanpage → Giới thiệu → Địa chỉ trang (thường là facebook.com/tenpage).',
      },
      {
        key: 'google_maps_embed_url',
        label: 'Google Maps Embed URL',
        placeholder: 'https://www.google.com/maps/embed?pb=!1m18...',
        type: 'url',
        wide: true,
        mapsPreview: true,
        hint: 'Phải là URL embed (chứa /maps/embed hoặc output=embed). KHÔNG dùng link chia sẻ ngắn như maps.app.goo.gl hay maps/place/...',
      },
    ],
  },
  {
    id: 'seo',
    title: 'SEO & Mạng xã hội',
    icon: Search,
    accent: 'blue',
    description: 'Thông tin hiển thị trên Google và khi chia sẻ link lên Facebook, Zalo.',
    fields: [
      {
        key: 'meta_title',
        label: 'Meta Title',
        placeholder: 'Nội Thất Duy Mạnh - Tủ Bếp Đẹp Hà Nội',
        wide: true,
        hint: 'Tiêu đề hiển thị trên tab trình duyệt và kết quả tìm kiếm Google. Tối ưu: 50–60 ký tự. Nên chứa từ khóa chính (tủ bếp, nội thất) và địa điểm (Hà Nội, Phúc Thọ).',
      },
      {
        key: 'meta_description',
        label: 'Meta Description',
        placeholder: 'Xưởng sản xuất tủ bếp, nội thất gia đình theo yêu cầu tại Phúc Thọ, Hà Nội...',
        textarea: true,
        wide: true,
        hint: 'Mô tả ngắn hiển thị dưới tiêu đề trên Google và khi chia sẻ. Tối ưu: 120–160 ký tự. Nên nêu dịch vụ chính, địa điểm và điểm khác biệt (xưởng trực tiếp, báo giá miễn phí...).',
      },
      {
        key: 'og_image_url',
        label: 'Ảnh chia sẻ (OG Image)',
        placeholder: 'https://bhquan.site/og-image.jpg',
        type: 'url',
        wide: true,
        hint: 'Ảnh hiển thị khi chia sẻ link lên Facebook/Zalo/Messenger. Kích thước chuẩn: 1200×630px (tỷ lệ 1.91:1). Upload lên Thư viện Media rồi dán URL vào đây.',
      },
    ],
  },
  {
    id: 'email',
    title: 'Email & Thông báo',
    icon: Mail,
    accent: 'green',
    description: 'Cấu hình email tự động gửi qua Resend khi có form liên hệ mới.',
    guide: (
      <div className="mb-5 rounded-xl border border-green-100 bg-green-50 p-4 text-sm">
        <p className="mb-2.5 font-semibold text-green-800">Hướng dẫn thiết lập Resend (lần đầu)</p>
        <ol className="space-y-1.5 text-green-700">
          <li className="flex gap-2"><span className="shrink-0 font-bold">1.</span><span>Đăng ký tài khoản tại <strong>resend.com</strong> (miễn phí, 3.000 email/tháng)</span></li>
          <li className="flex gap-2"><span className="shrink-0 font-bold">2.</span><span>Vào <strong>Domains → Add Domain</strong> → nhập domain của bạn (VD: duymanhnoithat.vn)</span></li>
          <li className="flex gap-2"><span className="shrink-0 font-bold">3.</span><span>Thêm các bản ghi DNS được cung cấp vào nhà cung cấp tên miền (Nhân Hòa, Namecheap...)</span></li>
          <li className="flex gap-2"><span className="shrink-0 font-bold">4.</span><span>Vào <strong>API Keys → Create API Key</strong> → chọn quyền <em>Sending Access</em></span></li>
          <li className="flex gap-2"><span className="shrink-0 font-bold">5.</span><span>Copy key (dạng <code className="rounded bg-green-100 px-1 font-mono text-xs">re_xxx...</code>) → thêm vào file <code className="rounded bg-green-100 px-1 font-mono text-xs">.env</code> của backend: <code className="rounded bg-green-100 px-1 font-mono text-xs">RESEND_API_KEY=re_xxx</code></span></li>
          <li className="flex gap-2"><span className="shrink-0 font-bold">6.</span><span>Điền "Email gửi đi" bên dưới theo đúng domain đã xác minh (VD: <em>no-reply@duymanhnoithat.vn</em>)</span></li>
        </ol>
      </div>
    ),
    fields: [
      {
        key: 'admin_email',
        label: 'Email nhận thông báo form',
        placeholder: 'duymanhnoithat@gmail.com',
        type: 'email',
        hint: 'Email nhận thông báo mỗi khi có khách hàng điền form liên hệ hoặc yêu cầu báo giá. Có thể là Gmail, Outlook hoặc email doanh nghiệp.',
      },
      {
        key: 'resend_from',
        label: 'Email gửi đi — Resend "From"',
        placeholder: 'no-reply@duymanhnoithat.vn',
        type: 'email',
        hint: 'Địa chỉ "From" trong các email tự động gửi đến khách hàng. Phải là domain đã xác minh trên Resend. Nếu dùng domain chưa xác minh, email sẽ không gửi được.',
      },
    ],
  },
]

// ─── Onboarding checklist ───────────────────────────────────────────────────

const CHECKLIST_ITEMS = [
  { label: 'Tên website & hotline', keys: ['site_name', 'hotline'] },
  { label: 'Địa chỉ & giờ làm việc', keys: ['address', 'working_hours'] },
  { label: 'Zalo & Facebook', keys: ['zalo_url', 'facebook_url'] },
  { label: 'Google Maps embed URL', keys: ['google_maps_embed_url'] },
  { label: 'Meta Title & Description (SEO)', keys: ['meta_title', 'meta_description'] },
  { label: 'Email nhận thông báo', keys: ['admin_email', 'resend_from'] },
  { label: 'Logo website', keys: ['logo_url'] },
]

const GUIDE_KEY = 'nt_settings_guide_v1'

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [guideOpen, setGuideOpen] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem(GUIDE_KEY)
    setGuideOpen(!dismissed)
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/settings') as unknown
        const configs = getListData<SiteConfig>(res)
        const configMap = configs.length > 0
          ? configs
          : Object.entries(getResponseData<Record<string, string>>(res) || {}).map(([key, value]) => ({
            key, value, type: 'string', updated_at: '',
          }))
        const map: Record<string, string> = {}
        configMap.forEach((c: SiteConfig) => { map[c.key] = c.value })
        setValues(map)
      } catch {
        setError('Không tải được cài đặt.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function dismissGuide() {
    localStorage.setItem(GUIDE_KEY, '1')
    setGuideOpen(false)
  }

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

  const doneCount = CHECKLIST_ITEMS.filter(item =>
    item.keys.some(k => !!values[k])
  ).length

  if (loading) return (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-white" />)}
    </div>
  )

  return (
    <div>
      <PageHeader title="Cài Đặt" description="Cấu hình thông tin và tích hợp cho website" />

      {/* ── Onboarding guide ── */}
      <OnboardingGuide
        open={guideOpen}
        values={values}
        doneCount={doneCount}
        total={CHECKLIST_ITEMS.length}
        onToggle={() => setGuideOpen(v => !v)}
        onDismiss={dismissGuide}
      />

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          <X className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      {saved && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Đã lưu thành công!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Logo */}
        <LogoSection
          value={values['logo_url'] || ''}
          onChange={(url) => setValues(p => ({ ...p, logo_url: url }))}
        />

        {/* Page Banners */}
        <PageBannersSection values={values} setValues={setValues} />

        {/* Dynamic sections */}
        {SECTIONS.map(section => (
          <SectionCard key={section.id} section={section} values={values} setValues={setValues} />
        ))}

        <div className="flex gap-3 pb-4">
          <Button type="submit" loading={saving}>
            <Save className="mr-1.5 h-4 w-4" />
            {saving ? 'Đang lưu...' : 'Lưu tất cả'}
          </Button>
          <p className="self-center text-xs text-stone-400">
            Thay đổi có hiệu lực ngay sau khi lưu.
          </p>
        </div>
      </form>
    </div>
  )
}

// ─── Onboarding guide ────────────────────────────────────────────────────────

function OnboardingGuide({
  open, values, doneCount, total, onToggle, onDismiss,
}: {
  open: boolean
  values: Record<string, string>
  doneCount: number
  total: number
  onToggle: () => void
  onDismiss: () => void
}) {
  const allDone = doneCount === total

  return (
    <div className={cn(
      'mb-6 overflow-hidden rounded-2xl border transition-all',
      allDone ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50',
    )}>
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <div className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
          allDone ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white',
        )}>
          {allDone ? <CheckCircle2 className="h-4 w-4" /> : `${doneCount}/${total}`}
        </div>
        <div className="flex-1">
          <p className={cn(
            'font-semibold',
            allDone ? 'text-emerald-800' : 'text-amber-900',
          )}>
            {allDone ? 'Thiết lập hoàn tất!' : 'Hướng dẫn thiết lập lần đầu'}
          </p>
          <p className={cn(
            'text-xs',
            allDone ? 'text-emerald-600' : 'text-amber-700',
          )}>
            {allDone
              ? 'Tất cả thông tin quan trọng đã được điền đầy đủ.'
              : `Còn ${total - doneCount} mục chưa hoàn thành — website sẽ hiển thị thông tin mặc định.`}
          </p>
        </div>
        {open ? (
          <ChevronUp className={cn('h-4 w-4 shrink-0', allDone ? 'text-emerald-500' : 'text-amber-500')} />
        ) : (
          <ChevronDown className={cn('h-4 w-4 shrink-0', allDone ? 'text-emerald-500' : 'text-amber-500')} />
        )}
      </button>

      {/* Checklist */}
      {open && (
        <div className="border-t border-amber-100 px-5 pb-4 pt-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {CHECKLIST_ITEMS.map(item => {
              const done = item.keys.some(k => !!values[k])
              return (
                <div key={item.label} className="flex items-center gap-2.5 text-sm">
                  {done
                    ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    : <Circle className="h-4 w-4 shrink-0 text-stone-300" />}
                  <span className={done ? 'text-stone-600 line-through' : 'text-stone-700'}>
                    {item.label}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-200">
              <div
                className="h-full rounded-full bg-amber-400 transition-all"
                style={{ width: `${Math.round((doneCount / total) * 100)}%` }}
              />
            </div>
            <span className="text-xs text-stone-500">{Math.round((doneCount / total) * 100)}%</span>
            <button
              type="button"
              onClick={onDismiss}
              className="text-xs text-stone-400 underline hover:text-stone-600"
            >
              Ẩn hướng dẫn
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Section card ─────────────────────────────────────────────────────────────

const ACCENT_CLASSES: Record<string, { border: string; icon: string; dot: string }> = {
  amber: { border: 'border-amber-200', icon: 'text-amber-600 bg-amber-50', dot: 'bg-amber-400' },
  blue: { border: 'border-blue-200', icon: 'text-blue-600 bg-blue-50', dot: 'bg-blue-400' },
  green: { border: 'border-emerald-200', icon: 'text-emerald-600 bg-emerald-50', dot: 'bg-emerald-400' },
}

function SectionCard({
  section, values, setValues,
}: {
  section: SectionDef
  values: Record<string, string>
  setValues: React.Dispatch<React.SetStateAction<Record<string, string>>>
}) {
  const { icon: Icon, accent } = section
  const ac = ACCENT_CLASSES[accent] ?? ACCENT_CLASSES.amber

  return (
    <div className={cn('rounded-2xl bg-white shadow-sm border', ac.border)}>
      {/* Section header */}
      <div className="flex items-center gap-3 border-b border-stone-100 px-6 py-4">
        <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', ac.icon)}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div>
          <h2 className="font-semibold text-stone-800">{section.title}</h2>
          <p className="text-xs text-stone-400">{section.description}</p>
        </div>
      </div>

      <div className="p-6">
        {section.guide}

        <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
          {section.fields.map(field => (
            <FieldRow
              key={field.key}
              field={field}
              value={values[field.key] || ''}
              onChange={v => setValues(p => ({ ...p, [field.key]: v }))}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Field row ────────────────────────────────────────────────────────────────

// Kiểm tra URL Google Maps có phải embed URL hợp lệ không
function isValidMapsEmbedUrl(url: string): boolean {
  if (!url) return true // chưa nhập → không cảnh báo
  return (
    url.includes('google.com/maps/embed') ||
    url.includes('maps.google.com/maps') ||
    url.includes('output=embed')
  )
}

function FieldRow({
  field, value, onChange,
}: {
  field: FieldDef
  value: string
  onChange: (v: string) => void
}) {
  const [showPreview, setShowPreview] = useState(false)
  const [hintOpen, setHintOpen] = useState(false)

  const isMapsField = field.key === 'google_maps_embed_url'
  const mapsUrlInvalid = isMapsField && value.length > 0 && !isValidMapsEmbedUrl(value)
  const mapsUrlValid = isMapsField && value.length > 0 && isValidMapsEmbedUrl(value)

  const inputClass = cn(
    'w-full rounded-lg border bg-stone-50 px-3 py-2.5 text-sm text-stone-800 placeholder:text-stone-300 focus:bg-white focus:outline-none transition-colors',
    mapsUrlInvalid
      ? 'border-red-300 focus:border-red-400'
      : 'border-stone-200 focus:border-amber-400',
  )

  return (
    <div className={cn('flex flex-col gap-1.5', field.wide && 'md:col-span-2')}>
      {/* Label row */}
      <div className="flex items-center gap-1.5">
        <label className="text-sm font-medium text-stone-700">{field.label}</label>
        <button
          type="button"
          onClick={() => setHintOpen(v => !v)}
          className="text-stone-300 hover:text-amber-500 transition-colors"
          aria-label="Xem hướng dẫn"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
        {field.mapsPreview && mapsUrlValid && (
          <button
            type="button"
            onClick={() => setShowPreview(v => !v)}
            className="ml-auto flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700"
          >
            {showPreview ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {showPreview ? 'Ẩn bản đồ' : 'Xem bản đồ'}
          </button>
        )}
        {field.type === 'url' && value && !isMapsField && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 text-xs text-stone-400 hover:text-blue-500"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      {/* Hint */}
      {hintOpen && (
        <div className="flex gap-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-800">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
          <span>{field.hint}</span>
        </div>
      )}

      {/* Hướng dẫn lấy Maps embed URL — hiện luôn khi field trống hoặc sai */}
      {isMapsField && !mapsUrlValid && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-3.5 text-xs text-blue-800">
          <p className="mb-2 font-semibold">Cách lấy URL nhúng bản đồ (3 bước):</p>
          <ol className="space-y-1.5">
            <li className="flex gap-2">
              <span className="shrink-0 font-bold text-blue-500">1.</span>
              <span>Mở <strong>Google Maps</strong> trên máy tính, tìm địa chỉ showroom</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 font-bold text-blue-500">2.</span>
              <span>Nhấn nút <strong>Chia sẻ</strong> → chọn tab <strong>"Nhúng bản đồ"</strong></span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 font-bold text-blue-500">3.</span>
              <span>Copy giá trị trong <code className="rounded bg-blue-100 px-1 font-mono">src="..."</code> của thẻ iframe — dán vào đây</span>
            </li>
          </ol>
          <p className="mt-2.5 rounded-lg bg-blue-100 px-2.5 py-1.5 font-mono text-[10px] text-blue-700 break-all">
            ✓ Đúng: https://www.google.com/maps/embed?pb=!1m18...
          </p>
          <p className="mt-1 rounded-lg bg-red-50 px-2.5 py-1.5 font-mono text-[10px] text-red-600 break-all">
            ✗ Sai: https://maps.app.goo.gl/... (link chia sẻ, không nhúng được)
          </p>
        </div>
      )}

      {/* Cảnh báo URL sai format */}
      {mapsUrlInvalid && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
          <span>
            <strong>URL không hợp lệ</strong> — Đây là link chia sẻ, không dùng được để nhúng iframe.
            Phải lấy từ Google Maps → Chia sẻ → <strong>Nhúng bản đồ</strong> → copy giá trị <code className="rounded bg-red-100 px-0.5 font-mono">src="..."</code>.
          </span>
        </div>
      )}

      {/* Input */}
      {field.textarea ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          className={inputClass}
          rows={3}
          placeholder={field.placeholder}
        />
      ) : (
        <input
          type={field.type ?? 'text'}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={inputClass}
          placeholder={field.placeholder}
        />
      )}

      {/* Maps inline preview — chỉ hiện khi URL hợp lệ */}
      {field.mapsPreview && showPreview && mapsUrlValid && (
        <div className="mt-1 overflow-hidden rounded-xl border border-stone-200" style={{ height: 200 }}>
          <iframe
            src={value}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title="Xem trước bản đồ"
          />
        </div>
      )}

      {/* Character count for meta_description */}
      {field.key === 'meta_description' && (
        <p className={cn('text-right text-xs', value.length > 160 ? 'text-red-400' : 'text-stone-300')}>
          {value.length}/160 ký tự {value.length > 160 && '— quá dài, Google có thể cắt bớt'}
        </p>
      )}
      {field.key === 'meta_title' && (
        <p className={cn('text-right text-xs', value.length > 60 ? 'text-red-400' : 'text-stone-300')}>
          {value.length}/60 ký tự {value.length > 60 && '— quá dài, Google có thể cắt bớt'}
        </p>
      )}
    </div>
  )
}

// ─── Logo section ─────────────────────────────────────────────────────────────

function LogoSection({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [uploadErr, setUploadErr] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    const err = validateImageFile(file)
    if (err) { setUploadErr(err); return }
    setUploading(true)
    setUploadErr(null)
    try {
      const media = await uploadMedia(file)
      onChange(media.preview_url || media.original_url)
    } catch {
      setUploadErr('Tải ảnh thất bại.')
    }
    setUploading(false)
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-stone-100 px-6 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-50 text-stone-500">
          <ImageIcon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="font-semibold text-stone-800">Logo website</h2>
          <p className="text-xs text-stone-400">Hiển thị ở header. PNG/WebP nền trong suốt, cao 40–60px.</p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          {value ? (
            <div className="relative flex h-14 items-center rounded-lg border border-stone-200 bg-stone-50 px-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Logo" className="max-h-10 max-w-[180px] object-contain" />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="flex h-14 items-center rounded-lg border border-dashed border-stone-300 bg-stone-50 px-4 text-sm text-stone-400">
              Chưa có logo — website dùng tên text thay thế
            </div>
          )}

          <div className="flex flex-col gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value = '' }}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-600 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-50"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
              {uploading ? 'Đang tải lên...' : 'Upload logo'}
            </button>
            {uploadErr && <p className="text-xs text-red-500">{uploadErr}</p>}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400">Hoặc nhập URL:</span>
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="https://..."
                className="w-48 rounded border border-stone-200 bg-stone-50 px-2 py-1.5 text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Logo hint */}
        <div className="mt-4 flex gap-2 rounded-lg bg-stone-50 px-3 py-2.5 text-xs text-stone-500">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-stone-300" />
          <span>
            Nếu không có logo, website tự động hiển thị tên (site_name) dạng text có kiểu chữ thương hiệu.
            Nên dùng file PNG hoặc WebP có nền trong suốt để logo không có viền trắng.
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Page Banners section ────────────────────────────────────────────────────

const PAGE_BANNER_ITEMS = [
  { slug: 'tu-bep', label: 'Tủ Bếp' },
  { slug: 'noi-that-khac', label: 'Nội Thất Khác' },
  { slug: 'du-an-thuc-te', label: 'Dự Án Thực Tế' },
  { slug: 'video-cong-trinh', label: 'Video Công Trình' },
  { slug: 'tin-tuc', label: 'Tin Tức' },
  { slug: 'danh-gia-khach-hang', label: 'Đánh Giá Khách Hàng' },
  { slug: 'bao-gia', label: 'Báo Giá' },
  { slug: 'lien-he', label: 'Liên Hệ' },
  { slug: 'gioi-thieu', label: 'Giới Thiệu' },
]

function PageBannersSection({
  values, setValues,
}: {
  values: Record<string, string>
  setValues: React.Dispatch<React.SetStateAction<Record<string, string>>>
}) {
  return (
    <div className="rounded-2xl border border-violet-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-stone-100 px-6 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <ImageLucide className="h-4 w-4" />
        </div>
        <div>
          <h2 className="font-semibold text-stone-800">Ảnh bìa các trang</h2>
          <p className="text-xs text-stone-400">Ảnh nền phần header mỗi trang. Nên dùng ảnh ngang, kích thước tối thiểu 1920×600px.</p>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PAGE_BANNER_ITEMS.map(({ slug, label }) => (
            <BannerUploadCard
              key={slug}
              label={label}
              value={values[`page_banner_${slug}`] || ''}
              onChange={(url) => setValues(p => ({ ...p, [`page_banner_${slug}`]: url }))}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function BannerUploadCard({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    const err = validateImageFile(file)
    if (err) return
    setUploading(true)
    try {
      const media = await uploadMedia(file)
      onChange(media.preview_url || media.original_url)
    } catch { /* skip */ }
    setUploading(false)
  }

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200">
      <div className="relative h-24 bg-stone-100">
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt={label} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/80 text-white hover:bg-red-600"
            >
              <X className="h-3 w-3" />
            </button>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-stone-400">
            Chưa có ảnh bìa
          </div>
        )}
      </div>
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-sm font-medium text-stone-700">{label}</span>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value = '' }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-stone-500 hover:bg-stone-100 hover:text-stone-700 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ImageIcon className="h-3 w-3" />}
            {value ? 'Đổi' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  )
}
