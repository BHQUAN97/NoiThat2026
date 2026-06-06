import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ulid } from 'ulid'
import { News } from './entities/news.entity'

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly repo: Repository<News>,
  ) {}

  async findAll(page = 1, limit = 12): Promise<{ data: News[]; total: number }> {
    const [data, total] = await this.repo.createQueryBuilder('n')
      .where('n.is_active = true')
      .orderBy('n.published_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()
    return { data, total }
  }

  async findAllAdmin(page = 1, limit = 20, status?: string): Promise<{ data: News[]; total: number }> {
    const qb = this.repo.createQueryBuilder('n').orderBy('n.created_at', 'DESC')
    if (status === 'published') qb.where('n.is_active = true')
    else if (status === 'draft') qb.where('n.is_active = false')
    const [data, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount()
    return { data, total }
  }

  async findOne(id: string) {
    const item = await this.repo.findOne({ where: { id } })
    if (!item) throw new NotFoundException('News not found')
    return item
  }

  async findBySlug(slug: string) {
    const item = await this.repo.findOne({ where: { slug, is_active: true } })
    if (!item) throw new NotFoundException('News not found')
    return item
  }

  async create(data: Partial<News>) {
    const item = this.repo.create({ id: ulid(), ...data })
    return this.repo.save(item)
  }

  async update(id: string, data: Partial<News>) {
    await this.findOne(id)
    await this.repo.update(id, data)
    return this.findOne(id)
  }

  async remove(id: string) {
    await this.findOne(id)
    await this.repo.delete(id)
  }
}
