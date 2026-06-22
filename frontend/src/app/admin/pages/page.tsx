'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Save, Eye, EyeOff, ChevronDown, ChevronUp, Plus, Trash2,
  Undo2, History, Loader2, ImageIcon, X, GripVertical, Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { uploadMedia, validateImageFile } from '@/lib/media'
import api from '@/lib/api'
import { formatDateTime } from '@/lib/date'
import { cn } from '@/lib/utils'
import type { PageConfig, PageSection, PageSectionType, PageConfigData, PageConfigHistory } from '@/types'

const SECTION_LABELS: Record<PageSectionType, string> = {
  hero: '🖼 Hero Banner',
  company_intro: '🏢 Giới Thiệu Công Ty',
  why_choose_us: '⭐ Điểm Khác Biệt',
  product_categories: '🗂 Danh Mục Sản Phẩm',
  featured_projects: '🏗 Dự Án Tiêu Biểu',
  video_section: '🎬 Video Công Trình',
  customer_reviews: '💬 Đánh Giá Khách Hàng',
  quote_form: '📋 Form Báo Giá',
}

const DEFAULT_CONFIGS: Record<PageSectionType, Record<string, unknown>> = {
  hero: {
    badge: 'Xưởng sản xuất trực tiếp',
    title: 'Kiến tạo không gian sống tinh tế.',
    subtitle: 'Xưởng tủ bếp và nội thất Duy Mạnh: ảnh công trình làm trung tâm, vật liệu rõ ràng, thi công gọn và tư vấn trực tiếp.',
    cta_primary_text: 'Bắt đầu dự án',
    cta_primary_link: '/bao-gia',
    bg_images: [],
  },
  company_intro: {
    label: 'The Atelier Philosophy',
    headline: 'Thiết kế là cuộc đối thoại giữa vật liệu, ánh sáng và thói quen sống.',
    body: 'Nội Thất Duy Mạnh tập trung vào các hệ tủ bếp, tủ áo và không gian gia đình được đo ni đóng giày theo từng căn nhà.',
    quote: 'Không chỉ lấp đầy căn phòng, chúng tôi hoàn thiện bầu không khí của ngôi nhà.',
    stats: [
      { value: '500+', label: 'Công trình hoàn thành' },
      { value: '10+', label: 'Năm kinh nghiệm' },
    ],
    images: [],
    link_text: 'Xem quy trình',
    link_href: '/gioi-thieu',
  },
  why_choose_us: {
    section_label: 'Điểm Khác Biệt',
    section_title: 'Tại Sao Chọn Nội Thất Duy Mạnh?',
    section_desc: 'Hơn 10 năm xây dựng uy tín, chúng tôi cam kết mang đến sự hài lòng tuyệt đối.',
    cards: [
      { title: 'Xưởng Sản Xuất Trực Tiếp', desc: 'Không qua trung gian, giá xưởng cạnh tranh nhất thị trường.', bgImage: '' },
      { title: 'Bảo Hành 5 Năm', desc: 'Cam kết bảo hành toàn bộ sản phẩm 5 năm. Hỗ trợ kỹ thuật miễn phí.', bgImage: '' },
      { title: 'Vật Liệu Chất Lượng Cao', desc: 'Inox 304 chính hãng, gỗ MDF chống ẩm, Acrylic bóng cao cấp.', bgImage: '' },
      { title: 'Giá Minh Bạch', desc: 'Báo giá chi tiết từng hạng mục. Không có phát sinh ngoài hợp đồng.', bgImage: '' },
      { title: 'Thi Công Tận Nơi', desc: 'Đội thợ kinh nghiệm, thi công tại nhà. Phục vụ Hà Nội và các tỉnh lân cận.', bgImage: '' },
      { title: 'Hỗ Trợ 7 Ngày / Tuần', desc: 'Đội tư vấn sẵn sàng 8h-18h hàng ngày kể cả cuối tuần.', bgImage: '' },
    ],
  },
  product_categories: {
    label: 'Bespoke Furniture',
    title: 'Danh mục sản phẩm',
  },
  featured_projects: {
    label: 'Our Legacy',
    title: 'Dự án tiêu biểu',
    limit: 3,
    cta_text: 'Xem portfolio',
    cta_link: '/du-an-thuc-te',
  },
  video_section: {
    label: 'Video',
    title: 'Video Công Trình',
    limit: 3,
  },
  customer_reviews: {
    label: 'Phản Hồi',
    title: 'Khách Hàng Nói Gì?',
    desc: 'Hơn 500 công trình hoàn thành, mỗi khách hàng là một câu chuyện thành công.',
    limit: 6,
  },
  quote_form: {},
}

