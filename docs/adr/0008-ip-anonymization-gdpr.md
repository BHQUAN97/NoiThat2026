# ADR-0008: IP anonymization cho access logs (GDPR-aligned)

- **Status**: accepted
- **Date**: 2026-04-08
- **Tags**: security, compliance

## Context

Access log ghi moi request → co IP user. IP la **personal data** theo GDPR → neu luu nguyen bi rui ro compliance.

Nhung analytics can biet country/region → khong the khong log gi.

## Decision

**Anonymize IP truoc khi luu**:
- **IPv4**: last octet → 0
  - `192.168.1.123` → `192.168.1.0`
- **IPv6**: last 80 bits → 0
  - `2001:db8:85a3::8a2e:370:7334` → `2001:db8:85a3::`

Logging layer:
```typescript
function anonymizeIp(ip: string): string {
  if (ip.includes(':')) {
    // IPv6
    const parts = ip.split(':');
    return parts.slice(0, 3).join(':') + '::';
  }
  // IPv4
  const parts = ip.split('.');
  parts[3] = '0';
  return parts.join('.');
}
```

Ap dung tai `access_log` table + analytics aggregation.

### Ngoai le
- **Audit log** cho login failure: giu full IP de ban IP (ADR-0009)
  - Separate table `login_attempts` voi TTL 90 days
  - KHONG dung cho analytics

## Rationale

- GDPR-friendly (ngay ca khi khong commercial EU, best practice)
- Country/region detect van work (anonymized /24)
- Rui ro data leak giam (IP nguyen khong con)

## Consequences

### Tich cuc
- Compliance-aligned
- Audit login van giu full IP (block attacker)

### Tieu cuc
- Analytics detailed hon /24 khong lay duoc (chap nhan)

## References

- Related: ADR-0009 (login rate limit voi full IP)
