import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common'
import { PageConfigsService } from './page-configs.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { AdminOnly } from '../../common/decorators/admin-only.decorator'
import { Public } from '../../common/decorators/public.decorator'
import { ok } from '../../common/helpers/response.helper'

@Controller('pages')
export class PageConfigsController {
  constructor(private readonly service: PageConfigsService) {}

  /** GET /pages/:slug — public endpoint cho SSR */
  @Get(':slug')
  @Public()
  async getPublished(@Param('slug') slug: string) {
    const config = await this.service.getDraft(slug)
    return ok(config.config_published || null)
  }

  /** GET /pages/:slug/draft — admin xem bản nháp */
  @Get(':slug/draft')
  @UseGuards(JwtAuthGuard)
  @AdminOnly()
  async getDraft(@Param('slug') slug: string) {
    try {
      const config = await this.service.getDraft(slug)
      return ok(config)
    } catch {
      return ok(null)
    }
  }

  /** POST /pages — tạo mới page config */
  @Post()
  @UseGuards(JwtAuthGuard)
  @AdminOnly()
  async create(@Body() body: { page_slug: string; config_draft: Record<string, unknown> }, @Req() req: any) {
    if (!body.page_slug) throw new BadRequestException('page_slug is required')
    const config = await this.service.create(body.page_slug, body.config_draft || {}, req.user.id)
    return ok(config)
  }

  /** PATCH /pages/:slug/draft — lưu bản nháp */
  @Patch(':slug/draft')
  @UseGuards(JwtAuthGuard)
  @AdminOnly()
  async saveDraft(
    @Param('slug') slug: string,
    @Body('config_draft') configDraft: Record<string, unknown>,
    @Req() req: any,
  ) {
    if (!configDraft) throw new BadRequestException('config_draft is required')
    const config = await this.service.saveDraft(slug, configDraft, req.user.id)
    return ok(config)
  }

  /** POST /pages/:slug/publish — publish bản nháp */
  @Post(':slug/publish')
  @UseGuards(JwtAuthGuard)
  @AdminOnly()
  async publish(@Param('slug') slug: string, @Req() req: any) {
    const config = await this.service.publish(slug, req.user.id)
    return ok(config)
  }

  /** GET /pages/:slug/history — lịch sử publish */
  @Get(':slug/history')
  @UseGuards(JwtAuthGuard)
  @AdminOnly()
  async getHistory(@Param('slug') slug: string) {
    const history = await this.service.getHistory(slug)
    return ok(history)
  }

  /** POST /pages/:slug/rollback/:version — rollback */
  @Post(':slug/rollback/:version')
  @UseGuards(JwtAuthGuard)
  @AdminOnly()
  async rollback(@Param('slug') slug: string, @Param('version') version: string, @Req() req: any) {
    const config = await this.service.rollback(slug, parseInt(version, 10), req.user.id)
    return ok(config)
  }
}
