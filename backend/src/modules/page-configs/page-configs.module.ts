import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PageConfig } from './entities/page-config.entity'
import { PageConfigHistory } from './entities/page-config-history.entity'
import { PageConfigsService } from './page-configs.service'
import { PageConfigsController } from './page-configs.controller'

@Module({
  imports: [TypeOrmModule.forFeature([PageConfig, PageConfigHistory])],
  controllers: [PageConfigsController],
  providers: [PageConfigsService],
  exports: [PageConfigsService],
})
export class PageConfigsModule {}
