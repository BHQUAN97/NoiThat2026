# ADR-0004: Socket.io + Redis adapter cho multi-server scaling

- **Status**: accepted
- **Date**: 2026-03-20
- **Tags**: realtime, scalability

## Context

Admin UI can real-time:
- New contact form submit → notification
- New consultation request → notification
- Media processing done → refresh gallery
- New comment → update review list

Socket.io default: in-memory → multi-server (neu scale) se khong broadcast duoc across server.

## Decision

**Socket.io + @socket.io/redis-adapter** (shared Redis CROSS-0001):

```typescript
const io = new Server(httpServer);
io.adapter(createAdapter(redisPubClient, redisSubClient));
```

### Rooms
- `admin` — tat ca admin user
- `user:{userId}` — specific user
- `media:processing` — subscribe by media ID cho upload progress

### Events
- `media:ready` — khi IMAGE_JOB done
- `contact:new` — form submit
- `consultation:new` — request consultation
- `article:updated` — CMS change (revalidate + notify)

### Security
- Handshake auth: JWT token o query
- Verify role truoc khi join admin room

## Rationale

- Socket.io feature rich (namespaces, rooms, ack)
- Redis adapter: hien tai 1 server, sau scale van hoat dong
- Shared Redis → 0 cost

## Consequences

### Tich cuc
- Scale horizontal duoc
- Real-time UX cho admin
- Combine voi BullMQ: job done → socket emit

### Tieu cuc
- Them dependency Socket.io (~90KB client bundle)
- Socket auth phuc tap hon REST

## References

- Related: ADR-0003 (IMAGE_JOB emit), CROSS-0001 (shared Redis)
