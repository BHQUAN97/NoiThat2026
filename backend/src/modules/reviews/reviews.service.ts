import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ulid } from 'ulid'
import { Review } from './entities/review.entity'

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly repo: Repository<Review>,
  ) {}

  findAll(opts: { featured?: boolean; activeOnly?: boolean } = {}) {
    const qb = this.repo.createQueryBuilder('r').orderBy('r.sort_order', 'ASC')
    if (opts.activeOnly !== false) qb.where('r.is_active = true')
    if (opts.featured) qb.andWhere('r.is_featured = true')
    return qb.getMany()
  }

  async findOne(id: string) {
    const item = await this.repo.findOne({ where: { id } })
    if (!item) throw new NotFoundException('Review not found')
    return item
  }

  async create(data: Partial<Review>) {
    const item = this.repo.create({ id: ulid(), ...data })
    return this.repo.save(item)
  }

  async update(id: string, data: Partial<Review>) {
    await this.findOne(id)
    await this.repo.update(id, data)
    return this.findOne(id)
  }

  async remove(id: string) {
    await this.findOne(id)
    await this.repo.delete(id)
  }
}