const DEFAULT_SECTIONS: PageSection[] = [
  { id: 'default-hero', type: 'hero', visible: true, config: DEFAULT_CONFIGS.hero },
  { id: 'default-intro', type: 'company_intro', visible: true, config: DEFAULT_CONFIGS.company_intro },
  { id: 'default-why', type: 'why_choose_us', visible: true, config: DEFAULT_CONFIGS.why_choose_us },
  { id: 'default-cat', type: 'product_categories', visible: true, config: DEFAULT_CONFIGS.product_categories },
  { id: 'default-projects', type: 'featured_projects', visible: true, config: DEFAULT_CONFIGS.featured_projects },
  { id: 'default-video', type: 'video_section', visible: true, config: DEFAULT_CONFIGS.video_section },
  { id: 'default-reviews', type: 'customer_reviews', visible: true, config: DEFAULT_CONFIGS.customer_reviews },
  { id: 'default-quote', type: 'quote_form', visible: true, config: DEFAULT_CONFIGS.quote_form },
]

function genId() {
  return `section-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

const PAGE_SLUG = 'homepage'

export default function AdminPagesPage() {
  const [pageConfig, setPageConfig] = useState<PageConfig | null>(null)
  const [sections, setSections] = useState<PageSection[]>(DEFAULT_SECTIONS)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<PageConfigHistory[]>([])
  const [showAddSection, setShowAddSection] = useState(false)

  const fetchConfig = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await api.get(`/pages/${PAGE_SLUG}/draft`) as any
      const config = res.data as PageConfig
      if (config) {
        setPageConfig(config)
        const draft = config.config_draft as PageConfigData | null
        const raw = draft?.sections || DEFAULT_SECTIONS
        setSections(raw.map((s) => ({ ...s, id: s.id || genId() })))
      } else {
        setSections(DEFAULT_SECTIONS)
      }
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setSections(DEFAULT_SECTIONS)
      } else {
        setError('Không thể tải cấu hình trang.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchConfig() }, [fetchConfig])

  const saveDraft = async () => {
    setIsSaving(true)
    setSaveStatus(null)
    setError(null)
    try {
      const configData: PageConfigData = { sections }
      if (pageConfig) {
        await api.patch(`/pages/${PAGE_SLUG}/draft`, { config_draft: configData })
      } else {
        const res = await api.post('/pages', { page_slug: PAGE_SLUG, config_draft: configData }) as any
        setPageConfig(res.data)
      }
      setSaveStatus('Đã lưu bản nháp')
      setTimeout(() => setSaveStatus(null), 3000)
    } catch {
      setError('Lưu bản nháp thất bại.')
    } finally {
      setIsSaving(false)
    }
  }

  const publishConfig = async () => {
    setIsPublishing(true)
    setError(null)
    try {
      const configData: PageConfigData = { sections }
      if (pageConfig) {
        await api.patch(`/pages/${PAGE_SLUG}/draft`, { config_draft: configData })
      } else {
        const res = await api.post('/pages', { page_slug: PAGE_SLUG, config_draft: configData }) as any
        setPageConfig(res.data)
      }
      const res = await api.post(`/pages/${PAGE_SLUG}/publish`) as any
      setPageConfig(res.data)
      setSaveStatus('Đã xuất bản! Trang chủ sẽ cập nhật trong vài giây.')
      setTimeout(() => setSaveStatus(null), 5000)
    } catch {
      setError('Xuất bản thất bại.')
    } finally {
      setIsPublishing(false)
    }
  }

  const fetchHistory = async () => {
    try {
      const res = await api.get(`/pages/${PAGE_SLUG}/history`) as any
      setHistory(res.data || [])
      setShowHistory(true)
    } catch {
      setError('Không thể tải lịch sử.')
    }
  }

  const rollbackToVersion = async (version: number) => {
    try {
      const res = await api.post(`/pages/${PAGE_SLUG}/rollback/${version}`) as any
      setPageConfig(res.data)
      const draft = res.data?.config_draft as PageConfigData | null
      setSections((draft?.sections || DEFAULT_SECTIONS).map((s) => ({ ...s, id: s.id || genId() })))
      setShowHistory(false)
      setSaveStatus(`Đã khôi phục phiên bản ${version}`)
      setTimeout(() => setSaveStatus(null), 3000)
    } catch {
      setError(`Không thể rollback về phiên bản ${version}.`)
    }
  }

  const updateConfig = (sectionId: string, key: string, value: unknown) => {
    setSections((prev) =>
      prev.map((s) => s.id === sectionId ? { ...s, config: { ...s.config, [key]: value } } : s),
    )
  }

  const toggleVisible = (sectionId: string) => {
    setSections((prev) => prev.map((s) => s.id === sectionId ? { ...s, visible: !s.visible } : s))
  }

  const removeSection = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId))
    if (expandedSection === sectionId) setExpandedSection(null)
  }

  const moveSection = (sectionId: string, dir: 'up' | 'down') => {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === sectionId)
      if (idx < 0) return prev
      const newIdx = dir === 'up' ? idx - 1 : idx + 1
      if (newIdx < 0 || newIdx >= prev.length) return prev
      const arr = [...prev]
      ;[arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]]
      return arr
    })
  }

  const addSection = (type: PageSectionType) => {
    const s: PageSection = { id: genId(), type, visible: true, config: { ...DEFAULT_CONFIGS[type] } }
    setSections((prev) => [...prev, s])
    setExpandedSection(s.id)
    setShowAddSection(false)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="py-4">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-headline-lg text-on-surface">Trang Chủ</h1>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Page Builder — phiên bản {pageConfig?.version || 0}
            {pageConfig?.published_at && <> — Xuất bản lúc {formatDateTime(pageConfig.published_at)}</>}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {saveStatus && <span className="text-body-sm text-primary">{saveStatus}</span>}
          <Button variant="ghost" size="sm" onClick={fetchHistory} disabled={!pageConfig}>
            <History className="mr-2 h-4 w-4" /> Lịch sử
          </Button>
          <Button variant="secondary" size="sm" onClick={saveDraft} disabled={isSaving || isPublishing}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Lưu nháp
          </Button>
          <Button size="sm" onClick={publishConfig} disabled={isSaving || isPublishing}>
            {isPublishing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Xuất bản
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-xl bg-error-container px-4 py-3">
          <p className="text-body-sm text-on-error-container">{error}</p>
          <button onClick={() => setError(null)} className="p-1 text-on-error-container hover:opacity-70">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="space-y-3">
        {sections.map((section, idx) => (
          <SectionCard
            key={section.id}
            section={section}
            isFirst={idx === 0}
            isLast={idx === sections.length - 1}
            expanded={expandedSection === section.id}
            onToggleExpand={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
            onToggleVisible={() => toggleVisible(section.id)}
            onRemove={() => removeSection(section.id)}
            onMoveUp={() => moveSection(section.id, 'up')}
            onMoveDown={() => moveSection(section.id, 'down')}
            onUpdate={(key, value) => updateConfig(section.id, key, value)}
          />
        ))}
      </div>

      <div className="mt-4">
        {showAddSection ? (
          <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-label text-label-lg text-on-surface-variant">Thêm section</p>
              <button onClick={() => setShowAddSection(false)} className="p-1 text-on-surface-variant hover:text-on-surface">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(SECTION_LABELS) as PageSectionType[]).map((type) => (
                <Button key={type} variant="ghost" size="sm" onClick={() => addSection(type)}>
                  <Plus className="mr-1 h-4 w-4" />
                  {SECTION_LABELS[type]}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddSection(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-outline-variant py-4 text-label-md text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
          >
            <Plus className="h-4 w-4" /> Thêm section
          </button>
        )}
      </div>

      {showHistory && (
        <HistoryModal
          history={history}
          onClose={() => setShowHistory(false)}
          onRollback={rollbackToVersion}
        />
      )}
    </div>
  )
}

/* ─── Section Card ─────────────────────────────────────────────── */

function SectionCard({ section, isFirst, isLast, expanded, onToggleExpand, onToggleVisible, onRemove, onMoveUp, onMoveDown, onUpdate }: {
  section: PageSection
  isFirst: boolean
  isLast: boolean
  expanded: boolean
  onToggleExpand: () => void
  onToggleVisible: () => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onUpdate: (key: string, value: unknown) => void
}) {
  return (
    <div className={cn(
      'rounded-xl transition-all',
      section.visible ? 'bg-surface-container-low' : 'bg-surface-container-low/50 opacity-60',
      expanded && 'ring-1 ring-primary/20',
    )}>
      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        <button onClick={onToggleExpand} className="flex min-w-0 flex-1 items-center gap-2 text-left">
          <GripVertical className="h-5 w-5 shrink-0 text-on-surface-variant/40" />
          <span className="truncate font-label text-label-lg text-on-surface">
            {SECTION_LABELS[section.type]}
          </span>
          {!section.visible && (
            <span className="shrink-0 text-body-sm text-on-surface-variant">(Ẩn)</span>
          )}
        </button>
        <div className="flex items-center gap-1">
          <button onClick={onMoveUp} disabled={isFirst} className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30">
            <ChevronUp className="h-4 w-4" />
          </button>
          <button onClick={onMoveDown} disabled={isLast} className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30">
            <ChevronDown className="h-4 w-4" />
          </button>
          <button onClick={onToggleVisible} title={section.visible ? 'Ẩn' : 'Hiện'} className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high">
            {section.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          <button
            onClick={() => {
              const def = DEFAULT_CONFIGS[section.type]
              if (def) Object.entries(def).forEach(([k, v]) => onUpdate(k, v))
            }}
            title="Lấy lại mặc định"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-warning-container hover:text-on-warning-container"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button onClick={onRemove} className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container">
            <Trash2 className="h-4 w-4" />
          </button>
          <button onClick={onToggleExpand} className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-outline-variant/30 px-4 py-4">
          <SectionEditor type={section.type} config={section.config} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  )
}

/* ─── Shared field primitives ──────────────────────────────────── */

export interface ImgItem { url: string; pos?: string }

function toImgItem(v: unknown): ImgItem {
  if (typeof v === 'string') return { url: v, pos: 'center' }
  const x = v as any
  return { url: x?.url || '', pos: x?.pos || 'center' }
}

const POS_GRID = [
  ['top left', 'top center', 'top right'],
  ['center left', 'center', 'center right'],
  ['bottom left', 'bottom center', 'bottom right'],
]
const POS_LABELS = [
  ['Trên trái', 'Trên giữa', 'Trên phải'],
  ['Giữa trái', 'Giữa', 'Giữa phải'],
  ['Dưới trái', 'Dưới giữa', 'Dưới phải'],
]

function PositionPicker({ value = 'center', onChange }: { value?: string; onChange: (pos: string) => void }) {
  return (
    <div className="inline-grid grid-cols-3 gap-[3px] rounded-md bg-surface-container p-1.5">
      {POS_GRID.flat().map((pos, i) => (
        <button
          key={pos}
          type="button"
          title={POS_LABELS.flat()[i]}
          onClick={() => onChange(pos)}
          className={cn(
            'h-3 w-3 rounded-[2px] transition-colors',
            value === pos ? 'bg-primary' : 'bg-on-surface/20 hover:bg-primary/50',
          )}
        />
      ))}
    </div>
  )
}

function FInput({ label, value, onChange, multiline, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string
}) {
  return (
    <div>
      <label className="mb-1 block font-label text-label-md text-on-surface-variant">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder={placeholder}
          className="w-full resize-none rounded-lg bg-surface-container px-3 py-2 text-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/40"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg bg-surface-container px-3 py-2 text-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/40"
        />
      )}
    </div>
  )
}

function FNumber({ label, value, onChange, min = 1, max = 20 }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number
}) {
  return (
    <div>
      <label className="mb-1 block font-label text-label-md text-on-surface-variant">{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || min)}
        className="w-full rounded-lg bg-surface-container px-3 py-2 text-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  )
}

function FImageList({ label, images, onChange, max = 10 }: {
  label: string
  images: ImgItem[]
  onChange: (items: ImgItem[]) => void
  max?: number
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadErr, setUploadErr] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList) {
    const available = max - images.length
    if (available <= 0) return
    setUploading(true)
    setUploadErr(null)
    const newItems = [...images]
    for (const file of Array.from(files).slice(0, available)) {
      const err = validateImageFile(file)
      if (err) { setUploadErr(err); continue }
      try {
        const media = await uploadMedia(file)
        newItems.push({ url: media.preview_url || media.original_url, pos: 'center' })
      } catch {
        setUploadErr('Tải ảnh thất bại.')
      }
    }
    onChange(newItems)
    setUploading(false)
  }

  function updatePos(i: number, pos: string) {
    const next = images.map((item, idx) => idx === i ? { ...item, pos } : item)
    onChange(next)
  }

  return (
    <div>
      <label className="mb-1 block font-label text-label-md text-on-surface-variant">
        {label} <span className="text-on-surface-variant/50">({images.length}/{max})</span>
      </label>
      {images.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-3">
          {images.map((item, i) => (
            <div key={i} className="group flex flex-col gap-1.5 rounded-xl bg-surface-container p-1.5">
              <div className="relative h-16 w-24 overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ objectPosition: item.pos || 'center' }}
                />
                <button
                  type="button"
                  onClick={() => onChange(images.filter((_, idx) => idx !== i))}
                  className="absolute right-0.5 top-0.5 rounded-full bg-error/80 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="flex items-center justify-between px-0.5">
                <span className="text-[10px] text-on-surface-variant/60">Vị trí</span>
                <PositionPicker value={item.pos} onChange={(pos) => updatePos(i, pos)} />
              </div>
            </div>
          ))}
        </div>
      )}
      {uploadErr && <p className="mb-1 text-[11px] text-error">{uploadErr}</p>}
      {images.length < max && (
        <>
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = '' }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-lg border border-dashed border-on-surface/20 px-3 py-2 text-body-sm text-on-surface-variant hover:border-primary hover:text-primary disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
            {uploading ? 'Đang tải...' : 'Chọn ảnh'}
          </button>
        </>
      )}
    </div>
  )
}

function FImageSingle({ label, item, onChange }: {
  label: string
  item: ImgItem
  onChange: (item: ImgItem) => void
}) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    const err = validateImageFile(file)
    if (err) return
    setUploading(true)
    try {
      const media = await uploadMedia(file)
      onChange({ url: media.preview_url || media.original_url, pos: item.pos || 'center' })
    } catch { /* skip */ }
    setUploading(false)
  }

  return (
    <div>
      <label className="mb-1 block font-label text-label-md text-on-surface-variant">{label}</label>
      <div className="flex flex-wrap items-start gap-2">
        {item.url && (
          <div className="flex flex-col gap-1.5 rounded-xl bg-surface-container p-1.5">
            <div className="relative h-12 w-20 overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt="" className="h-full w-full object-cover" style={{ objectPosition: item.pos || 'center' }} />
            </div>
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[10px] text-on-surface-variant/60">Vị trí</span>
              <PositionPicker value={item.pos} onChange={(pos) => onChange({ ...item, pos })} />
            </div>
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value = '' }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 rounded-lg border border-dashed border-on-surface/20 px-2 py-1.5 text-[11px] text-on-surface-variant hover:border-primary hover:text-primary disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ImageIcon className="h-3 w-3" />}
            {uploading ? 'Đang tải...' : item.url ? 'Đổi ảnh' : 'Chọn ảnh'}
          </button>
          {item.url && (
            <button type="button" onClick={() => onChange({ url: '', pos: 'center' })} className="text-[11px] text-error/70 hover:text-error">Xoá</button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Section Editors ──────────────────────────────────────────── */

function SectionEditor({ type, config, onUpdate }: {
  type: PageSectionType
  config: Record<string, any>
  onUpdate: (key: string, value: unknown) => void
}) {
  switch (type) {

    case 'hero':
      return (
        <div className="space-y-4">
          <FInput label="Badge (nhãn nhỏ)" value={config.badge || ''} onChange={(v) => onUpdate('badge', v)} placeholder="Xưởng sản xuất trực tiếp" />
          <FInput label="Tiêu đề lớn" value={config.title || ''} onChange={(v) => onUpdate('title', v)} />
          <FInput label="Mô tả" value={config.subtitle || ''} onChange={(v) => onUpdate('subtitle', v)} multiline />
          <div className="grid gap-4 sm:grid-cols-2">
            <FInput label="Nút CTA — Text" value={config.cta_primary_text || ''} onChange={(v) => onUpdate('cta_primary_text', v)} placeholder="Bắt đầu dự án" />
            <FInput label="Nút CTA — Link" value={config.cta_primary_link || ''} onChange={(v) => onUpdate('cta_primary_link', v)} placeholder="/bao-gia" />
          </div>
          <FImageList
            label="Ảnh nền (1 ảnh = tĩnh, nhiều ảnh = slideshow tự động)"
            images={(config.bg_images || []).map(toImgItem)}
            onChange={(items) => onUpdate('bg_images', items)}
            max={10}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 flex items-center gap-2 font-label text-label-md text-on-surface-variant">
                <input type="checkbox" checked={config.autoplay !== false} onChange={(e) => onUpdate('autoplay', e.target.checked)} className="h-4 w-4 rounded" />
                Tự động chuyển ảnh
              </label>
            </div>
            <FNumber label="Thời gian chuyển (giây)" value={config.autoplay_interval || 6} onChange={(v) => onUpdate('autoplay_interval', v)} min={2} max={15} />
          </div>
        </div>
      )

    case 'company_intro':
      return (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FInput label="Nhãn nhỏ" value={config.label || ''} onChange={(v) => onUpdate('label', v)} placeholder="The Atelier Philosophy" />
            <FInput label="Link text" value={config.link_text || ''} onChange={(v) => onUpdate('link_text', v)} placeholder="Xem quy trình" />
          </div>
          <FInput label="Headline" value={config.headline || ''} onChange={(v) => onUpdate('headline', v)} />
          <FInput label="Nội dung" value={config.body || ''} onChange={(v) => onUpdate('body', v)} multiline />
          <FInput label="Câu trích dẫn (quote)" value={config.quote || ''} onChange={(v) => onUpdate('quote', v)} placeholder='"Không chỉ lấp đầy căn phòng..."' />
          <FInput label="Link đích" value={config.link_href || ''} onChange={(v) => onUpdate('link_href', v)} placeholder="/gioi-thieu" />
          <FImageList
            label="2 ảnh minh họa (trái / phải)"
            images={(config.images || []).map(toImgItem)}
            onChange={(items) => onUpdate('images', items)}
            max={2}
          />
          <div>
            <label className="mb-2 block font-label text-label-md text-on-surface-variant">Thống kê (số liệu)</label>
            {(config.stats || []).map((stat: any, si: number) => (
              <div key={si} className="mb-2 flex gap-2">
                <input
                  value={stat.value || ''}
                  onChange={(e) => {
                    const s = [...(config.stats || [])]
                    s[si] = { ...s[si], value: e.target.value }
                    onUpdate('stats', s)
                  }}
                  placeholder="500+"
                  className="w-24 rounded-lg bg-surface-container px-3 py-2 text-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/40"
                />
                <input
                  value={stat.label || ''}
                  onChange={(e) => {
                    const s = [...(config.stats || [])]
                    s[si] = { ...s[si], label: e.target.value }
                    onUpdate('stats', s)
                  }}
                  placeholder="Công trình hoàn thành"
                  className="min-w-0 flex-1 rounded-lg bg-surface-container px-3 py-2 text-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  onClick={() => onUpdate('stats', (config.stats || []).filter((_: any, i: number) => i !== si))}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={() => onUpdate('stats', [...(config.stats || []), { value: '', label: '' }])}>
              <Plus className="mr-1 h-4 w-4" /> Thêm số liệu
            </Button>
          </div>
        </div>
      )

    case 'why_choose_us':
      return (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <FInput label="Nhãn nhỏ" value={config.section_label || ''} onChange={(v) => onUpdate('section_label', v)} placeholder="Điểm Khác Biệt" />
            <div className="sm:col-span-2">
              <FInput label="Tiêu đề section" value={config.section_title || ''} onChange={(v) => onUpdate('section_title', v)} />
            </div>
          </div>
          <FInput label="Mô tả section" value={config.section_desc || ''} onChange={(v) => onUpdate('section_desc', v)} />
          <div>
            <label className="mb-2 block font-label text-label-md text-on-surface-variant">Các thẻ điểm mạnh (tối đa 6)</label>
            {(config.cards || []).map((card: any, ci: number) => (
              <div key={ci} className="mb-3 rounded-lg bg-surface p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-label text-label-sm text-on-surface-variant">Thẻ #{ci + 1}</span>
                  <button
                    onClick={() => onUpdate('cards', (config.cards || []).filter((_: any, i: number) => i !== ci))}
                    className="flex h-7 w-7 items-center justify-center rounded text-on-surface-variant hover:bg-error-container hover:text-on-error-container"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <FInput
                  label="Tiêu đề"
                  value={card.title || ''}
                  onChange={(v) => {
                    const cards = [...(config.cards || [])]
                    cards[ci] = { ...cards[ci], title: v }
                    onUpdate('cards', cards)
                  }}
                />
                <FInput
                  label="Mô tả"
                  value={card.desc || ''}
                  onChange={(v) => {
                    const cards = [...(config.cards || [])]
                    cards[ci] = { ...cards[ci], desc: v }
                    onUpdate('cards', cards)
                  }}
                  multiline
                />
                <FImageSingle
                  label="Ảnh nền thẻ (tuỳ chọn)"
                  item={{ url: card.bgImage || '', pos: card.bgPos || 'center' }}
                  onChange={(img) => {
                    const cards = [...(config.cards || [])]
                    cards[ci] = { ...cards[ci], bgImage: img.url, bgPos: img.pos }
                    onUpdate('cards', cards)
                  }}
                />
              </div>
            ))}
            {(config.cards || []).length < 6 && (
              <Button variant="ghost" size="sm" onClick={() => onUpdate('cards', [...(config.cards || []), { title: '', desc: '', bgImage: '' }])}>
                <Plus className="mr-1 h-4 w-4" /> Thêm thẻ
              </Button>
            )}
          </div>
        </div>
      )

    case 'product_categories':
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <FInput label="Nhãn nhỏ" value={config.label || ''} onChange={(v) => onUpdate('label', v)} placeholder="Bespoke Furniture" />
          <FInput label="Tiêu đề" value={config.title || ''} onChange={(v) => onUpdate('title', v)} placeholder="Danh mục sản phẩm" />
          <p className="col-span-2 text-body-sm text-on-surface-variant/60">
            Danh mục sản phẩm được lấy từ cấu hình hệ thống, không chỉnh sửa ảnh ở đây.
          </p>
        </div>
      )

    case 'featured_projects':
      return (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FInput label="Nhãn nhỏ" value={config.label || ''} onChange={(v) => onUpdate('label', v)} placeholder="Our Legacy" />
            <FInput label="Tiêu đề" value={config.title || ''} onChange={(v) => onUpdate('title', v)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <FNumber label="Số dự án hiển thị" value={config.limit || 3} onChange={(v) => onUpdate('limit', v)} min={1} max={6} />
            <FInput label="Nút — Text" value={config.cta_text || ''} onChange={(v) => onUpdate('cta_text', v)} />
            <FInput label="Nút — Link" value={config.cta_link || ''} onChange={(v) => onUpdate('cta_link', v)} placeholder="/du-an-thuc-te" />
          </div>
          <p className="text-body-sm text-on-surface-variant/60">Dự án được lấy tự động từ các dự án có đánh dấu "nổi bật" trong hệ thống.</p>
        </div>
      )

    case 'video_section':
      return (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FInput label="Nhãn nhỏ" value={config.label || ''} onChange={(v) => onUpdate('label', v)} placeholder="Video" />
            <FInput label="Tiêu đề" value={config.title || ''} onChange={(v) => onUpdate('title', v)} placeholder="Video Công Trình" />
          </div>
          <FNumber label="Số video hiển thị" value={config.limit || 3} onChange={(v) => onUpdate('limit', v)} min={1} max={6} />
          <p className="text-body-sm text-on-surface-variant/60">Video được lấy tự động từ danh sách video trong hệ thống.</p>
        </div>
      )

    case 'customer_reviews':
      return (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FInput label="Nhãn nhỏ" value={config.label || ''} onChange={(v) => onUpdate('label', v)} placeholder="Phản Hồi" />
            <FInput label="Tiêu đề" value={config.title || ''} onChange={(v) => onUpdate('title', v)} placeholder="Khách Hàng Nói Gì?" />
          </div>
          <FInput label="Mô tả" value={config.desc || ''} onChange={(v) => onUpdate('desc', v)} multiline />
          <FNumber label="Số đánh giá hiển thị" value={config.limit || 6} onChange={(v) => onUpdate('limit', v)} min={1} max={12} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 flex items-center gap-2 font-label text-label-md text-on-surface-variant">
                <input type="checkbox" checked={config.autoplay !== false} onChange={(e) => onUpdate('autoplay', e.target.checked)} className="h-4 w-4 rounded" />
                Tự động chuyển slide
              </label>
            </div>
            <FNumber label="Thời gian chuyển (giây)" value={config.autoplay_interval || 5} onChange={(v) => onUpdate('autoplay_interval', v)} min={2} max={15} />
          </div>
          <p className="text-body-sm text-on-surface-variant/60">Đánh giá được lấy từ danh sách reviews có đánh dấu "nổi bật". Nhiều hơn 3 → hiển thị dạng carousel.</p>
        </div>
      )

    case 'quote_form':
      return (
        <p className="text-body-sm text-on-surface-variant">
          Form báo giá hiển thị cố định. Dùng nút Ẩn/Hiện để bật tắt section này trên trang chủ.
        </p>
      )

    default:
      return <p className="text-body-sm text-on-surface-variant">Không hỗ trợ chỉnh sửa section này.</p>
  }
}

/* ─── History Modal ────────────────────────────────────────────── */

function HistoryModal({ history, onClose, onRollback }: {
  history: PageConfigHistory[]
  onClose: () => void
  onRollback: (v: number) => void
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); onClose() } }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-on-surface/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-x-4 top-[10%] z-[61] mx-auto max-h-[80vh] max-w-lg overflow-y-auto rounded-2xl bg-surface-container-lowest shadow-ambient-xl sm:inset-x-auto sm:w-full">
        <div className="sticky top-0 flex items-center justify-between bg-surface-container-lowest px-6 py-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <h2 className="font-headline text-title-md text-on-surface">Lịch sử xuất bản</h2>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 pb-6">
          {history.length === 0 ? (
            <p className="py-8 text-center text-body-sm text-on-surface-variant">Chưa có lịch sử xuất bản</p>
          ) : (
            <div className="space-y-2">
              {history.map((h) => (
                <div key={h.id} className="flex items-center justify-between rounded-xl bg-surface-container p-4">
                  <div>
                    <p className="font-label text-label-lg text-on-surface">Phiên bản {h.version}</p>
                    <p className="text-[11px] text-on-surface-variant/60">
                      {h.published_at ? formatDateTime(h.published_at) : formatDateTime(h.created_at)}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onRollback(h.version)}>
                    <Undo2 className="mr-1 h-4 w-4" /> Khôi phục
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
