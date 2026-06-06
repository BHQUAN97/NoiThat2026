# ADR-0003: BullMQ IMAGE_JOB pipeline (Sharp + R2, EXIF strip)

- **Status**: accepted
- **Date**: 2026-03-20
- **Tags**: async, storage

## Context

Portfolio interior design = **nhieu anh lon** (photographer upload RAW/JPEG 5-20MB). Neu process synchronous khi upload → HTTP timeout, server busy.

EXIF metadata co the chua GPS/camera info nhay cam → phai strip.

## Decision

**IMAGE_JOB BullMQ queue** voi pipeline:

### Flow
1. User upload → Multer → **R2 private bucket** (original)
2. Create Media entity `processing_status: PENDING`
3. Queue job `IMAGE_JOB { mediaId }`
4. Worker concurrency **3**:
   - Download original tu R2 private
   - Sharp `.metadata()` — extract dimensions
   - Sharp `.rotate()` (auto-orientation) + **`.withMetadata({ exif: {} })`** (strip EXIF)
   - Re-upload clean original len R2 private
   - Generate **thumbnail 300x300 WebP q80** → R2 public
   - Generate **preview 1200px max WebP q85** → R2 public
   - Update Media entity: `thumbnail_url`, `preview_url`, `width`, `height`, `status: COMPLETED`
5. Socket.io emit `media:ready` → admin UI update

### Idempotency
- Check `processing_status !== PROCESSING` truoc → tranh duplicate khi job retry
- Retry 3 lan, exponential backoff

### Fallback
- Fail → `status: FAILED`, log, admin UI hien "Reprocess" button

## Rationale

- Async = HTTP response <500ms
- EXIF strip = privacy (agency lay anh tu photographer khach)
- 3 worker = balance speed vs memory (Sharp nga memory)
- Retry → network tam thoi loi khong mat data

## Consequences

### Tich cuc
- Admin upload 50 anh 1 luc khong crash
- Gallery load nhanh (WebP + CDN)
- Privacy compliant

### Tieu cuc
- Complexity: 2 bucket (private + public), Media entity status machine
- Queue lag khi load cao → user thay "processing" vai giay

## References

- `backend/src/modules/media/`
- Related: ADR-0004 (Socket emit), WebPhoto ADR cua image pipeline
