# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
**Constitution:** `.sdd/constitution.md` — doc TRUOC khi lam bat ky viec gi.

## Stack

- **Frontend:** Next.js 15 App Router, React 18, TypeScript, Tailwind CSS 3.4, Shadcn/Radix UI, Tiptap editor, Framer Motion
- **Backend:** NestJS 11, TypeScript, TypeORM 0.3, MySQL 8 (utf8mb4), Passport JWT
- **Infra:** Docker Compose (Nginx 1.25 + backend + frontend + MySQL), GitHub Actions CI/CD
- **Domain:** bhquan.site/bhquan.store | Storage: local `/uploads/` (was R2, migrated to local)

## Ports

| Service | Dev | Docker Prod |
|---------|-----|-------------|
| Frontend (Next.js) | 8082 | 5200 (Nginx) → 3000 (container) |
| Backend (NestJS) | 4000 | 5202 → 4000 (container) |
| MySQL | 3306 | 3309 → 3306 (container) |

## Build & Dev Commands

```bash
# Frontend (from frontend/)
npm run dev              # Next.js dev on :8082
npm run build            # Production build (standalone output)
npm run lint             # ESLint
npm run type-check       # tsc --noEmit

# Backend (from backend/)
npm run dev              # nest start --watch
npm run build            # nest build
npm run start:prod       # node dist/main
npm run lint             # ESLint
npm run type-check       # tsc --noEmit
npm run migration:run    # TypeORM migrations (dev, uses ts-node)
npm run migration:run:prod  # Migrations (prod, uses compiled JS)
npm run seed:admin       # Seed admin user
npm run seed:data        # Seed sample data
npm run seed:noithat     # Seed noi that catalog

# Docker (from root)
docker-compose up -d
docker-compose down
docker-compose logs -f <service>
```

## Architecture

### Monorepo Layout (two npm projects)
- `frontend/` — Next.js app, own `package.json`, `node_modules`
- `backend/` — NestJS app, own `package.json`, `node_modules`
- `db/schema/` — SQL init scripts for Docker
- `nginx/` — Nginx config for Docker reverse proxy
- `scripts/` — Deploy, backup, maintenance scripts
- `.github/workflows/` — CI, deploy, backup, SSL renewal, VPS setup

### Backend Architecture

**Layered NestJS modules** in `backend/src/modules/`. Each module follows: `*.module.ts` → `*.controller.ts` → `*.service.ts` → `entities/*.entity.ts` + `dto/*.dto.ts`.

**Base classes** (`backend/src/common/base/`):
- `BaseService<T>` — Template Method pattern CRUD with hooks: `beforeSave`, `validate`, `afterSave`, `beforeDelete`, `afterDelete`. Built-in soft delete, slug gen, pagination via query builder helpers.
- `PublishableService<T>` extends BaseService — adds `publish/unpublish` workflow, status filtering.
- `CrudController<T>` — mixin providing 7 standard CRUD endpoints. Subclass only adds custom endpoints.

**Auth:** Global `JwtAuthGuard` (all routes protected by default). Use `@Public()` to opt out, `@AdminOnly()` for admin-only. Tokens: accessToken (localStorage, 15min) + refreshToken (httpOnly cookie, 7d). Middleware in frontend also verifies JWT for `/admin/*` routes (defense-in-depth).

**API format:** All responses wrapped via `ResponseInterceptor` → `{ success, data, message, pagination? }`. Global prefix: `/api`. Global `ValidationPipe` with `whitelist: true, forbidNonWhitelisted: true`.

**Common utilities** (`backend/src/common/`):
- `guards/` — jwt-auth, roles, cron, optional-jwt-auth
- `decorators/` — `@Public()`, `@AdminOnly()`, `@CurrentUser()`, `@Cacheable()`
- `filters/` — GlobalExceptionFilter
- `helpers/` — response helper (`ok()`, `paginated()`), slug, ULID, query-builder helpers
- `pipes/` — ParseUlidPipe

**Modules:** auth, users, products, product-categories, projects, videos, news, pricing, reviews, forms, notifications, logs, analytics, page-configs, media, settings, health

### Frontend Architecture

**App Router** with route groups:
- `(public)/` — SSR public pages (SEO): tu-bep, du-an-thuc-te, tin-tuc, video-cong-trinh, bao-gia, danh-gia-khach-hang, gioi-thieu, lien-he, noi-that-khac
- `admin/` — CMS admin panel (client-side, JWT protected via middleware)

**Data fetching patterns:**
- Server components use `serverFetch<T>(path, { tags, revalidate })` from `lib/server-fetch.ts` — ISR with 1h default revalidate
- Client components use Axios instance from `lib/api.ts` — auto token refresh, response envelope unwrap, media URL normalization
- API URL resolution: `INTERNAL_API_URL` (Docker internal) → `NEXT_PUBLIC_API_URL` → `localhost:4000/api`. Media URLs from internal hostnames are stripped to relative paths in `lib/api-url.ts`.

**Admin hooks pattern:** `useAdminCrud` (CRUD operations) and `useAdminList` (paginated listing) — standardized hooks for all admin pages.

**Components:** `components/ui/` (Shadcn), `components/shared/` (reusable), `components/sections/` (page sections), `components/admin/` (CMS), `components/layout/` (header/footer), `components/catalog/` (product display)

**Middleware** (`frontend/src/middleware.ts`): Sets CSP headers on all routes + JWT verification for `/admin/*` (redirects to `/admin/login` if invalid).

### Docker Production

`docker-compose.yml`: Nginx (reverse proxy) → frontend (standalone Next.js :3000) + backend (:4000) + MySQL. Frontend uses `INTERNAL_API_URL=http://noithat-api:4000/api` for server-side calls. `next.config.js` rewrites `/api/*` and `/uploads/*` to backend (dev without Nginx).

### CI/CD

GitHub Actions workflows: `deploy-noithat.yml` (main deploy), `ci.yml` (lint/build check), `backup.yml` (DB + uploads backup), `ssl-renew.yml`, `vps-setup.yml`.

## Key Conventions

- IDs: ULID (not UUID/auto-increment) — validated via `ParseUlidPipe`
- Import alias: `@/*` → `src/*` (both FE and BE)
- Entities auto-discovered: `__dirname + '/**/*.entity{.ts,.js}'`
- Migrations: `backend/src/database/migrations/`, `synchronize: false`
- Media storage: local `backend/uploads/` served at `/uploads/*`, processed with Sharp
- Vietnamese SEO slugs on most content entities

## Auto Mode

### Tu dong thuc hien (khong hoi):
- Doc bat ky file nao trong repo
- Chay: build, typecheck, lint, test
- Tao/sua file code trong src/
- Cai package npm (khong phai global)
- Doc .env.example (KHONG doc .env that)

### Bat buoc hoi user:
- Xoa file hoac thu muc
- Chay migration DB production
- SSH vao VPS / lenh tren server
- Deploy len production
- Thay doi .env production
- Xoa data trong DB
- Commit va push len git
