'use client'

import { useState, useEffect, useCallback } from 'react'
import { Eye, Users, Smartphone, Monitor, Tablet, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingSpinner, ErrorDisplay } from '@/components/shared/DataStates'
import { formatNumber } from '@/lib/number'
import { getErrorMessage } from '@/lib/error'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import type { AnalyticsDashboard } from '@/types'

type DateRange = '7d' | '30d' | '90d'

function getDateRange(range: DateRange): { start: string; end: string } {
  const end = new Date()
  const start = new Date()
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
  start.setDate(end.getDate() - days)
  const fmt = (d: Date) => d.toISOString().slice(0, 10)
  return { start: fmt(start), end: fmt(end) }
}

const STAT_COLORS = [
  { bg: 'bg-gradient-to-br from-blue-500 to-indigo-600', icon: 'bg-white/20 text-white', text: 'text-white', sub: 'text-white/70' },
  { bg: 'bg-gradient-to-br from-emerald-500 to-teal-600', icon: 'bg-white/20 text-white', text: 'text-white', sub: 'text-white/70' },
  { bg: 'bg-gradient-to-br from-violet-500 to-purple-600', icon: 'bg-white/20 text-white', text: 'text-white', sub: 'text-white/70' },
  { bg: 'bg-gradient-to-br from-orange-500 to-rose-500', icon: 'bg-white/20 text-white', text: 'text-white', sub: 'text-white/70' },
]

