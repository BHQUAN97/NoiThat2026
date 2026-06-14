import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

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

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getDashboard(start: string, end: string): Promise<AnalyticsDashboard> {
    const startDate = start || this.daysAgo(30)
    const endDate = end || this.today()

    // Kiểm tra page_view_daily tồn tại và có dữ liệu không
    const hasData = await this.hasPageViewData()

    if (!hasData) {
      // Trả về empty/zero state — user sẽ thấy khi traffic middleware chưa hoạt động
      const days = this.dateRange(startDate, endDate)
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
        'SELECT COUNT(*) AS cnt FROM `page_view_daily` LIMIT 1',
      )
      return parseInt(row?.cnt ?? '0', 10) > 0
    } catch {
      return false
    }
  }

  private async getTotals(start: string, end: string) {
    const [row] = await this.dataSource.query(
      `SELECT
        COALESCE(SUM(total_views), 0) AS totalViews,
        COALESCE(SUM(unique_visitors), 0) AS totalUnique
       FROM page_view_daily
       WHERE view_date BETWEEN ? AND ?`,
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
        COALESCE(SUM(mobile_views), 0) AS mobile,
        COALESCE(SUM(desktop_views), 0) AS desktop,
        COALESCE(SUM(tablet_views), 0) AS tablet
       FROM page_view_daily
       WHERE view_date BETWEEN ? AND ?`,
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
        DATE_FORMAT(view_date, '%Y-%m-%d') AS date,
        COALESCE(SUM(total_views), 0) AS views,
        COALESCE(SUM(unique_visitors), 0) AS \`unique\`
       FROM page_view_daily
       WHERE view_date BETWEEN ? AND ?
       GROUP BY view_date
       ORDER BY view_date ASC`,
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
        COALESCE(SUM(total_views), 0) AS views,
        COALESCE(SUM(unique_visitors), 0) AS \`unique\`
       FROM page_view_daily
       WHERE view_date BETWEEN ? AND ?
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
