import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ulid } from 'ulid'
import { ProductCategory } from './entities/product-category.entity'

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly repo: Repository<ProductCategory>,
  ) {}

  findAll(activeOnly = false) {
    const qb = this.repo.createQueryBuilder('c').orderBy('c.sort_order', 'ASC')
    if (activeOnly) qb.where('c.is_active = true')
    return qb.getMany()
  }

  async findOne(id: string) {
    const item = await this.repo.findOne({ where: { id } })
    if (!item) throw new NotFoundException('Category not found')
    return item
  }

  async findBySlug(slug: string) {
    const item = await this.repo.findOne({ where: { slug } })
    if (!item) throw new NotFoundException('Category not found')
    return item
  }

  async create(data: Partial<ProductCategory>) {
    const item = this.repo.create({ id: ulid(), ...data })
    return this.repo.save(item)
  }

  async update(id: string, data: Partial<ProductCategory>) {
    await this.findOne(id)
    await this.repo.update(id, data)
    return this.findOne(id)
  }

  async remove(id: string) {
    await this.findOne(id)
    await this.repo.delete(id)
  }
}
