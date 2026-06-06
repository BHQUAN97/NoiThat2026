'use client'

import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/contexts/auth.context'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { AdminShell } from '@/components/admin/AdminShell'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/admin/login') {
    return (
      <AuthProvider>
        {children}
      </AuthProvider>
    )
  }

  return (
    <AuthProvider>
      <AuthGuard requireAdmin>
        <AdminShell>{children}</AdminShell>
      </AuthGuard>
    </AuthProvider>
  )
}
