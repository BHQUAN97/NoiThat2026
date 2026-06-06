'use client'

import { useAuth } from '@/contexts/auth.context'
import { NotificationsProvider } from '@/contexts/notifications.context'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { AdminHeader } from './AdminHeader'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth()

  return (
    <NotificationsProvider isAdmin={isAdmin}>
      <div className="min-h-screen bg-surface-container-low">
        <AdminSidebar />
        <div className="min-h-screen md:ml-[var(--sidebar-width)]">
          <AdminHeader />
          <div className="mx-auto max-w-7xl px-4 pb-8 md:px-6">{children}</div>
        </div>
      </div>
    </NotificationsProvider>
  )
}
