import type { PaginationMeta } from '@/types'

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null
}

function getPayload(response: unknown): unknown {
  if (!isRecord(response) || !('data' in response)) return response
  return response.data
}

export function getListData<T>(response: unknown): T[] {
  const payload = getPayload(response)
  if (Array.isArray(payload)) return payload as T[]

  if (isRecord(payload)) {
    if (Array.isArray(payload.data)) return payload.data as T[]
    if (Array.isArray(payload.items)) return payload.items as T[]
    if (Array.isArray(payload.results)) return payload.results as T[]
  }

  return []
}

export function getResponseData<T>(response: unknown): T | null {
  const payload = getPayload(response)
  if (!isRecord(payload) || Array.isArray(payload)) return payload as T

  if ('data' in payload && isRecord(payload.data)) return payload.data as T
  return payload as T
}

export function getPaginationMeta(response: unknown, fallback?: { page?: number; limit?: number }): PaginationMeta | null {
  const root = isRecord(response) ? response : {}
  const payload = getPayload(response)

  if (isRecord(root) && isRecord(root.meta)) return root.meta as unknown as PaginationMeta
  if (isRecord(payload) && isRecord(payload.meta)) return payload.meta as unknown as PaginationMeta

  const total = isRecord(payload) && typeof payload.total === 'number'
    ? payload.total
    : isRecord(root) && typeof root.total === 'number'
      ? root.total
      : null

  if (total === null) return null

  const page = fallback?.page ?? 1
  const limit = fallback?.limit ?? Math.max(total, 1)

  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  }
}
