import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PricingTable } from './entities/pricing-table.entity'
import { PricingService } from './pricing.service'
import { PricingController } from './pricing.controller'

@Module({
  imports: [TypeOrmModule.forFeature([PricingTable])],
  providers: [PricingService],
  controllers: [PricingController],
  exports: [PricingService],
})
export class PricingModule {}
