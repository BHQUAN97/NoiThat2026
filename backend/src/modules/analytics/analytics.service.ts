import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { generateUlid } from '../../common/helpers/ulid.helper'

export interface DailyTrendItem {
  date: string
  views: number
  unique: number
}

export interface TopPageItem {
  path: string
  views: number
  unique: number
}

export interface AnalyticsDashboard {
  totalViews: number
  totalUnique: number
  deviceBreakdown: { mobile: number; desktop: number; tablet: number }
  dailyTrend: DailyTrendItem[]
  topPages: TopPageItem[]
}

export interface TrackPayload {
  path: string
  referrer?: string
  ip: string
  userAgent: string
}

function detectDevice(ua: string): 'mobile' | 'tablet' | 'desktop' {
  if (/tablet|ipad/i.test(ua)) return 'tablet'
  if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) return 'mobile'
  return 'desktop'
}

function isBot(ua: string): boolean {
  return /bot|crawler|spider|scraper|pingdom|uptimerobot|googlebot|bingbot|yahoo|baidu|yandex|facebookexternalhit|slurp|duckduck/i.test(ua)
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  // Ghi page view từ beacon của frontend
  async trackPageView(payload: TrackPayload): Promise<void> {
    const { path, referrer, ip, userAgent } = payload

    // Bỏ qua bot và các path không phải trang
    if (
      isBot(userAgent) ||
      path.startsWith('/api/') ||
      path.startsWith('/_next/') ||
      path.startsWith('/admin') ||
      path.includes('.') // static files
    ) {
      return
    }

    const device = detectDevice(userAgent)
    const bot = 0

    // Ghi vào page_views (raw events) — fire & forget caller handles error
    await this.dataSource.query(
      `INSERT INTO page_views (page_path, visitor_ip, user_agent, referrer, device_type, is_bot)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        path.slice(0, 500),
        ip?.slice(0, 45) || '0.0.0.0',
        userAgent?.slice(0, 500) || '',
        referrer?.slice(0, 500) || null,
        device,
        bot,
      ],
    )
  }

  async getDashboard(start: string, end: string): Promise<AnalyticsDashboard> {
    const startDate = start || this.daysAgo(30)
    // Kết thúc ở cuối ngày end để bao gồm toàn bộ ngày hôm nay
    const endDate = (end || this.today()) + ' 23:59:59'

    const hasData = await this.hasPageViewData()

    if (!hasData) {
      const days = this.dateRange(startDate, end || this.today())
      return {
        totalViews: 0,
        totalUnique: 0,
        deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 },
        dailyTrend: days.map((d) => ({ date: d, views: 0, unique: 0 })),
        topPages: [],
      }
    }

    const [totals, devices, trend, top] = await Promise.all([
      this.getTotals(startDate, endDate),
      this.getDeviceBreakdown(startDate, endDate),
      this.getDailyTrend(startDate, endDate),
      this.getTopPages(startDate, endDate),
    ])

    return {
      totalViews: totals.totalViews,
      totalUnique: totals.totalUnique,
      deviceBreakdown: devices,
      dailyTrend: trend,
      topPages: top,
    }
  }

  private async hasPageViewData(): Promise<boolean> {
    try {
      const [row] = await this.dataSource.query(
        'SELECT COUNT(*) AS cnt FROM `page_views` WHERE is_bot = 0 LIMIT 1',
      )
      return parseInt(row?.cnt ?? '0', 10) > 0
    } catch {
      return false
    }
  }

  private async getTotals(start: string, end: string) {
    const [row] = await this.dataSource.query(
      `SELECT
        COUNT(*) AS totalViews,
        COUNT(DISTINCT visitor_ip) AS totalUnique
       FROM page_views
       WHERE viewed_at BETWEEN ? AND ? AND is_bot = 0`,
      [start, end],
    )
    return {
      totalViews: parseInt(row?.totalViews ?? '0', 10),
      totalUnique: parseInt(row?.totalUnique ?? '0', 10),
    }
  }

  private async getDeviceBreakdown(start: string, end: string) {
    const [row] = await this.dataSource.query(
      `SELECT
        SUM(CASE WHEN device_type = 'mobile' THEN 1 ELSE 0 END) AS mobile,
        SUM(CASE WHEN device_type = 'desktop' THEN 1 ELSE 0 END) AS desktop,
        SUM(CASE WHEN device_type = 'tablet' THEN 1 ELSE 0 END) AS tablet
       FROM page_views
       WHERE viewed_at BETWEEN ? AND ? AND is_bot = 0`,
      [start, end],
    )
    return {
      mobile: parseInt(row?.mobile ?? '0', 10),
      desktop: parseInt(row?.desktop ?? '0', 10),
      tablet: parseInt(row?.tablet ?? '0', 10),
    }
  }

  private async getDailyTrend(start: string, end: string): Promise<DailyTrendItem[]> {
    const rows = await this.dataSource.query(
      `SELECT
        DATE_FORMAT(viewed_at, '%Y-%m-%d') AS date,
        COUNT(*) AS views,
        COUNT(DISTINCT visitor_ip) AS \`unique\`
       FROM page_views
       WHERE viewed_at BETWEEN ? AND ? AND is_bot = 0
       GROUP BY DATE(viewed_at)
       ORDER BY date ASC`,
      [start, end],
    )
    return rows.map((r: any) => ({
      date: r.date,
      views: parseInt(r.views, 10),
      unique: parseInt(r.unique, 10),
    }))
  }

  private async getTopPages(start: string, end: string): Promise<TopPageItem[]> {
    const rows = await this.dataSource.query(
      `SELECT
        page_path AS path,
        COUNT(*) AS views,
        COUNT(DISTINCT visitor_ip) AS \`unique\`
       FROM page_views
       WHERE viewed_at BETWEEN ? AND ? AND is_bot = 0
       GROUP BY page_path
       ORDER BY views DESC
       LIMIT 20`,
      [start, end],
    )
    return rows.map((r: any) => ({
      path: r.path,
      views: parseInt(r.views, 10),
      unique: parseInt(r.unique, 10),
    }))
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10)
  }

  private daysAgo(n: number): string {
    const d = new Date()
    d.setDate(d.getDate() - n)
    return d.toISOString().slice(0, 10)
  }

  private dateRange(start: string, end: string): string[] {
    const dates: string[] = []
    const current = new Date(start)
    const endDate = new Date(end)
    while (current <= endDate) {
      dates.push(current.toISOString().slice(0, 10))
      current.setDate(current.getDate() + 1)
    }
    return dates
  }
}
