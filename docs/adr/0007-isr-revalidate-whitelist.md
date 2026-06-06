# ADR-0007: ISR + revalidatePath/revalidateTag whitelist endpoint

- **Status**: accepted
- **Date**: 2026-04-05
- **Tags**: performance, cache

## Context

Public pages SSR → load moi request → cham + server tai cao. Co the dung ISR (Incremental Static Regeneration) cache page va revalidate khi content doi.

Nhung revalidate tu dong theo thoi gian (e.g. 60s) → admin publish bai moi phai cho → UX kem.

Can admin trigger revalidate **on demand** khi publish.

## Decision

**ISR base + backend-triggered revalidate**:

### FE routes
- `revalidate: 3600` default (1h safety net)
- Admin mutation → BE goi FE `/api/revalidate` voi secret

### BE → FE revalidate endpoint
```typescript
// frontend/src/app/api/revalidate/route.ts
export async function POST(request) {
  const { path, tag, secret } = await request.json();

  // Verify secret
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  // WHITELIST: chi cho phep specific paths/tags
  const allowedPaths = ['/tin-tuc', '/tin-tuc/[slug]', '/catalog', ...];
  const allowedTags = ['article-list', 'project-list', 'homepage'];

  if (path && !allowedPaths.some(p => path.startsWith(p))) {
    return NextResponse.json({ ok: false, msg: 'Path not whitelisted' }, { status: 400 });
  }

  if (path) revalidatePath(path);
  if (tag) revalidateTag(tag);

  return NextResponse.json({ ok: true });
}
```

### BE trigger
```typescript
// backend afterSave hook
await this.revalidateClient.trigger({ path: `/tin-tuc/${article.slug}`, tag: 'article-list' });
```

## Rationale

- ISR base cho page stable (policy, about...) — revalidate 1h
- Admin mutation → instant refresh cho bai moi
- Whitelist = chong abuse (khong ai revalidate random path)

## Consequences

### Tich cuc
- Public page TTFB ~50ms (static served)
- Admin publish = user thay ngay
- Backend ko can SSR compute moi request

### Tieu cuc
- Moi admin mutation phai nho emit revalidate
- Whitelist phai update khi them route moi

## References

- `frontend/src/app/api/revalidate/route.ts`
- Related: ADR-0006 (page builder → revalidate homepage)
