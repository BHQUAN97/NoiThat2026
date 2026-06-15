/**
 * Returns the API base URL for server-side fetching.
 * In Docker: uses INTERNAL_API_URL (http://backend:4000/api) to reach backend via internal network.
 * Fallback: uses NEXT_PUBLIC_API_URL or localhost.
 */
export function getServerApiUrl(): string {
  return (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:4000/api'
  )
}

/**
 * Chuyen media URL thanh path co the dung trong browser.
 * - Internal Docker URL (http://backend:4000/...) → strip hostname, tra ve path
 * - Absolute URL (R2, CDN) → giu nguyen
 * - Relative path (/uploads/...) → giu nguyen (browser resolve theo origin, Nginx proxy)
 *
 * Khong prefix internal hostname vao SSR output vi browser khong resolve duoc
 * va gay Mixed Content + CSP violation.
 */
export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (url.startsWith('data:')) return url

  // Strip internal Docker hostname: http://backend:4000/... or http://noithat-api:4000/...
  // Pattern: protocol://hostname-no-dots:port/path
  const internalMatch = url.match(/^https?:\/\/[a-z][a-z0-9_-]*:\d+(\/.*)$/)
  if (internalMatch) return internalMatch[1]

  // Absolute public URL (R2, Cloudflare, picsum, etc.) — return as-is
  if (url.startsWith('http') || url.startsWith('//')) return url

  // Relative path — return as-is, browser resolves against its origin
  // Nginx routes /uploads/ → backend container
  return url
}
