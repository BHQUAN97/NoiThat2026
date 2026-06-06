import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ulid } from 'ulid'
import { Product } from './entities/product.entity'

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  findAll(opts: { categoryId?: string; featured?: boolean; active?: boolean } = {}) {
    const qb = this.repo.createQueryBuilder('p').orderBy('p.sort_order', 'ASC')
    if (opts.categoryId) qb.andWhere('p.category_id = :categoryId', { categoryId: opts.categoryId })
    if (opts.featured) qb.andWhere('p.is_featured = true')
    if (opts.active !== undefined) qb.andWhere('p.is_active = :active', { active: opts.active })
    return qb.getMany()
  }

  async findOne(id: string) {
    const item = await this.repo.findOne({ where: { id } })
    if (!item) throw new NotFoundException('Product not found')
    return item
  }

  async findBySlug(slug: string) {
    const item = await this.repo.findOne({ where: { slug } })
    if (!item) throw new NotFoundException('Product not found')
    return item
  }

  async create(data: Partial<Product>) {
    const item = this.repo.create({ id: ulid(), ...data })
    return this.repo.save(item)
  }

  async update(id: string, data: Partial<Product>) {
    await this.findOne(id)
    await this.repo.update(id, data)
    return this.findOne(id)
  }

  async remove(id: string) {
    await this.findOne(id)
    await this.repo.delete(id)
  }
}
