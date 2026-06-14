export interface ApiResponse<T> {
  success: boolean
  data: T | null
  message: string
  meta?: PaginationMeta
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

// ─── Auth ───────────────────────────────────────────────────────

export interface User {
  id: string
  full_name: string
  email: string
  role: 'super_admin' | 'admin' | 'editor' | 'viewer'
  status: 'active' | 'inactive' | 'banned'
  phone?: string | null
  avatar_url?: string | null
  last_login_at?: string | null
  created_at: string
  updated_at: string
}

export interface LoginResponse {
  user: User
  accessToken: string
}

// ─── Product Categories ─────────────────────────────────────────

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description?: string | null
  thumbnail_url?: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// ─── Products ───────────────────────────────────────────────────

export interface Product {
  id: string
  name: string
  slug: string
  category_id: string
  category?: ProductCategory | null
  short_description?: string | null
  description?: string | null
  thumbnail_url?: string | null
  gallery_urls?: string[] | null
  specs?: Record<string, string> | null
  sort_order: number
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

// ─── Projects ───────────────────────────────────────────────────

export interface Project {
  id: string
  name: string
  slug: string
  province: string
  location?: string | null
  area_sqm?: string | null
  description?: string | null
  thumbnail_url?: string | null
  gallery_urls?: string[] | null
  sort_order: number
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

// ─── Videos ─────────────────────────────────────────────────────

export type VideoType = 'youtube' | 'upload'

export interface Video {
  id: string
  title: string
  video_type: VideoType
  youtube_id?: string | null
  video_url?: string | null
  description?: string | null
  thumbnail_url?: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// ─── News ───────────────────────────────────────────────────────

export interface News {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content?: string | null
  thumbnail_url?: string | null
  is_active: boolean
  is_featured: boolean
  published_at?: string | null
  created_at: string
  updated_at: string
}

// ─── Pricing ────────────────────────────────────────────────────

export interface PricingItem {
  label: string
  price: string
  unit?: string
  note?: string
}

export interface PricingTable {
  id: string
  name: string
  description?: string | null
  items?: PricingItem[] | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// ─── Reviews ────────────────────────────────────────────────────

export interface Review {
  id: string
  customer_name: string
  location?: string | null
  rating: number
  content: string
  avatar_url?: string | null
  is_active: boolean
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

// ─── Form Submissions ───────────────────────────────────────────

export type FormType = 'quote' | 'contact'
export type FormStatus = 'new' | 'processing' | 'done'

export interface FormSubmission {
  id: string
  form_type: FormType
  name: string
  phone: string
  email?: string | null
  content?: Record<string, unknown> | null
  status: FormStatus
  created_at: string
  updated_at: string
}

// ─── Site Config ────────────────────────────────────────────────

export interface SiteConfig {
  key: string
  value: string
  type: string
  updated_at: string
}

// ─── Media ──────────────────────────────────────────────────────

export interface MediaUploadResponse {
  id: string
  original_url: string
  mime_type: string
  file_size: number
}

// ─── App Logs ───────────────────────────────────────────────────

export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace'

export interface AppLog {
  id: string
  level: LogLevel
  message: string
  stack_trace: string | null
  endpoint: string | null
  status_code: number | null
  ip: string | null
  user_id: string | null
  user_agent: string | null
  context: Record<string, unknown> | null
  created_at: string
}

export interface LogStats {
  errorCount: number
  warnCount: number
  infoCount: number
  totalToday: number
}

// ─── Analytics ──────────────────────────────────────────────────

export interface AnalyticsDashboard {
  totalViews: number
  totalUnique: number
  deviceBreakdown: { mobile: number; desktop: number; tablet: number }
  dailyTrend: Array<{ date: string; views: number; unique: number }>
  topPages: Array<{ path: string; views: number; unique: number }>
}

// ─── Page Config ────────────────────────────────────────────────

export type PageSectionType =
  | 'hero'
  | 'featured_products'
  | 'featured_projects'
  | 'about'
  | 'latest_news'
  | 'contact_cta'
  | 'testimonials'

export interface PageSection {
  id: string
  type: PageSectionType
  visible: boolean
  config: Record<string, unknown>
}

export interface PageConfigData {
  sections: PageSection[]
}

export interface PageConfig {
  id: string
  page_slug: string
  config_draft: PageConfigData | null
  config_published: PageConfigData | null
  version: number
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface PageConfigHistory {
  id: string
  page_config_id: string
  config_snapshot: PageConfigData
  version: number
  published_at: string | null
  created_at: string
}
