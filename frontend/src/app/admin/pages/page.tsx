'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Save,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Undo2,
  History,
  Loader2,
  ImageIcon,
  X,
  GripVertical,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { uploadMedia, validateImageFile } from '@/lib/media'
import api from '@/lib/api'
import { formatDateTime } from '@/lib/date'
import { cn } from '@/lib/utils'
import type { PageConfig, PageSection, PageSectionType, PageConfigData, PageConfigHistory } from '@/types'

const SECTION_TYPE_LABELS: Record<PageSectionType, string> = {
  hero: 'Hero Banner',
  featured_products: 'Sản phẩm nổi bật',
  featured_projects: 'Dự án tiêu biểu',
  about: 'Về chúng tôi',
  latest_news: 'Tin tức mới nhất',
  contact_cta: 'Liên hệ CTA',
  testimonials: 'Đánh giá khách hàng',
}

const NEW_SECTION_DEFAULTS: Record<PageSectionType, Record<string, unknown>> = {
  hero: {
    label: 'Chuyên nghiệp',
    title: 'Nội Thất Duy Mạnh',
    subtitle: 'Thiết kế nội thất đẳng cấp cho ngôi nhà của bạn',
    text_align: 'center',
    cta_primary_text: 'Xem sản phẩm',
    cta_primary_link: '/tu-bep',
    cta_secondary_text: 'Liên hệ ngay',
    cta_secondary_link: '/lien-he',
    bg_images: [],
  },
  featured_products: {
    label: 'Sản phẩm',
    title: 'Sản phẩm nổi bật',
    limit: 8,
    cta_text: 'Xem tất cả',
    cta_link: '/tu-bep',
  },
  featured_projects: {
    label: 'Dự án',
    title: 'Dự án tiêu biểu',
    limit: 6,
    cta_text: 'Xem tất cả',
    cta_link: '/du-an-thuc-te',
  },
  about: {
    label: 'Về chúng tôi',
    title: 'Nội Thất Duy Mạnh',
    description: 'Hơn 10 năm kinh nghiệm thiết kế và thi công nội thất cao cấp tại Hà Nội.',
    text_align: 'left',
    images: [],
    stats: [],
  },
  latest_news: {
    label: 'Tin tức',
    title: 'Tin tức mới nhất',
    limit: 3,
  },
  contact_cta: {
    title: 'Liên hệ ngay hôm nay',
    description: 'Nhận tư vấn miễn phí và báo giá chi tiết từ đội ngũ chuyên gia.',
    text_align: 'center',
    cta_text: 'Liên hệ tư vấn',
    cta_link: '/lien-he',
  },
  testimonials: {
    label: 'Đánh giá',
    title: 'Khách hàng nói gì về chúng tôi',
    items: [],
  },
}

