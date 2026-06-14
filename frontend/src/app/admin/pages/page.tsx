'use client'

import { useState, useEffect, useCallback } from 'react'
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
  X,
  GripVertical,
} from 'lucide-react'
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
    title: 'Nội Thất Duy Mạnh',
    subtitle: 'Thiết kế nội thất đẳng cấp cho ngôi nhà của bạn',
    label: 'Chuyên nghiệp',
    cta_primary_text: 'Xem sản phẩm',
    cta_primary_link: '/san-pham',
    cta_secondary_text: 'Liên hệ ngay',
    cta_secondary_link: '/lien-he',
    bg_image_url: null,
  },
  featured_products: {
    label: 'Sản phẩm',
    title: 'Sản phẩm nổi bật',
    limit: 8,
    cta_text: 'Xem tất cả',
    cta_link: '/san-pham',
  },
  featured_projects: {
    label: 'Dự án',
    title: 'Dự án tiêu biểu',
    limit: 6,
    cta_text: 'Xem tất cả',
    cta_link: '/du-an',
  },
  about: {
    label: 'Về chúng tôi',
    title: 'Nội Thất Duy Mạnh',
    description: 'Hơn 10 năm kinh nghiệm thiết kế và thi công nội thất cao cấp.',
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
        const draft = config.config_draft
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-headline-lg text-on-surface">Trang chủ</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Cấu hình các section hiển thị trên trang chủ
            {pageConfig && <span className="ml-2 text-body-sm text-on-surface-variant/60">v{pageConfig.version}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchHistory}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 min-h-[44px] text-label-md text-on-surface-variant hover:bg-surface-container-high"
          >
            <History className="h-4 w-4" /> Lịch sử
          </button>
          <button
            onClick={saveDraft}
            disabled={isSaving || isPublishing}
            className="flex items-center gap-1.5 rounded-xl border border-outline px-4 py-2 min-h-[44px] text-label-md text-on-surface hover:bg-surface-container disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? 'Đang lưu...' : 'Lưu nháp'}
          </button>
          <button
            onClick={publishConfig}
            disabled={isSaving || isPublishing}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 min-h-[44px] text-label-md text-on-primary hover:bg-primary/90 disabled:opacity-50"
          >
            {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
            {isPublishing ? 'Đang xuất bản...' : 'Xuất bản'}
          </button>
        </div>
      </div>

      {/* Status/error messages */}
      {saveStatus && (
        <div className="mt-4 rounded-xl bg-primary-container px-4 py-3 text-body-sm text-on-primary-container">{saveStatus}</div>
      )}
      {error && (
        <div className="mt-4 flex items-center justify-between rounded-xl bg-error-container px-4 py-3">
          <p className="text-body-sm text-on-error-container">{error}</p>
          <button onClick={() => setError(null)} className="p-1 text-on-error-container hover:opacity-70"><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Published info */}
      {pageConfig?.published_at && (
        <p className="mt-3 text-body-sm text-on-surface-variant/60">
          Xuất bản lần cuối: {formatDateTime(pageConfig.published_at)}
        </p>
      )}

      {/* Sections list */}
      <div className="mt-6 space-y-3">
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
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-label-md text-on-surface">Thêm section</h3>
              <button onClick={() => setShowAddSection(false)} className="p-1 text-on-surface-variant hover:text-on-surface"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {(Object.keys(SECTION_TYPE_LABELS) as PageSectionType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => addSection(type)}
                  className="rounded-xl bg-surface-container px-3 py-2.5 text-left text-body-sm text-on-surface hover:bg-surface-container-high"
                >
                  {SECTION_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddSection(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-outline-variant py-4 text-label-md text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
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

/* ─── Section Card ─────────────────────────────────────────── */

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
  const label = SECTION_TYPE_LABELS[section.type]

  return (
    <div className={cn('rounded-2xl border transition-all', expanded ? 'border-primary/30 bg-surface-container-low' : 'border-outline-variant bg-surface-container-lowest')}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <GripVertical className="h-5 w-5 shrink-0 text-on-surface-variant/30" />

        <button onClick={onToggleExpand} className="flex flex-1 items-center gap-3 text-left">
          <div>
            <p className="text-body-sm font-medium text-on-surface">{label}</p>
            <p className="text-[11px] text-on-surface-variant/50">{section.type}</p>
          </div>
        </button>

        <div className="flex items-center gap-1">
          <button onClick={onMoveUp} disabled={isFirst} className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-20">
            <ChevronUp className="h-4 w-4" />
          </button>
          <button onClick={onMoveDown} disabled={isLast} className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-20">
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            onClick={onToggleVisibility}
            className={cn('flex h-8 w-8 items-center justify-center rounded-lg', section.visible ? 'text-on-surface-variant hover:bg-surface-container' : 'text-on-surface-variant/30 hover:bg-surface-container')}
            title={section.visible ? 'Ẩn section' : 'Hiện section'}
          >
            {section.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          <button onClick={onRemove} className="flex h-8 w-8 items-center justify-center rounded-lg text-error/50 hover:bg-error-container/30 hover:text-error">
            <Trash2 className="h-4 w-4" />
          </button>
          <button onClick={onToggleExpand} className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Config editor */}
      {expanded && (
        <div className="border-t border-outline-variant/30 p-4">
          <SectionConfigEditor type={section.type} config={section.config} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  )
}

/* ─── Section Config Editor ─────────────────────────────────── */

function SectionConfigEditor({ type, config, onUpdate }: {
  type: PageSectionType
  config: Record<string, unknown>
  onUpdate: (key: string, value: unknown) => void
}) {
  const field = (key: string, label: string, multiline = false) => (
    <div key={key}>
      <label className="block text-label-sm text-on-surface-variant mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={String(config[key] || '')}
          onChange={(e) => onUpdate(key, e.target.value)}
          rows={3}
          className="w-full rounded-xl bg-surface-container px-3 py-2 text-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        />
      ) : (
        <input
          type="text"
          value={String(config[key] || '')}
          onChange={(e) => onUpdate(key, e.target.value)}
          className="w-full rounded-xl bg-surface-container px-3 py-2 text-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
        />
      )}
    </div>
  )

  const numField = (key: string, label: string) => (
    <div key={key}>
      <label className="block text-label-sm text-on-surface-variant mb-1">{label}</label>
      <input
        type="number"
        value={Number(config[key] || 0)}
        onChange={(e) => onUpdate(key, parseInt(e.target.value, 10))}
        className="w-full rounded-xl bg-surface-container px-3 py-2 text-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  )

  const fields: React.ReactNode[] = []

  if (type === 'hero') {
    fields.push(
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {field('label', 'Nhãn')}
        {field('title', 'Tiêu đề')}
        {field('subtitle', 'Mô tả', true)}
        {field('cta_primary_text', 'Nút chính - Text')}
        {field('cta_primary_link', 'Nút chính - Link')}
        {field('cta_secondary_text', 'Nút phụ - Text')}
        {field('cta_secondary_link', 'Nút phụ - Link')}
        {field('bg_image_url', 'Ảnh nền (URL)')}
      </div>,
    )
  } else if (type === 'featured_products' || type === 'featured_projects') {
    fields.push(
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {field('label', 'Nhãn')}
        {field('title', 'Tiêu đề')}
        {numField('limit', 'Số lượng hiển thị')}
        {field('cta_text', 'Nút - Text')}
        {field('cta_link', 'Nút - Link')}
      </div>,
    )
  } else if (type === 'about') {
    fields.push(
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {field('label', 'Nhãn')}
        {field('title', 'Tiêu đề')}
        {field('description', 'Mô tả', true)}
      </div>,
    )
  } else if (type === 'latest_news') {
    fields.push(
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {field('label', 'Nhãn')}
        {field('title', 'Tiêu đề')}
        {numField('limit', 'Số bài viết hiển thị')}
      </div>,
    )
  } else if (type === 'contact_cta') {
    fields.push(
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {field('title', 'Tiêu đề')}
        {field('description', 'Mô tả', true)}
        {field('cta_text', 'Nút - Text')}
        {field('cta_link', 'Nút - Link')}
      </div>,
    )
  } else if (type === 'testimonials') {
    fields.push(
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {field('label', 'Nhãn')}
        {field('title', 'Tiêu đề')}
      </div>,
    )
  }

  return <div className="space-y-4">{fields}</div>
}

/* ─── History Modal ─────────────────────────────────────────── */

function HistoryModal({ history, onClose, onRollback }: { history: PageConfigHistory[]; onClose: () => void; onRollback: (v: number) => void }) {
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
            <div className="space-y-3">
              {history.map((h) => (
                <div key={h.id} className="flex items-center justify-between rounded-xl bg-surface-container p-4">
                  <div>
                    <p className="text-body-sm font-medium text-on-surface">Phiên bản {h.version}</p>
                    <p className="text-[11px] text-on-surface-variant/60">{h.published_at ? formatDateTime(h.published_at) : formatDateTime(h.created_at)}</p>
                  </div>
                  <button
                    onClick={() => onRollback(h.version)}
                    className="flex items-center gap-1.5 rounded-xl border border-outline px-3 py-1.5 text-label-sm text-on-surface hover:bg-surface-container-high"
                  >
                    <Undo2 className="h-3.5 w-3.5" /> Khôi phục
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
