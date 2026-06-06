# ADR-0009: Login rate limit: 5 fail/10min → 30 min lockout

- **Status**: accepted
- **Date**: 2026-04-08
- **Tags**: security

## Context

Login endpoint public → attacker brute force. Can rate limit. Options:
- Exponential (RemoteTerminal ADR-0008): complex, manh
- Fixed: simple

VietNet = CMS, khong nhieu admin (5 account). Fixed lockout du dung.

## Decision

**Fixed lockout**:
- 5 failed login attempts trong 10 phut tu 1 IP → block 30 phut
- Additionally: email-based 20 attempts in 60 min → block account (force reset)

### Implementation
```typescript
// LoginAttempt entity
@Entity('login_attempts')
class LoginAttempt {
  @PrimaryColumn() id: string;
  @Column() ip: string;         // full IP (khong anonymize — ADR-0008 exception)
  @Column() email: string;
  @Column() success: boolean;
  @Column() attempted_at: Date;
}

// Pre-login check
const recent = await this.loginAttemptRepo.count({
  where: {
    ip,
    success: false,
    attempted_at: MoreThan(new Date(Date.now() - 10 * 60 * 1000))
  }
});
if (recent >= 5) {
  throw new TooManyRequestsException('Ban da bi khoa 30 phut');
}
```

### Response
- 429 Too Many Requests
- Message tieng Viet

### Cleanup
- Cron weekly delete records > 90 days

## Rationale

- 5/10min cover normal typo (user nho sai password)
- 30m lockout lam cham attacker rat nhieu
- Email-based layer 2 → chong distributed IP attack

## Consequences

### Tich cuc
- Brute force = khong kha thi
- Audit trail day du

### Tieu cuc
- Legitimate user quen password, sai 5 lan = cho 30 phut
- Chua co TOTP 2FA bypass → planned next

## References

- `backend/src/modules/auth/`
- Related: ADR-0008, RemoteTerminal ADR-0008 (exponential hon manh)
