import axios from 'axios'
import type { MediaUploadResponse } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith('image/')) {
    return 'Chỉ chấp nhận file hình ảnh.'
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Định dạng không hỗ trợ. Chấp nhận: JPEG, PNG, WebP, GIF.'
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return `File quá lớn (tối đa ${MAX_IMAGE_SIZE / (1024 * 1024)}MB).`
  }
  return null
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Internal upload result type — adapts BE response for UI consumers
type UploadedMedia = MediaUploadResponse & { preview_url?: string }

export async function uploadMedia(file: File): Promise<UploadedMedia> {
  const formData = new FormData()
  formData.append('file', file)

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

  const res = await axios.post(`${API_URL}/media/upload`, formData, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    withCredentials: true,
  })

  const media: UploadedMedia = res.data?.data || res.data
  return media
}

export async function uploadImageGetUrl(file: File): Promise<string> {
  const media = await uploadMedia(file)
  return media.preview_url || media.original_url
}