const DEVICE_COLORS = [
  { bar: 'from-blue-500 to-indigo-500', text: 'text-blue-600', bg: 'bg-blue-50' },
  { bar: 'from-violet-500 to-purple-500', text: 'text-violet-600', bg: 'bg-violet-50' },
  { bar: 'from-amber-400 to-orange-500', text: 'text-orange-600', bg: 'bg-orange-50' },
]

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [range, setRange] = useState<DateRange>('30d')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { start, end } = getDateRange(range)
      const res = await api.get(`/analytics/dashboard?start=${start}&end=${end}`)
      setData((res as any).data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [range])

  useEffect(() => { fetchData() }, [fetchData])

  if (loading && !data) {
    return (
      <div className="py-4">
        <PageHeader title="Phân tích" showDecoLine={false} />
        <LoadingSpinner minHeight="min-h-[30vh]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-4">
        <PageHeader title="Phân tích" showDecoLine={false} />
        <ErrorDisplay message={error} onRetry={fetchData} minHeight="min-h-[30vh]" />
      </div>
    )
  }

  const totalDevice =
    (data?.deviceBreakdown?.mobile || 0) +
    (data?.deviceBreakdown?.desktop || 0) +
    (data?.deviceBreakdown?.tablet || 0)

  const stats = [
    { icon: Eye, label: 'Tổng lượt xem', value: data?.totalViews || 0 },
    { icon: Users, label: 'Khách truy cập', value: data?.totalUnique || 0 },
    {
      icon: Smartphone, label: 'Mobile', value: data?.deviceBreakdown?.mobile || 0,
      suffix: totalDevice > 0 ? `${Math.round(((data?.deviceBreakdown?.mobile || 0) / totalDevice) * 100)}%` : '0%',
    },
    {
      icon: Monitor, label: 'Desktop', value: data?.deviceBreakdown?.desktop || 0,
      suffix: totalDevice > 0 ? `${Math.round(((data?.deviceBreakdown?.desktop || 0) / totalDevice) * 100)}%` : '0%',
    },
  ]

  return (
    <div className="py-4">
      <PageHeader title="Phân tích" description="Thống kê lượt xem và hành vi người dùng" showDecoLine={false}>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-surface-container p-1">
            {(['7d', '30d', '90d'] as DateRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  'rounded-lg px-3 py-1.5 min-h-[44px] text-label-md transition-colors',
                  range === r ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container-high',
                )}
              >
                {r === '7d' ? '7 ngày' : r === '30d' ? '30 ngày' : '90 ngày'}
              </button>
            ))}
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center justify-center rounded-xl p-2.5 min-h-[44px] min-w-[44px] text-on-surface-variant hover:bg-surface-container-high disabled:opacity-50"
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </button>
        </div>
      </PageHeader>

      {/* Stat Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => {
          const c = STAT_COLORS[i]
          return (
            <div key={s.label} className={cn('rounded-2xl p-5 shadow-lg', c.bg)}>
              <div className="flex items-center justify-between">
                <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', c.icon)}>
                  <s.icon className="h-5 w-5" />
                </span>
                {s.suffix && <span className={cn('text-label-sm font-bold', c.sub)}>{s.suffix}</span>}
              </div>
              <p className={cn('mt-3 font-body text-headline-md font-bold', c.text)}>{formatNumber(s.value)}</p>
              <p className={cn('mt-1 text-body-sm', c.sub)}>{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Trend Chart */}
      <div className="mt-6 rounded-2xl bg-surface-container-low p-6">
        <h2 className="font-headline text-title-md text-on-surface">Xu hướng lượt xem</h2>
        <div className="mt-4">
          {data?.dailyTrend && data.dailyTrend.length > 0 && data.dailyTrend.some((d) => d.views > 0) ? (
            <TrendChart data={data.dailyTrend} />
          ) : (
            <div className="flex h-48 items-center justify-center text-body-md text-on-surface-variant">
              Chưa có dữ liệu traffic trong khoảng thời gian này
            </div>
          )}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Top Pages */}
        <div className="rounded-2xl bg-surface-container-low p-6 lg:col-span-2">
          <h2 className="font-headline text-title-md text-on-surface">Trang được xem nhiều nhất</h2>
          <div className="mt-4 overflow-x-auto">
            {data?.topPages && data.topPages.length > 0 ? (
              <div className="space-y-2">
                {data.topPages.map((p, i) => {
                  const maxView = Math.max(...data.topPages.map(pp => pp.views), 1)
                  const pct = (p.views / maxView) * 100
                  const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-orange-500', 'bg-rose-500', 'bg-cyan-500', 'bg-amber-500', 'bg-indigo-500', 'bg-teal-500', 'bg-pink-500']
                  return (
                    <div key={p.path} className="group rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-container">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white', colors[i % colors.length])}>
                            {i + 1}
                          </span>
                          <span className="truncate text-body-sm text-on-surface">{p.path}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-2">
                          <span className="text-body-sm font-medium text-on-surface">{formatNumber(p.views)}</span>
                          <span className="text-body-sm text-on-surface-variant">{formatNumber(p.unique)} khách</span>
                        </div>
                      </div>
                      <div className="ml-8 h-1.5 overflow-hidden rounded-full bg-surface-container">
                        <div
                          className={cn('h-full rounded-full transition-all duration-700', colors[i % colors.length])}
                          style={{ width: `${pct}%`, opacity: 0.7 }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="py-8 text-center text-body-sm text-on-surface-variant">Chưa có dữ liệu</p>
            )}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="rounded-2xl bg-surface-container-low p-6">
          <h2 className="font-headline text-title-md text-on-surface">Thiết bị</h2>

          {/* Donut-style visual */}
          <div className="mt-6 flex justify-center">
            <div className="relative h-32 w-32">
              <DeviceDonut
                mobile={data?.deviceBreakdown?.mobile || 0}
                desktop={data?.deviceBreakdown?.desktop || 0}
                tablet={data?.deviceBreakdown?.tablet || 0}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-headline-sm font-bold text-on-surface">{formatNumber(totalDevice)}</span>
                <span className="text-[10px] text-on-surface-variant">tổng</span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {[
              { icon: Monitor, label: 'Desktop', value: data?.deviceBreakdown?.desktop || 0, ci: 0 },
              { icon: Smartphone, label: 'Mobile', value: data?.deviceBreakdown?.mobile || 0, ci: 1 },
              { icon: Tablet, label: 'Tablet', value: data?.deviceBreakdown?.tablet || 0, ci: 2 },
            ].map(({ icon: Icon, label, value, ci }) => {
              const pct = totalDevice > 0 ? Math.round((value / totalDevice) * 100) : 0
              const c = DEVICE_COLORS[ci]
              return (
                <div key={label}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn('flex h-7 w-7 items-center justify-center rounded-lg', c.bg)}>
                        <Icon className={cn('h-3.5 w-3.5', c.text)} />
                      </span>
                      <span className="text-body-sm text-on-surface">{label}</span>
                    </div>
                    <span className="text-label-sm font-medium text-on-surface">{formatNumber(value)} <span className="text-on-surface-variant">({pct}%)</span></span>
                  </div>
                  <div className="mt-1.5 ml-9 h-2 overflow-hidden rounded-full bg-surface-container">
                    <div className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700', c.bar)} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function DeviceDonut({ mobile, desktop, tablet }: { mobile: number; desktop: number; tablet: number }) {
  const total = mobile + desktop + tablet
  if (total === 0) {
    return (
      <svg viewBox="0 0 36 36" className="h-full w-full">
        <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-surface-container" />
      </svg>
    )
  }

  const desktopPct = desktop / total
  const mobilePct = mobile / total
  const tabletPct = tablet / total
  const circumference = 2 * Math.PI * 15.5

  const desktopDash = desktopPct * circumference
  const mobileDash = mobilePct * circumference
  const tabletDash = tabletPct * circumference

  let offset = circumference * 0.25

  return (
    <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
      <circle
        cx="18" cy="18" r="15.5" fill="none"
        stroke="url(#grad-desktop)" strokeWidth="3.5"
        strokeDasharray={`${desktopDash} ${circumference - desktopDash}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      <circle
        cx="18" cy="18" r="15.5" fill="none"
        stroke="url(#grad-mobile)" strokeWidth="3.5"
        strokeDasharray={`${mobileDash} ${circumference - mobileDash}`}
        strokeDashoffset={offset - desktopDash}
        strokeLinecap="round"
      />
      <circle
        cx="18" cy="18" r="15.5" fill="none"
        stroke="url(#grad-tablet)" strokeWidth="3.5"
        strokeDasharray={`${tabletDash} ${circumference - tabletDash}`}
        strokeDashoffset={offset - desktopDash - mobileDash}
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="grad-desktop" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="grad-mobile" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="grad-tablet" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function TrendChart({ data }: { data: Array<{ date: string; views: number; unique: number }> }) {
  const maxViews = Math.max(...data.map((d) => d.views), 1)
  const chartHeight = 220
  const needsScroll = data.length > 15

  const totalViews = data.reduce((s, d) => s + d.views, 0)
  const prevHalf = data.slice(0, Math.floor(data.length / 2))
  const curHalf = data.slice(Math.floor(data.length / 2))
  const prevSum = prevHalf.reduce((s, d) => s + d.views, 0)
  const curSum = curHalf.reduce((s, d) => s + d.views, 0)
  const trendUp = curSum >= prevSum

  return (
    <div className="relative">
      {/* Trend indicator */}
      <div className="mb-4 flex items-center gap-2">
        <span className={cn(
          'flex items-center gap-1 rounded-full px-2.5 py-1 text-label-sm font-medium',
          trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600',
        )}>
          {trendUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {prevSum > 0 ? `${Math.abs(Math.round(((curSum - prevSum) / prevSum) * 100))}%` : '—'}
        </span>
        <span className="text-body-sm text-on-surface-variant">
          so với nửa đầu kỳ ({formatNumber(totalViews)} tổng lượt xem)
        </span>
      </div>

      {/* Y-axis labels */}
      <div className="absolute left-0 top-10 flex h-[220px] flex-col justify-between text-label-sm text-on-surface-variant/50">
        <span>{formatNumber(maxViews)}</span>
        <span>{formatNumber(Math.round(maxViews * 0.75))}</span>
        <span>{formatNumber(Math.round(maxViews / 2))}</span>
        <span>{formatNumber(Math.round(maxViews * 0.25))}</span>
        <span>0</span>
      </div>

      {/* Grid lines */}
      <div className="absolute left-12 right-0 top-10 flex h-[220px] flex-col justify-between">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="h-px w-full bg-on-surface/5" />
        ))}
      </div>

      {/* Bars */}
      <div className={needsScroll ? 'ml-12 overflow-x-auto' : 'ml-12'}>
        <div className="flex items-end gap-[3px]" style={{ height: chartHeight, minWidth: needsScroll ? `${data.length * 14}px` : undefined }}>
          {data.map((d, i) => {
            const viewHeight = (d.views / maxViews) * chartHeight
            const uniqueHeight = (d.unique / maxViews) * chartHeight
            const isWeekend = new Date(d.date).getDay() === 0 || new Date(d.date).getDay() === 6
            return (
              <div key={i} className="group relative flex flex-1 flex-col items-center" style={{ minWidth: '10px' }}>
                {/* Tooltip */}
                <div className="pointer-events-none absolute -top-20 z-10 hidden min-w-[120px] rounded-xl bg-gray-900 px-3 py-2.5 text-label-sm text-white shadow-xl group-hover:block">
                  <p className="font-medium">{d.date}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                    <span>Xem: {formatNumber(d.views)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>Khách: {formatNumber(d.unique)}</span>
                  </div>
                </div>

                {/* Stacked bars */}
                <div className="relative w-full flex flex-col items-center">
                  {/* Views bar */}
                  <div
                    className={cn(
                      'w-full rounded-t-sm transition-all duration-300 group-hover:opacity-100',
                      isWeekend ? 'opacity-60' : 'opacity-80',
                    )}
                    style={{
                      height: `${viewHeight}px`,
                      background: `linear-gradient(to top, #3b82f6, #818cf8)`,
                    }}
                  />
                  {/* Unique overlay */}
                  <div
                    className="absolute bottom-0 w-full rounded-t-sm"
                    style={{
                      height: `${uniqueHeight}px`,
                      background: `linear-gradient(to top, #10b981, #34d399)`,
                      opacity: 0.5,
                    }}
                  />
                </div>

                {/* X-axis labels */}
                {(i % Math.max(1, Math.floor(data.length / 8)) === 0 || i === data.length - 1) && (
                  <span className="mt-2 whitespace-nowrap text-[10px] text-on-surface-variant/50">{d.date.slice(5)}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 ml-12 flex items-center gap-4 text-[11px] text-on-surface-variant">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-t from-blue-500 to-indigo-400" /> Lượt xem</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-t from-emerald-500 to-emerald-300" /> Khách</span>
      </div>
    </div>
  )
}