const DEFAULT_SECTIONS: PageSection[] = [
  { id: 'default-hero', type: 'hero', visible: true, config: NEW_SECTION_DEFAULTS.hero },
  { id: 'default-products', type: 'featured_products', visible: true, config: NEW_SECTION_DEFAULTS.featured_products },
  { id: 'default-projects', type: 'featured_projects', visible: true, config: NEW_SECTION_DEFAULTS.featured_projects },
  { id: 'default-about', type: 'about', visible: true, config: NEW_SECTION_DEFAULTS.about },
  { id: 'default-news', type: 'latest_news', visible: true, config: NEW_SECTION_DEFAULTS.latest_news },
  { id: 'default-cta', type: 'contact_cta', visible: true, config: NEW_SECTION_DEFAULTS.contact_cta },
  { id: 'default-testimonials', type: 'testimonials', visible: true, config: NEW_SECTION_DEFAULTS.testimonials },
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
        const rawSections = draft?.sections || DEFAULT_SECTIONS
        setSections(rawSections.map((s) => ({ ...s, id: s.id || genId() })))
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
      setSaveStatus('Đã xuất bản thành công!')
      setTimeout(() => setSaveStatus(null), 3000)
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
      setSaveStatus(`Đã khôi phục về phiên bản ${version}`)
      setTimeout(() => setSaveStatus(null), 3000)
    } catch {
      setError(`Không thể rollback về phiên bản ${version}.`)
    }
  }

  const updateSectionConfig = (sectionId: string, key: string, value: unknown) => {
    setSections((prev) =>
      prev.map((s) => s.id === sectionId ? { ...s, config: { ...s.config, [key]: value } } : s),
    )
  }

  const toggleSectionVisibility = (sectionId: string) => {
    setSections((prev) => prev.map((s) => s.id === sectionId ? { ...s, visible: !s.visible } : s))
  }

  const removeSection = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId))
    if (expandedSection === sectionId) setExpandedSection(null)
  }

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === sectionId)
      if (idx < 0) return prev
      const newIdx = direction === 'up' ? idx - 1 : idx + 1
      if (newIdx < 0 || newIdx >= prev.length) return prev
      const arr = [...prev]
      ;[arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]]
      return arr
    })
  }

  const addSection = (type: PageSectionType) => {
    const newSection: PageSection = {
      id: genId(),
      type,
      visible: true,
      config: { ...NEW_SECTION_DEFAULTS[type] },
    }
    setSections((prev) => [...prev, newSection])
    setExpandedSection(newSection.id)
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
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-headline-lg text-on-surface">Page Builder</h1>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Trang chủ — Phiên bản {pageConfig?.version || 0}
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

      {/* Sections list */}
      <div className="space-y-3">
        {sections.map((section, idx) => (
          <SectionCard
            key={section.id}
            section={section}
            isFirst={idx === 0}
            isLast={idx === sections.length - 1}
            expanded={expandedSection === section.id}
            onToggleExpand={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
            onToggleVisibility={() => toggleSectionVisibility(section.id)}
            onRemove={() => removeSection(section.id)}
            onMoveUp={() => moveSection(section.id, 'up')}
            onMoveDown={() => moveSection(section.id, 'down')}
            onUpdate={(key, value) => updateSectionConfig(section.id, key, value)}
          />
        ))}
      </div>

      {/* Add section */}
      <div className="mt-4">
        {showAddSection ? (
          <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-label text-label-lg text-on-surface-variant">Thêm section mới</p>
              <button onClick={() => setShowAddSection(false)} className="p-1 text-on-surface-variant hover:text-on-surface">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(SECTION_TYPE_LABELS) as PageSectionType[]).map((type) => (
                <Button key={type} variant="ghost" size="sm" onClick={() => addSection(type)}>
                  <Plus className="mr-1 h-4 w-4" />
                  {SECTION_TYPE_LABELS[type]}
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

      {/* History modal */}
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

/* ─── Section Card ────────────────────────────────────────────── */

function SectionCard({ section, isFirst, isLast, expanded, onToggleExpand, onToggleVisibility, onRemove, onMoveUp, onMoveDown, onUpdate }: {
  section: PageSection
  isFirst: boolean
  isLast: boolean
  expanded: boolean
  onToggleExpand: () => void
  onToggleVisibility: () => void
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
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        <button
          onClick={onToggleExpand}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <GripVertical className="h-5 w-5 shrink-0 text-on-surface-variant/40" />
          <span className="truncate font-label text-label-lg text-on-surface">
            {SECTION_TYPE_LABELS[section.type]}
          </span>
          {!section.visible && (
            <span className="shrink-0 text-body-sm text-on-surface-variant">(Ẩn)</span>
          )}
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            onClick={onToggleVisibility}
            title={section.visible ? 'Ẩn section' : 'Hiện section'}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high"
          >
            {section.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          <button
            onClick={onRemove}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={onToggleExpand}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Config editor */}
      {expanded && (
        <div className="border-t border-outline-variant/30 px-4 py-4">
          <SectionConfigEditor type={section.type} config={section.config} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  )
}

/* ─── Shared field components ─────────────────────────────────── */

function FieldInput({ label, value, onChange, multiline, placeholder }: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  placeholder?: string
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

function FieldNumber({ label, value, onChange }: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <label className="mb-1 block font-label text-label-md text-on-surface-variant">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
        className="w-full rounded-lg bg-surface-container px-3 py-2 text-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  )
}

function FieldAlign({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block font-label text-label-md text-on-surface-variant">Căn chữ</label>
      <div className="flex gap-1">
        {(['left', 'center', 'right'] as const).map((align) => {
          const Icon = align === 'left' ? AlignLeft : align === 'center' ? AlignCenter : AlignRight
          return (
            <button
              key={align}
              type="button"
              onClick={() => onChange(align)}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg border transition-colors',
                value === align
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-outline-variant bg-surface-container text-on-surface-variant hover:bg-surface-container-high',
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Upload và quản lý danh sách ảnh. Max 10 ảnh, hỗ trợ xoá từng ảnh.
 */
function PageImageList({ label, images, onChange, max = 10 }: {
  label: string
  images: string[]
  onChange: (urls: string[]) => void
  max?: number
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList) {
    const fileArr = Array.from(files)
    const available = max - images.length
    if (available <= 0) return
    setUploading(true)
    setUploadError(null)
    const newUrls = [...images]
    for (const file of fileArr.slice(0, available)) {
      const err = validateImageFile(file)
      if (err) { setUploadError(err); continue }
      try {
        const media = await uploadMedia(file)
        newUrls.push(media.preview_url || media.original_url)
      } catch {
        setUploadError('Tải ảnh thất bại. Vui lòng thử lại.')
      }
    }
    onChange(newUrls)
    setUploading(false)
  }

  return (
    <div>
      <label className="mb-1 block font-label text-label-md text-on-surface-variant">
        {label} <span className="text-on-surface-variant/50">({images.length}/{max})</span>
      </label>

      {images.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {images.map((url, i) => (
            <div key={i} className="group relative h-16 w-24 overflow-hidden rounded-lg bg-surface-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(images.filter((_, idx) => idx !== i))}
                className="absolute right-0.5 top-0.5 rounded-full bg-error/80 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {uploadError && <p className="mb-1 text-[11px] text-error">{uploadError}</p>}

      {images.length < max && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
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

/**
 * Upload 1 ảnh duy nhất (dùng cho avatar testimonial).
 */
function PageImageSingle({ label, value, onChange }: {
  label: string
  value: string
  onChange: (url: string) => void
}) {
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
    <div>
      <label className="mb-1 block font-label text-label-md text-on-surface-variant">{label}</label>
      <div className="flex items-center gap-2">
        {value && (
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-surface-container">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="h-full w-full object-cover" />
          </div>
        )}
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
          className="flex items-center gap-1.5 rounded-lg border border-dashed border-on-surface/20 px-2 py-1.5 text-[11px] text-on-surface-variant hover:border-primary hover:text-primary disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ImageIcon className="h-3 w-3" />}
          {uploading ? 'Đang tải...' : value ? 'Đổi ảnh' : 'Chọn ảnh'}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[11px] text-error/70 hover:text-error"
          >
            Xoá
          </button>
        )}
      </div>
    </div>
  )
}

/* ─── Section Config Editor ───────────────────────────────────── */

function SectionConfigEditor({ type, config, onUpdate }: {
  type: PageSectionType
  config: Record<string, any>
  onUpdate: (key: string, value: unknown) => void
}) {
  switch (type) {
    case 'hero':
      return (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldInput label="Nhãn" value={config.label || ''} onChange={(v) => onUpdate('label', v)} placeholder="vd: Chuyên nghiệp" />
            <FieldAlign value={config.text_align || 'center'} onChange={(v) => onUpdate('text_align', v)} />
          </div>
          <FieldInput label="Tiêu đề" value={config.title || ''} onChange={(v) => onUpdate('title', v)} />
          <FieldInput label="Mô tả" value={config.subtitle || ''} onChange={(v) => onUpdate('subtitle', v)} multiline />
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldInput label="Nút chính - Text" value={config.cta_primary_text || ''} onChange={(v) => onUpdate('cta_primary_text', v)} />
            <FieldInput label="Nút chính - Link" value={config.cta_primary_link || ''} onChange={(v) => onUpdate('cta_primary_link', v)} placeholder="/tu-bep" />
            <FieldInput label="Nút phụ - Text" value={config.cta_secondary_text || ''} onChange={(v) => onUpdate('cta_secondary_text', v)} />
            <FieldInput label="Nút phụ - Link" value={config.cta_secondary_link || ''} onChange={(v) => onUpdate('cta_secondary_link', v)} placeholder="/lien-he" />
          </div>
          <PageImageList
            label="Ảnh nền (1 ảnh = tĩnh, nhiều ảnh = tự động lướt)"
            images={config.bg_images || (config.bg_image_url ? [config.bg_image_url] : [])}
            onChange={(urls) => onUpdate('bg_images', urls)}
            max={10}
          />
        </div>
      )

    case 'featured_products':
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldInput label="Nhãn" value={config.label || ''} onChange={(v) => onUpdate('label', v)} />
          <FieldInput label="Tiêu đề" value={config.title || ''} onChange={(v) => onUpdate('title', v)} />
          <FieldNumber label="Số lượng hiển thị" value={config.limit || 8} onChange={(v) => onUpdate('limit', v)} />
          <FieldInput label="Nút - Text" value={config.cta_text || ''} onChange={(v) => onUpdate('cta_text', v)} />
          <FieldInput label="Nút - Link" value={config.cta_link || ''} onChange={(v) => onUpdate('cta_link', v)} placeholder="/tu-bep" />
        </div>
      )

    case 'featured_projects':
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldInput label="Nhãn" value={config.label || ''} onChange={(v) => onUpdate('label', v)} />
          <FieldInput label="Tiêu đề" value={config.title || ''} onChange={(v) => onUpdate('title', v)} />
          <FieldNumber label="Số lượng hiển thị" value={config.limit || 6} onChange={(v) => onUpdate('limit', v)} />
          <FieldInput label="Nút - Text" value={config.cta_text || ''} onChange={(v) => onUpdate('cta_text', v)} />
          <FieldInput label="Nút - Link" value={config.cta_link || ''} onChange={(v) => onUpdate('cta_link', v)} placeholder="/du-an-thuc-te" />
        </div>
      )

    case 'about':
      return (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldInput label="Nhãn" value={config.label || ''} onChange={(v) => onUpdate('label', v)} />
            <FieldAlign value={config.text_align || 'left'} onChange={(v) => onUpdate('text_align', v)} />
          </div>
          <FieldInput label="Tiêu đề" value={config.title || ''} onChange={(v) => onUpdate('title', v)} />
          <FieldInput label="Mô tả" value={config.description || ''} onChange={(v) => onUpdate('description', v)} multiline />
          <PageImageList
            label="Ảnh minh họa (2 ảnh hiển thị song song)"
            images={config.images || []}
            onChange={(urls) => onUpdate('images', urls)}
            max={2}
          />
          <div>
            <label className="mb-2 block font-label text-label-md text-on-surface-variant">Thống kê</label>
            {(config.stats || []).map((stat: any, si: number) => (
              <div key={si} className="mb-2 flex flex-wrap gap-2 sm:flex-nowrap">
                <input
                  value={stat.value || ''}
                  onChange={(e) => {
                    const newStats = [...(config.stats || [])]
                    newStats[si] = { ...newStats[si], value: e.target.value }
                    onUpdate('stats', newStats)
                  }}
                  placeholder="vd: 10+"
                  className="w-full rounded-lg bg-surface-container px-3 py-2 text-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/40 sm:w-1/3"
                />
                <input
                  value={stat.label || ''}
                  onChange={(e) => {
                    const newStats = [...(config.stats || [])]
                    newStats[si] = { ...newStats[si], label: e.target.value }
                    onUpdate('stats', newStats)
                  }}
                  placeholder="vd: Năm kinh nghiệm"
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdate('stats', [...(config.stats || []), { value: '', label: '' }])}
            >
              <Plus className="mr-1 h-4 w-4" /> Thêm thống kê
            </Button>
          </div>
        </div>
      )

    case 'latest_news':
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldInput label="Nhãn" value={config.label || ''} onChange={(v) => onUpdate('label', v)} />
          <FieldInput label="Tiêu đề" value={config.title || ''} onChange={(v) => onUpdate('title', v)} />
          <FieldNumber label="Số bài viết hiển thị" value={config.limit || 3} onChange={(v) => onUpdate('limit', v)} />
        </div>
      )

    case 'contact_cta':
      return (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldInput label="Tiêu đề" value={config.title || ''} onChange={(v) => onUpdate('title', v)} />
            <FieldAlign value={config.text_align || 'center'} onChange={(v) => onUpdate('text_align', v)} />
          </div>
          <FieldInput label="Mô tả" value={config.description || ''} onChange={(v) => onUpdate('description', v)} multiline />
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldInput label="Nút - Text" value={config.cta_text || ''} onChange={(v) => onUpdate('cta_text', v)} />
            <FieldInput label="Nút - Link" value={config.cta_link || ''} onChange={(v) => onUpdate('cta_link', v)} placeholder="/lien-he" />
          </div>
        </div>
      )

    case 'testimonials':
      return (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldInput label="Nhãn" value={config.label || ''} onChange={(v) => onUpdate('label', v)} />
            <FieldInput label="Tiêu đề" value={config.title || ''} onChange={(v) => onUpdate('title', v)} />
          </div>
          <div>
            <label className="mb-2 block font-label text-label-md text-on-surface-variant">Đánh giá khách hàng</label>
            {(config.items || []).map((item: any, ti: number) => (
              <div key={ti} className="mb-3 rounded-lg bg-surface p-3">
                <div className="mb-2 grid gap-2 sm:grid-cols-2">
                  <FieldInput
                    label="Tên"
                    value={item.name || ''}
                    onChange={(v) => {
                      const items = [...(config.items || [])]
                      items[ti] = { ...items[ti], name: v }
                      onUpdate('items', items)
                    }}
                    placeholder="Nguyễn Văn A"
                  />
                  <FieldInput
                    label="Vai trò"
                    value={item.role || ''}
                    onChange={(v) => {
                      const items = [...(config.items || [])]
                      items[ti] = { ...items[ti], role: v }
                      onUpdate('items', items)
                    }}
                    placeholder="Khách hàng"
                  />
                </div>
                <div className="mb-2">
                  <FieldInput
                    label="Nội dung đánh giá"
                    value={item.content || ''}
                    onChange={(v) => {
                      const items = [...(config.items || [])]
                      items[ti] = { ...items[ti], content: v }
                      onUpdate('items', items)
                    }}
                    multiline
                    placeholder="Sản phẩm rất tốt..."
                  />
                </div>
                <div className="flex items-center justify-between">
                  <PageImageSingle
                    label="Ảnh đại diện"
                    value={item.avatar_url || ''}
                    onChange={(v) => {
                      const items = [...(config.items || [])]
                      items[ti] = { ...items[ti], avatar_url: v }
                      onUpdate('items', items)
                    }}
                  />
                  <button
                    onClick={() => onUpdate('items', (config.items || []).filter((_: any, i: number) => i !== ti))}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdate('items', [...(config.items || []), { name: '', role: '', content: '', avatar_url: '' }])}
            >
              <Plus className="mr-1 h-4 w-4" /> Thêm đánh giá
            </Button>
          </div>
        </div>
      )

    default:
      return <p className="text-body-sm text-on-surface-variant">Không hỗ trợ chỉnh sửa section này.</p>
  }
}

/* ─── History Modal ───────────────────────────────────────────── */

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
