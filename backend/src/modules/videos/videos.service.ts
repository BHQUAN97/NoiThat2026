import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ulid } from 'ulid'
import { Video } from './entities/video.entity'

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private readonly repo: Repository<Video>,
  ) {}

  findAll(activeOnly = true) {
    const qb = this.repo.createQueryBuilder('v').orderBy('v.sort_order', 'ASC')
    if (activeOnly) qb.where('v.is_active = true')
    return qb.getMany()
  }

  async findOne(id: string) {
    const item = await this.repo.findOne({ where: { id } })
    if (!item) throw new NotFoundException('Video not found')
    return item
  }

  async create(data: Partial<Video>) {
    const item = this.repo.create({ id: ulid(), ...data })
    return this.repo.save(item)
  }

  async update(id: string, data: Partial<Video>) {
    await this.findOne(id)
    await this.repo.update(id, data)
    return this.findOne(id)
  }

  async remove(id: string) {
    await this.findOne(id)
    await this.repo.delete(id)
  }
}
