'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

export interface FormNotification {
  id: string
  form_type: 'quote' | 'contact'
  name: string
  phone: string
  created_at: string
}

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4002'

export function useNotifications(enabled: boolean) {
  const [notifications, setNotifications] = useState<FormNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const socketRef = useRef<Socket | null>(null)

  const clearUnread = useCallback(() => setUnreadCount(0), [])

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const token = localStorage.getItem('access_token')
    if (!token) return

    const socket = io(`${SOCKET_URL}/notifications`, {
      auth: { token },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    })

    socketRef.current = socket

    socket.on('new-form', (data: FormNotification) => {
      setNotifications(prev => [data, ...prev].slice(0, 50))
      setUnreadCount(prev => prev + 1)

      // Browser notification nếu có permission
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        const label = data.form_type === 'quote' ? 'Báo giá' : 'Liên hệ'
        new Notification(`Có ${label} mới!`, {
          body: `${data.name} — ${data.phone}`,
          icon: '/favicon.ico',
        })
      }
    })

    socket.on('connect_error', () => {
      // Silent — admin có thể không online
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [enabled])

  return { notifications, unreadCount, clearUnread }
}
