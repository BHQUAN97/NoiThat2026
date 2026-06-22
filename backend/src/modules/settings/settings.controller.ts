import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common'
import { SettingsService } from './settings.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import { Public } from '../../common/decorators/public.decorator'
import { UserRole } from '../users/entities/user.entity'

const SENSITIVE_KEYS = ['resend_api_key']

@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get('public')
  @Public()
  async getPublic() {
    const all = await this.service.getAll()
    for (const key of SENSITIVE_KEYS) delete all[key]
    return all
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async getAll() {
    const all = await this.service.getAll()
    if (all.resend_api_key) {
      const key = all.resend_api_key
      all.resend_api_key = key.length > 8 ? key.slice(0, 8) + '••••••••' : '••••••••'
    }
    return all
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  setMany(@Body() body: Array<{ key: string; value: string; type?: string }>) {
    const filtered = body.filter(
      (e) => !(e.key === 'resend_api_key' && e.value.includes('••••')),
    )
    return this.service.setMany(filtered)
  }
}
