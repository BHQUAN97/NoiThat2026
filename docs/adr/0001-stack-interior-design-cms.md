# ADR-0001: Stack + muc tieu SEO (Curated Atelier aesthetic)

- **Status**: accepted
- **Date**: 2026-03-01
- **Tags**: stack, design

## Context

VietNet la interior design agency cao cap. Yeu cau:
- SEO cao (Google rank "thiet ke noi that cao cap", target Lighthouse 90+)
- Portfolio media-heavy (anh 1200px resolution)
- Admin CMS de content team cap nhat
- Real-time notifications cho admin (contact form submit, new consultation request)

## Decision

- **Frontend**: Next.js 15 App Router, React 18, Tailwind 3.4, Framer Motion 11, shadcn/ui + Radix
- **Backend**: NestJS 11, TypeORM 0.3, MySQL 8, Redis 7
- **Image pipeline**: Sharp 0.33 + Cloudflare R2 (AWS SDK v3 S3)
- **Real-time**: Socket.io + @socket.io/redis-adapter (cho admin notification)
- **Email**: Resend 6.9 (API-based)
- **Rich text**: Tiptap 3.22
- **Jobs**: BullMQ 5.4 + Redis
- **Logging**: Pino + pino-http (structured JSON)
- **E2E**: Playwright 1.50
- **Security**: Helmet 7.1, throttler 6.5, DOMPurify 3.9
- **Auth**: JWT 15m/7d + bcrypt rounds 12

### Scope
- **300 users/day** target
- **5 admin account**
- **Solo dev + Claude AI team**
- Domain: `bhquan.store`
- Lighthouse Mobile target: **90+**

### Design aesthetic
- **"Curated Atelier"**: minimalist, bold typography, generous whitespace
- Hero images full-bleed
- Earth tones + accent

## Rationale

- Next.js 15 App Router moi → SSR + Server Component → SEO tot
- Socket.io vs WebSocket raw: co Redis adapter tot cho multi-server
- Resend SaaS email > SMTP raw (deliverability tot hon)
- Sharp + R2 chua duoc validate o WebPhoto → reuse pattern

## Consequences

### Tich cuc
- SEO optimized
- Scale duoc (Socket.io Redis adapter)
- Image heavy: Sharp async, khong block response

### Tieu cuc
- Stack phuc tap hon LeQuyDon (them BullMQ, Socket.io, Resend)
- Learning curve Tiptap 3 (breaking changes tu v2)

## References

- `.sdd/constitution.md`
- Related: LeQuyDon ADR-0001 (same stack family, simpler)
