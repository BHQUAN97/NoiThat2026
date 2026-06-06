import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ulid } from 'ulid'
import { PricingTable } from './entities/pricing-table.entity'

@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(PricingTable)
    private readonly repo: Repository<PricingTable>,
  ) {}

  findAll(activeOnly = true) {
    const qb = this.repo.createQueryBuilder('p').orderBy('p.sort_order', 'ASC')
    if (activeOnly) qb.where('p.is_active = true')
    return qb.getMany()
  }

  async findOne(id: string) {
    const item = await this.repo.findOne({ where: { id } })
    if (!item) throw new NotFoundException('Pricing table not found')
    return item
  }

  async create(data: Partial<PricingTable>) {
    const item = this.repo.create({ id: ulid(), ...data })
    return this.repo.save(item)
  }

  async update(id: string, data: Partial<PricingTable>) {
    await this.findOne(id)
    await this.repo.update(id, data)
    return this.findOne(id)
  }

  async remove(id: string) {
    await this.findOne(id)
    await this.repo.delete(id)
  }
}
