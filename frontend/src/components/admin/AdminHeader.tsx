'use client'

import Link from 'next/link'
import { Bell, FileText } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useNotificationsContext } from '@/contexts/notifications.context'
import { SITE_NAME } from '@/lib/constants'
import type { FormNotification } from '@/hooks/use-notifications'

export function AdminHeader() {
  const { notifications, unreadCount, clearUnread } = useNotificationsContext()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOpen = () => {
    setOpen(v => !v)
    if (!open && unreadCount > 0) clearUnread()
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 pl-14 md:justify-end md:px-6 md:pl-6">
      <Link
        href="/"
        className="flex items-center gap-2 font-headline text-sm font-semibold text-amber-700 transition-opacity hover:opacity-80 md:hidden"
      >
        {SITE_NAME}
      </Link>

      <div ref={ref} className="relative">
        <button
          onClick={handleOpen}
          className="relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2.5 text-on-surface-variant transition-colors hover:bg-surface-container-high"
          aria-label="Thông báo"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <h3 className="text-sm font-semibold text-gray-900">Thông báo</h3>
              {notifications.length > 0 && (
                <Link href="/admin/forms" onClick={() => setOpen(false)} className="text-sm text-amber-700 hover:underline">
                  Xem tất cả
                </Link>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-gray-500">Chưa có thông báo</p>
              ) : (
                notifications.map(n => <NotificationItem key={n.id} item={n} onClose={() => setOpen(false)} />)
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'vừa xong'
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`
  return `${Math.floor(diff / 3600)} giờ trước`
}

function NotificationItem({ item, onClose }: { item: FormNotification; onClose: () => void }) {
  const label = item.form_type === 'quote' ? 'Báo giá' : 'Liên hệ'
  return (
    <Link
      href="/admin/forms"
      onClick={onClose}
      className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
    >
      <span className={cn(
        'mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
        item.form_type === 'quote' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
      )}>
        <FileText className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">
          Có <span className="text-amber-700">{label}</span> mới
        </p>
        <p className="truncate text-sm text-gray-500">{item.name} — {item.phone}</p>
        <p className="mt-0.5 text-xs text-gray-400">{timeAgo(item.created_at)}</p>
      </div>
    </Link>
  )
}
