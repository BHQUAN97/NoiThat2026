import { Controller, Get, Post, Query, Body, Req, HttpCode, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { AnalyticsService } from './analytics.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { AdminOnly } from '../../common/decorators/admin-only.decorator'
import { Public } from '../../common/decorators/public.decorator'
import { ok } from '../../common/helpers/response.helper'

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // Public — frontend beacon gọi khi load trang, không cần auth
  @Post('track')
  @Public()
  @HttpCode(204)
  async track(
    @Body() body: { path?: string; referrer?: string },
    @Req() req: Request,
  ): Promise<void> {
    const ip = ((req.headers['x-forwarded-for'] as string) || '').split(',')[0]?.trim()
      || req.ip
      || req.socket?.remoteAddress
      || ''
    const userAgent = (req.headers['user-agent'] as string) || ''

    await this.analyticsService.trackPageView({
      path: body.path || '/',
      referrer: body.referrer,
      ip,
      userAgent,
    }).catch(() => {})
  }

  // Admin only — dashboard
  @Get('dashboard')
  @AdminOnly()
  async getDashboard(
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    const data = await this.analyticsService.getDashboard(start || '', end || '')
    return ok(data)
  }
}
