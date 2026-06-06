import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ulid } from 'ulid'
import { Project } from './entities/project.entity'

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly repo: Repository<Project>,
  ) {}

  findAll(opts: { province?: string; featured?: boolean; activeOnly?: boolean } = {}) {
    const qb = this.repo.createQueryBuilder('p').orderBy('p.sort_order', 'ASC')
    if (opts.activeOnly !== false) qb.where('p.is_active = true')
    if (opts.province && opts.province !== 'all' && opts.province !== '') {
      qb.andWhere('p.province = :province', { province: opts.province })
    }
    if (opts.featured) qb.andWhere('p.is_featured = true')
    return qb.getMany()
  }

  async findOne(id: string) {
    const item = await this.repo.findOne({ where: { id } })
    if (!item) throw new NotFoundException('Project not found')
    return item
  }

  async findBySlug(slug: string) {
    const item = await this.repo.findOne({ where: { slug } })
    if (!item) throw new NotFoundException('Project not found')
    return item
  }

  async create(data: Partial<Project>) {
    const item = this.repo.create({ id: ulid(), ...data })
    return this.repo.save(item)
  }

  async update(id: string, data: Partial<Project>) {
    await this.findOne(id)
    await this.repo.update(id, data)
    return this.findOne(id)
  }

  async remove(id: string) {
    await this.findOne(id)
    await this.repo.delete(id)
  }
}
