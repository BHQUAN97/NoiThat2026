'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, Package, Building2, Clock } from 'lucide-react'
import api from '@/lib/api'
import type { ApiResponse, FormSubmission, PaginationMeta } from '@/types'

interface DashboardStats {
  totalForms: number
  newForms: number
  totalProducts: number
  totalProjects: number
}

interface FormsResponse {
  success: boolean
  data: FormSubmission[]
  meta?: PaginationMeta
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  href,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
  sub?: string
  href: string
  color: string
}) {
  return (
    <Link href={href}>
      <div className="rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-stone-500">{label}</p>
            <p className="text-2xl font-bold text-stone-800">{value}</p>
            {sub && <p className="text-xs text-stone-400">{sub}</p>}
          </div>
        </div>
      </div>
    </Link>
  )
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Mới',
  processing: 'Đang xử lý',
  done: 'Đã xong',
}

const STATUS_CLASSES: Record<string, string> = {
  new: 'bg-red-100 text-red-700',
  processing: 'bg-yellow-100 text-yellow-700',
  done: 'bg-green-100 text-green-700',
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({ totalForms: 0, newForms: 0, totalProducts: 0, totalProjects: 0 })
  const [recentForms, setRecentForms] = useState<FormSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [formsRes, allFormsRes, productsRes, projectsRes] = await Promise.all([
          api.get('/forms/admin/submissions?page=1&limit=5') as Promise<ApiResponse<FormSubmission[]>>,
          api.get('/forms/admin/submissions?page=1&limit=1&status=new') as Promise<ApiResponse<FormSubmission[]>>,
          api.get('/products?active=false') as Promise<ApiResponse<unknown[]>>,
          api.get('/projects') as Promise<ApiResponse<unknown[]>>,
        ])

        const forms = formsRes as unknown as FormsResponse
        const newFormsRes = allFormsRes as unknown as FormsResponse
        const products = productsRes as unknown as { data: unknown[]; meta?: PaginationMeta }
        const projects = projectsRes as unknown as { data: unknown[]; meta?: PaginationMeta }

        setRecentForms((forms.data as FormSubmission[]) || [])
        setStats({
          totalForms: forms.meta?.total || 0,
          newForms: newFormsRes.meta?.total || 0,
          totalProducts: products.meta?.total || (Array.isArray(products.data) ? products.data.length : 0),
          totalProjects: projects.meta?.total || (Array.isArray(projects.data) ? projects.data.length : 0),
        })
      } catch {
        // Ignore errors — hiển thị zero values
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-stone-800">Dashboard</h1>

      {/* Stats cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={FileText}
          label="Tổng form yêu cầu"
          value={stats.totalForms}
          href="/admin/forms"
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          icon={Clock}
          label="Form chưa xử lý"
          value={stats.newForms}
          sub="Cần xử lý ngay"
          href="/admin/forms?status=new"
          color="bg-red-100 text-red-600"
        />
        <StatCard
          icon={Package}
          label="Tổng sản phẩm"
          value={stats.totalProducts}
          href="/admin/products"
          color="bg-amber-100 text-amber-600"
        />
        <StatCard
          icon={Building2}
          label="Tổng dự án"
          value={stats.totalProjects}
          href="/admin/projects"
          color="bg-green-100 text-green-600"
        />
      </div>

      {/* Recent forms */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-800">Form yêu cầu mới nhất</h2>
          <Link href="/admin/forms" className="text-sm text-amber-600 hover:underline">
            Xem tất cả →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-stone-100" />
            ))}
          </div>
        ) : recentForms.length === 0 ? (
          <p className="py-8 text-center text-sm text-stone-400">Chưa có form nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-left text-xs uppercase text-stone-400">
                  <th className="pb-2 pr-4">Tên</th>
                  <th className="pb-2 pr-4">SĐT</th>
                  <th className="pb-2 pr-4">Loại</th>
                  <th className="pb-2 pr-4">Thời gian</th>
                  <th className="pb-2">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {recentForms.map((form) => (
                  <tr key={form.id} className="hover:bg-stone-50">
                    <td className="py-3 pr-4 font-medium text-stone-700">{form.name}</td>
                    <td className="py-3 pr-4 text-stone-600">{form.phone}</td>
                    <td className="py-3 pr-4 text-stone-500">
                      {form.form_type === 'quote' ? 'Báo giá' : 'Liên hệ'}
                    </td>
                    <td className="py-3 pr-4 text-stone-400">
                      {new Date(form.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[form.status] || ''}`}>
                        {STATUS_LABELS[form.status] || form.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
