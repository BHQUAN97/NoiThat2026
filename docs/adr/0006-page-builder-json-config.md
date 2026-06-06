# ADR-0006: Page Builder JSON config cho homepage

- **Status**: accepted
- **Date**: 2026-04-05
- **Tags**: cms, feature

## Context

Interior design agency thuong xuyen doi homepage (feature project moi, seasonal campaign). Dev khong the sua code moi lan → admin phai co UI tu customize.

## Decision

**JSON config luu vao `pages` table, render frontend dynamic**:

### Schema
```sql
CREATE TABLE pages (
  id CHAR(26) PRIMARY KEY,
  slug VARCHAR(100) UNIQUE,
  title VARCHAR(255),
  config JSON,  -- layout config
  published BOOLEAN DEFAULT false,
  ...
);
```

### Config structure
```json
{
  "sections": [
    { "type": "hero", "bg_image": "...", "title": "...", "cta": "..." },
    { "type": "featured_projects", "project_ids": ["01HX...", "01HY..."], "layout": "grid-3" },
    { "type": "about_preview", "text": "...", "image": "..." },
    { "type": "services", "service_ids": [...] },
    { "type": "contact_cta", "title": "...", "subtitle": "..." }
  ]
}
```

### Frontend render
- Server Component `HomePage` fetch config → render theo type switch
- Moi section la component rieng (`HeroSection`, `FeaturedProjects`, etc.)
- Admin edit: drag-drop section, form edit props

### Draft mode (xem ADR-0010)
- Admin preview JSON chua publish qua `?preview_token=...`

## Rationale

- Admin tu quan ly khong can dev
- JSON flexible: them section type moi = them 1 component FE + 1 option UI admin
- Preview truoc khi publish → khong break live site

## Consequences

### Tich cuc
- Admin productivity cao
- Marketing campaign roll out nhanh
- Dev focus feature thay cho CMS content

### Tieu cuc
- Section type phai pre-defined (admin khong tu tao layout tu do)
- JSON schema drift rui ro → mitigation: Zod validate khi save

### Rui ro
- **Admin tao config sai → crash page** → mitigation: FE render try/catch per section, fallback "section loi" placeholder

## References

- `backend/src/modules/pages/`
- `frontend/src/app/(public)/page.tsx`
