import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SiteConfig } from './entities/site-config.entity'
import { SettingsService } from './settings.service'
import { SettingsController } from './settings.controller'

@Module({
  imports: [TypeOrmModule.forFeature([SiteConfig])],
  providers: [SettingsService],
  controllers: [SettingsController],
  exports: [SettingsService],
})
export class SettingsModule {}
