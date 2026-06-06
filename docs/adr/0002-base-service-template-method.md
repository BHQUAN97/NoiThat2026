# ADR-0002: BaseService Template Method voi hooks

- **Status**: accepted
- **Date**: 2026-03-10
- **Tags**: backend, pattern

## Context

Nhieu module CRUD (articles, projects, products, consultations, pages). Neu copy-paste moi module → drift.

## Decision

Giong WebTemplate ADR-0003 — `BaseService<T, CreateDto, UpdateDto>` voi hooks:
- `beforeSave(existing, dto)` — validation, check dependencies
- `validate(dto, existing?)` — business rule (unique slug...)
- `saveData(entity)` — actual persist (override neu can transaction)
- `afterSave(saved, dto)` — cache invalidate, event emit, socket notify

### Enforced pattern
```typescript
class ArticleService extends BaseService<Article, CreateArticleDto, UpdateArticleDto> {
  protected async validate(dto, existing) {
    if (await this.repo.findOne({ where: { slug: dto.slug } })) {
      throw new ConflictException('Slug da ton tai');
    }
  }

  protected async afterSave(saved) {
    await this.cache.invalidate('articles:list');
    await this.socket.emitToAdmins('article:updated', saved);
    if (saved.published) {
      await this.revalidateFrontend.emit(`/tin-tuc/${saved.slug}`);
    }
  }
}
```

## Rationale

- Giong WebTemplate → developer familiar
- Hooks → afterSave la cho trigger ISR revalidate (ADR-0007), Socket.io broadcast (ADR-0004)

## References

- Related: WebTemplate ADR-0003 (origin)
