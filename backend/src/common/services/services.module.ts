import { Global, Module } from '@nestjs/common'
import { LocalStorageService } from './local-storage.service'
import { SimpleMailService } from './simple-mail.service'
import { SettingsModule } from '../../modules/settings/settings.module'

@Global()
@Module({
  imports: [SettingsModule],
  providers: [LocalStorageService, SimpleMailService],
  exports: [LocalStorageService, SimpleMailService],
})
export class ServicesModule {}
