# ADR-0010: Draft Mode preview voi secret token (next/preview)

- **Status**: accepted
- **Date**: 2026-04-10
- **Tags**: cms, feature

## Context

Admin edit article/page chua publish → muon preview truoc khi publish. Nhung:
- Public route khong hien content chua publish (guest khong thay)
- Preview = render nhu guest nhung voi draft data

Next.js co `draftMode()` API — co che official.

## Decision

**Draft Mode voi secret token**:

### Flow
1. Admin click "Preview" tren draft → `window.open('/api/draft?secret=...&slug=...')`
2. `/api/draft` route:
   - Verify `secret` match env
   - Goi `draftMode().enable()` → set cookie
   - Redirect den `/tin-tuc/${slug}` hoac `/page/${slug}`
3. Public page Server Component check `draftMode().isEnabled`:
   - Neu true → fetch data (including drafts)
   - Neu false → chi fetch published

### Secret
- `DRAFT_SECRET` env, 32 byte random
- Client-side admin page co secret
- URL not shareable (secret in URL, expire sau 1h)

### Exit
- `/api/draft-exit` → `draftMode().disable()`

## Rationale

- Official Next.js pattern
- Secret ngan attacker xem draft
- Preview environment identical voi prod (same SSR path)

## Consequences

### Tich cuc
- Admin confident truoc khi publish
- Khong can separate preview server

### Tieu cuc
- Co the forget disable draft mode → admin user se luon thay draft → mitigation: auto-exit sau 1h

## References

- Next.js docs: Draft Mode
- `frontend/src/app/api/draft/route.ts`
