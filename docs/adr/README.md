# VietNet2026 — Architecture Decision Records

> Interior Design CMS (agency cao cap). Next.js 15 + NestJS 11 + MySQL 8 + TypeORM + Redis + Socket.io + BullMQ.

## Index

- [ADR-0001](0001-stack-interior-design-cms.md) — Stack + muc tieu SEO (Curated Atelier aesthetic)
- [ADR-0002](0002-base-service-template-method.md) — BaseService Template Method voi hooks (giong WebTemplate)
- [ADR-0003](0003-bullmq-image-pipeline.md) — BullMQ IMAGE_JOB pipeline (Sharp + R2, EXIF strip)
- [ADR-0004](0004-socketio-redis-adapter.md) — Socket.io + Redis adapter cho multi-server scaling
- [ADR-0005](0005-resend-email-mail-job.md) — Resend API + MAIL_JOB BullMQ queue
- [ADR-0006](0006-page-builder-json-config.md) — Page Builder JSON config cho homepage
- [ADR-0007](0007-isr-revalidate-whitelist.md) — ISR + revalidatePath/revalidateTag whitelist endpoint
- [ADR-0008](0008-ip-anonymization-gdpr.md) — IP anonymization cho access logs (GDPR)
- [ADR-0009](0009-login-rate-limit-30m-lockout.md) — Login rate limit: 5 fail/10min → 30 min lockout
- [ADR-0010](0010-draft-mode-preview-secret.md) — Draft Mode preview voi secret token (next/preview)
