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
| **Sprint 5** | **Deploy lên VPS** | **✅ DONE** |

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

## ✅ Sprint 5 — Deploy lên VPS (DONE 2026-06-06)

### Kết quả
```
VPS:        159.223.77.247
Deploy dir: /opt/noithat2026   ← (đã đổi từ /srv/)
Domain:     https://duymanh.bhquan.store  ← LIVE + SSL
```

| Service | Port |
|---------|------|
| Frontend | 127.0.0.1:5200:3000 |
| API NestJS | 127.0.0.1:5202:4000 |
| MySQL | shared-mysql (webphoto_backend network) |

---

## 🐛 Vấn đề còn tồn đọng (cần xử lý)

### 🔴 Critical — Ảnh hưởng tính năng

**1. R2 + Resend chưa config** — upload media và gửi email form sẽ fail
```bash
# SSH vào VPS, điền vào /opt/noithat2026/.env:
R2_ACCOUNT_ID=<cloudflare_account_id>
R2_ACCESS_KEY=<r2_access_key>
R2_SECRET_KEY=<r2_secret_key>
R2_PUBLIC_URL=https://pub-xxxx.r2.dev
RESEND_API_KEY=re_xxxxx

# Restart backend để pick up env mới:
cd /opt/noithat2026
docker compose -f docker-compose.prod.yml restart backend
```

**2. Git pull token sẽ expire** — khi GitHub PAT hết hạn, `git pull` trong deploy fail
- Root cause: VPS clone dùng `https://USER:TOKEN@github.com/...` → token hết hạn = CI/CD gãy
- Fix: Tạo deploy key (SSH) thay vì token trong URL
```bash
# Trên VPS:
ssh-keygen -t ed25519 -f /opt/noithat2026/.deploy-key -N ""
cat /opt/noithat2026/.deploy-key.pub
# → Thêm public key vào GitHub repo → Settings → Deploy keys
# → Đổi remote URL:
cd /opt/noithat2026
git remote set-url origin git@github.com:BHQUAN97/NoiThat2026.git
```

---

### 🟡 Medium — Cần dọn dẹp

**3. `noithat-frontend` container unhealthy** — app chạy tốt (HTTP 200) nhưng healthcheck fail
- Root cause: `wget -qO- http://localhost:3000` trong container trả lỗi "Connection refused"
  - Có thể Next.js standalone listen trên `0.0.0.0` nhưng healthcheck chạy trong network namespace khác
  - VietNet cũng bị tương tự (unhealthy 4+ ngày) — không ảnh hưởng service
- Fix option A: Đổi healthcheck sang `curl` hoặc `node -e "require('http').get(...)"`
- Fix option B: Tắt healthcheck (`disable: true`) vì nginx đã làm proxy health

**4. `deploy-noithat.yml` — nginx reload lỗi khi cert chưa có**
- Lần deploy đầu tiên qua GitHub Actions fail vì cert chưa tồn tại khi chạy `nginx -s reload`
- Hiện tại cert đã có → các deploy sau sẽ OK
- Fix (phòng ngừa): Thêm `|| true` vào nginx reload trong workflow để không fail cứng

**5. seed:admin:prod và seed:data:prod trỏ file không tồn tại**
- `dist/scripts/seed-admin.js` và `dist/scripts/seed-data.js` chưa được tạo
- Đã workaround bằng `seed:prod` → `dist/database/seeds/seed-noithat.js`
- Fix: Tạo `src/scripts/seed-admin.ts` và `src/scripts/seed-data.ts` hoặc xóa 2 scripts thừa khỏi package.json

---

### 🟠 Workflows clone từ VietNet — cần xóa hoặc update

Các file sau là clone nguyên từ VietNet2026, dùng secrets/paths VietNet (`APP_DIR: /opt/vietnet`, `VPS_PASSWORD`, `VIETNET_DB_PASSWORD`...) → **fail mỗi lần trigger**:

| File | Vấn đề | Hành động |
|------|--------|-----------|
| `deploy.yml` (Auto Deploy) | Dùng `APP_DIR=/opt/vietnet`, `VPS_PASSWORD` | Xóa hoặc rewrite cho NoiThat |
| `backup.yml` | Backup DB `vietnet`, dùng `VPS_PASSWORD` | Xóa hoặc rewrite cho `noithat2026` |
| `restore.yml` | Restore VietNet | Xóa (chưa cần) |
| `cron.yml` | Cron VietNet endpoints | Xóa |
| `vps-setup.yml` | Setup VPS VietNet | Xóa (VPS đã setup rồi) |
| `reseed.yml` | Seed VietNet | Xóa hoặc update dùng `seed:prod` |
| `debug-logs.yml` | Logs VietNet containers | Update container names |
| `ssl-renew.yml` | Cần check domain | Update domain → `duymanh.bhquan.store` |

**Lệnh xóa nhanh (recommended):**
```bash
cd E:/DEVELOP/NoiThat2026
git rm .github/workflows/deploy.yml \
        .github/workflows/backup.yml \
        .github/workflows/restore.yml \
        .github/workflows/cron.yml \
        .github/workflows/vps-setup.yml \
        .github/workflows/reseed.yml \
        .github/workflows/debug-logs.yml
# Giữ lại: deploy-noithat.yml, ci.yml, ssl-renew.yml (sau khi update domain)
```

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
