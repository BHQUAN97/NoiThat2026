# NoiThat2026 — Next Session Plan
> Cập nhật: 2026-06-06 | Branch: master

---

## Tổng quan tiến độ

| Sprint | Mô tả | Trạng thái |
|--------|--------|------------|
| Sprint 1 | Nền tảng: Docker, DB schema, env, Tailwind | ✅ DONE |
| Sprint 2 | Core BE modules + 11 FE public pages | ✅ DONE |
| Sprint 3 | Admin CMS + Infra (Docker, CI/CD, Seed) + QC | ✅ DONE |
| Sprint 4 | Real-time notifications (Socket.io) | ✅ DONE |
| **Sprint 5** | **Deploy lên VPS** | **⏳ TODO** |

---

## ✅ Trạng thái hiện tại — Code sẵn sàng

### Backend (NestJS 11, port 4002 dev / 5202 prod)
- 13 bảng DB, migration đã sync đúng với entity
- Modules: Auth, Users, Media, ProductCategories, Products, Projects, Videos, News, Pricing, Reviews, Forms, Settings, Notifications
- Global JwtAuthGuard + @Public() pattern
- SimpleMailService (Resend, không cần queue)
- Socket.io Gateway `/notifications` — emit `new-form` khi có form mới
- TS: 0 errors | Build: ✅

### Frontend (Next.js 15 App Router, port 8082 dev / 5200 prod)
- 11 trang public SSR: /, /gioi-thieu, /tu-bep, /tu-bep/[slug], /noi-that-khac, /du-an-thuc-te, /video-cong-trinh, /bao-gia, /tin-tuc, /danh-gia-khach-hang, /lien-he
- Admin CMS: dashboard, forms, categories, products, projects, videos, news, pricing, reviews, settings
- Real-time: bell 🔔 + badge sidebar "Form yêu cầu" + browser Notification
- TS: 0 errors | Build: ✅ | `output: 'standalone'` ✅

### Infra
- Docker Compose: build ✅ (backend + frontend images OK)
- nginx/conf.d/duymanh.bhquan.store.conf ✅
- .github/workflows/deploy-noithat.yml ✅
- Seed script: admin + 6 categories + 3 pricing + site_config ✅

---

## 🔴 Sprint 5 — Deploy lên VPS

### Môi trường
```
VPS:        159.223.77.247 (chung với VietNet2026)
User:       root
Deploy dir: /srv/noithat2026
Domain:     duymanh.bhquan.store
```

### Ports (không trùng VietNet)
| Service | Port |
|---------|------|
| Frontend HTTP | 5200 |
| Frontend HTTPS | 5201 |
| API NestJS | 5202 |
| MySQL | 3309 (internal Docker) |

### Checklist deploy lần đầu

```
□ 1. Add GitHub Actions Secrets:
       VPS_HOST        = 159.223.77.247
       VPS_USER        = root
       SSH_PRIVATE_KEY = <nội dung ~/.ssh/id_ed25519>

□ 2. Push lên GitHub:
       git add -A && git commit -m "feat: ready for deploy"
       git push origin master

□ 3. SSH vào VPS:
       ssh root@159.223.77.247

□ 4. Tạo thư mục + clone:
       mkdir -p /srv/noithat2026
       cd /srv/noithat2026
       git clone https://github.com/BHQUAN97/NoiThat2026.git .

□ 5. Tạo .env production (copy từ .env.example, điền đủ):
       cp .env.example .env
       nano .env
       # Cần điền: DB_PASSWORD, JWT_SECRET, RESEND_API_KEY, R2_*, ALLOWED_ORIGINS

□ 6. Start containers:
       docker compose up -d --build

□ 7. Chạy migration + seed:
       docker compose exec noithat-api npm run migration:run:prod
       docker compose exec noithat-api npx ts-node -r tsconfig-paths/register \
         src/database/seeds/seed-noithat.ts

□ 8. Setup Nginx trên VPS:
       cp nginx/conf.d/duymanh.bhquan.store.conf /etc/nginx/conf.d/
       nginx -t && systemctl reload nginx

□ 9. Cấp SSL:
       certbot --nginx -d duymanh.bhquan.store

□ 10. Kiểm tra:
        curl https://duymanh.bhquan.store/api/health
        curl https://duymanh.bhquan.store/api/product-categories
```

