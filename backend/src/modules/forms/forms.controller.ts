import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { FormsService } from './forms.service'
import { CreateQuoteFormDto, CreateContactFormDto } from './dto/create-form.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { Public } from '../../common/decorators/public.decorator'
import { Roles } from '../../common/decorators/roles.decorator'
import { UserRole } from '../users/entities/user.entity'

// Rate limit form submission: max 5 requests/phút/IP — chống spam
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Public()
  @Post('quote')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  createQuote(@Body() dto: CreateQuoteFormDto) {
    return this.formsService.createQuoteForm(dto)
  }

  @Public()
  @Post('contact')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  createContact(@Body() dto: CreateContactFormDto) {
    return this.formsService.createContactForm(dto)
  }

  @Get('admin/submissions')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('status') status?: string,
  ) {
    return this.formsService.findAll(Number(page), Number(limit), status)
  }

  @Patch('admin/submissions/:id/status')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'new' | 'processing' | 'done',
  ) {
    return this.formsService.updateStatus(id, status)
  }
}
