import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

/**
 * Middleware thuc hien 2 nhiem vu:
 * 1) Dat Content-Security-Policy header (unsafe-inline, nhat quan voi next.config.js)
 *    — Next.js 15 inject inline bootstrap scripts nen strict-dynamic/nonce bi block.
 * 2) Verify chu ky JWT trong cookie `auth_session` cho route /admin/*
 *    — defense-in-depth, BE van re-validate JWT tren moi API call.
 */
const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET || ''

function getSecretKey(): Uint8Array | null {
  if (!JWT_SECRET || JWT_SECRET.length < 32) return null
  return new TextEncoder().encode(JWT_SECRET)
}

// CSP nhat quan voi next.config.js — dung unsafe-inline vi Next.js 15 inject inline bootstrap scripts
// Nonce-based strict-dynamic bi loai bo vi framework chua propagate nonce dung cach trong v15
function buildCsp(): string {
  const directives = [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `img-src 'self' data: blob: https://*.r2.dev https://*.r2.cloudflarestorage.com https://bhquan.site https://bhquan.store https://images.unsplash.com https://picsum.photos https://fastly.picsum.photos https://i.picsum.photos https://lh3.googleusercontent.com https://img.youtube.com`,
    `font-src 'self' data: https://fonts.gstatic.com https://fonts.googleapis.com`,
    `connect-src 'self' wss: ws: https://*.r2.dev https://bhquan.site https://bhquan.store`,
    `media-src 'self' data: blob: https://*.r2.dev https://*.r2.cloudflarestorage.com`,
    `frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com https://maps.google.com https://maps.googleapis.com`,
    `frame-ancestors 'self'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
  ]
  return directives.join('; ')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── 1. Dat CSP header ───────────────────────────────────────
  const csp = buildCsp()
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('Content-Security-Policy', csp)

  // ── 2. Admin auth check ─────────────────────────────────────
  // Chi ap dung voi /admin/* (tru /admin/login). Cac route khac chi set CSP.
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('auth_session')?.value
    const loginUrl = new URL('/admin/login', request.url)

    if (!token) {
      return NextResponse.redirect(loginUrl)
    }

    const secret = getSecretKey()
    if (secret) {
      try {
        await jwtVerify(token, secret, { algorithms: ['HS256'] })
      } catch {
        const res = NextResponse.redirect(loginUrl)
        res.cookies.delete('auth_session')
        return res
      }
    }
    // Neu secret chua config -> fallback sang presence check (giu behavior cu)
  }

  // ── 3. Response + CSP header ────────────────────────────────
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })
  response.headers.set('Content-Security-Policy', csp)
  return response
}

/**
 * Matcher: ap dung cho tat ca route tru API internal + static assets + prefetch.
 * - Loai tru /api, /_next/static, /_next/image, favicon, robots, sitemap
 * - Loai tru prefetch requests (khong can CSP moi cho prefetch, giam overhead)
 */
export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