### .env production cần điền
```env
PORT=5202
NODE_ENV=production
DB_HOST=noithat-db
DB_PORT=3306
DB_USERNAME=noithat
DB_PASSWORD=<strong_password>
DB_NAME=noithat2026
JWT_SECRET=<random_64_chars>
JWT_EXPIRATION=3600
REFRESH_TOKEN_EXPIRATION=604800
R2_ACCOUNT_ID=<cloudflare_account_id>
R2_ACCESS_KEY=<r2_access_key>
R2_SECRET_KEY=<r2_secret_key>
RESEND_API_KEY=<resend_api_key>
ADMIN_EMAIL=duymanhnoithat@gmail.com
ALLOWED_ORIGINS=https://duymanh.bhquan.store
FRONTEND_URL=https://duymanh.bhquan.store
```

---

## 🐛 Schema Bugs đã fix (ghi nhớ cho lần sau)

| Bug | Root cause | Fix |
|-----|-----------|-----|
| `login_attempts.id` no default | Entity dùng `bigint AUTO_INCREMENT`, migration tạo `char(26)` | ALTER TABLE + fix migration |
| `refresh_tokens` thiếu 3 cột | Migration thiếu `revoked_at`, `ip_address`, `user_agent` | ALTER TABLE + fix migration |
| MySQL port conflict | docker-compose dùng 3307 (VietNet đã dùng) | Đổi sang 3309 |
| `REDIS_HOST` required | env.validation.ts còn khai báo VietNet | Remove khỏi required array |
| `db/schema/init.sql` invalid | Còn SOURCE commands VietNet | Replace bằng grant-only SQL |

---

## 📐 Architecture

```
NoiThat2026/
├── backend/                NestJS 11 | dev:4002 | prod:5202
│   ├── src/modules/
│   │   ├── auth/           JWT, bcrypt, login_attempts, refresh_tokens
│   │   ├── users/          CRUD users (super_admin, admin, editor, viewer)
│   │   ├── media/          Upload → Cloudflare R2 (fallback: local /uploads)
│   │   ├── notifications/  Socket.io gateway — admin room, new-form event
│   │   ├── product-categories/
│   │   ├── products/       OptionalJwtAuthGuard — admin get all, guest get active
│   │   ├── projects/       Filter by province
│   │   ├── videos/         youtube_id | video_url (2 loại)
│   │   ├── news/
│   │   ├── pricing/        items: [{label, price, unit, note}]
│   │   ├── reviews/
│   │   ├── forms/          quote + contact → email Resend + socket notify
│   │   └── settings/       site_config key-value
│   └── src/database/
│       ├── migrations/     1749200000000-NoiThat2026InitialSchema.ts
│       └── seeds/          seed-noithat.ts
│
├── frontend/               Next.js 15 App Router | dev:8082 | prod:5200/5201
│   ├── src/app/
│   │   ├── (public)/       11 trang public SSR
│   │   └── admin/          Admin CMS (JWT protected)
│   ├── src/components/
│   │   ├── layout/         TopBar, MainHeader, SiteFooter, AdminSidebar (+ badge)
│   │   ├── admin/          AdminShell, AdminHeader (bell 🔔), AdminSidebar badge
│   │   ├── sections/       8 homepage sections
│   │   └── forms/          QuoteForm, ContactForm
│   ├── src/contexts/       auth.context, notifications.context
│   └── src/hooks/          use-notifications.ts (socket.io-client)
│
├── nginx/conf.d/           duymanh.bhquan.store.conf ✅
├── docker-compose.yml      MySQL:3309, BE:5202, FE:5200/5201
└── .github/workflows/      deploy-noithat.yml ✅
```

---

## ⚡ Lệnh nhanh (dev)

```bash
# Start MySQL (Docker)
docker compose up -d mysql

# Backend dev
cd /e/DEVELOP/NoiThat2026/backend && npm run dev
# → http://localhost:4002/api/health

# Frontend dev
cd /e/DEVELOP/NoiThat2026/frontend && npm run dev
# → http://localhost:8082

# Migration + Seed
cd /e/DEVELOP/NoiThat2026/backend
npm run migration:run
npx ts-node -r tsconfig-paths/register src/database/seeds/seed-noithat.ts

# Build check
npm run build   # BE
cd ../frontend && npm run build  # FE

# Docker build
cd /e/DEVELOP/NoiThat2026 && docker compose build
```

---

## 🔑 Thông tin nhạy cảm (chỉ lưu local)

```
Admin dev:  admin@duymanhnoithat.vn / Admin@2026!
DB dev:     noithat / noithat_dev / noithat2026 (port 3309)
VPS:        root@159.223.77.247
```
