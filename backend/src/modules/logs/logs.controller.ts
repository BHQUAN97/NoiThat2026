import {
  Controller,
  Get,
  Delete,
  Body,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common'
import { LogsService } from './logs.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { AdminOnly } from '../../common/decorators/admin-only.decorator'
import { ok, paginated } from '../../common/helpers/response.helper'
import type { LogLevel } from './entities/app-log.entity'

@Controller('logs')
@UseGuards(JwtAuthGuard)
@AdminOnly()
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  async findAll(
    @Query('level') level?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
  ) {
    const result = await this.logsService.findAll({
      level: level as LogLevel | undefined,
      search,
      page: page ? parseInt(page, 10) : 1,
    })
    return paginated(result.data, result.meta)
  }

  @Get('stats')
  async getStats() {
    const stats = await this.logsService.getStats()
    return ok(stats)
  }

  @Delete('bulk')
  async bulkDelete(@Body('ids') ids: string[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('ids must be a non-empty array')
    }
    await this.logsService.bulkDelete(ids)
    return ok(null, `Deleted ${ids.length} logs`)
  }

  @Delete('all')
  async deleteAll(@Query('level') level?: string) {
    await this.logsService.deleteAll(level as LogLevel | undefined)
    return ok(null, 'Logs deleted')
  }
}
