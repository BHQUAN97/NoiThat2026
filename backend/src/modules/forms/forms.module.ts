import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FormSubmission } from './entities/form-submission.entity'
import { FormsService } from './forms.service'
import { FormsController } from './forms.controller'
import { NotificationsModule } from '../notifications/notifications.module'

@Module({
  imports: [TypeOrmModule.forFeature([FormSubmission]), NotificationsModule],
  providers: [FormsService],
  controllers: [FormsController],
  exports: [FormsService],
})
export class FormsModule {}
