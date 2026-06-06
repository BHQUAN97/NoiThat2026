# ADR-0005: Resend API + MAIL_JOB BullMQ queue

- **Status**: accepted
- **Date**: 2026-03-25
- **Tags**: email, async

## Context

Email cases: password reset, consultation confirmation, contact form reply, newsletter. Options:
- SMTP raw (Nodemailer + provider) — cheap nhung deliverability rui ro
- SES — AWS, cheap, nhung setup phuc tap
- SendGrid — mature, dat
- **Resend** — modern API-first, developer-friendly, decent pricing

## Decision

**Resend API** + **MAIL_JOB BullMQ**:

### Why Resend
- REST API (khong SMTP complexity)
- React Email templates ho tro native
- Free tier 3000 email/month (du cho 300 DAU)
- DKIM/SPF auto setup

### Queue pattern
```typescript
await this.mailQueue.add('password-reset', {
  to: user.email,
  template: 'password-reset',
  data: { name: user.name, link: resetLink }
}, { attempts: 3, backoff: { type: 'exponential' } });
```

Worker retry 3 lan → fail → log, admin UI alert.

### Templates
- Handlebars compile tai runtime
- Template files `backend/src/modules/notifications/templates/*.hbs`
- Variables typed cho moi template

## Rationale

- Resend deliverability tot (SPF/DKIM config tu dong)
- Queue async → HTTP response khong cho email send
- Retry → transient network error khong mat notification

## Consequences

### Tich cuc
- Email delivery rate cao
- Password reset UX smooth (non-blocking)
- Template reusable

### Tieu cuc
- Resend bi chan o 1 so region (chua gap, nhung rui ro)
- Free tier limit 3000/month → can upgrade khi scale

## References

- Resend: https://resend.com
- Related: ADR-0003 (BullMQ pattern)
