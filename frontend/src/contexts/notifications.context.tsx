'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useNotifications, type FormNotification } from '@/hooks/use-notifications'

interface NotificationsContextType {
  notifications: FormNotification[]
  unreadCount: number
  clearUnread: () => void
}

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  unreadCount: 0,
  clearUnread: () => {},
})

export function NotificationsProvider({ children, isAdmin }: { children: ReactNode; isAdmin: boolean }) {
  const value = useNotifications(isAdmin)
  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotificationsContext = () => useContext(NotificationsContext)
