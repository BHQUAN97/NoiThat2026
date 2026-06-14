import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { AdminOnly } from '../../common/decorators/admin-only.decorator'
import { ok } from '../../common/helpers/response.helper'

@Controller('analytics')
@UseGuards(JwtAuthGuard)
@AdminOnly()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboard(
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    const data = await this.analyticsService.getDashboard(
      start || '',
      end || '',
    )
    return ok(data)
  }
}
