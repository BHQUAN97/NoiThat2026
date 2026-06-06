import { Global, Module } from '@nestjs/common'
import { R2StorageService } from './r2-storage.service'
import { SimpleMailService } from './simple-mail.service'

@Global()
@Module({
  providers: [R2StorageService, SimpleMailService],
  exports: [R2StorageService, SimpleMailService],
})
export class ServicesModule {}
