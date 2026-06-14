import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { AppLog, LogLevel } from './entities/app-log.entity'
import { generateUlid } from '../../common/helpers/ulid.helper'

const PAGE_LIMIT = 50

export interface LogsQuery {
  level?: LogLevel
  search?: string
  page?: number
}

export interface LogStats {
  errorCount: number
  warnCount: number
  infoCount: number
  totalToday: number
}

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(AppLog)
    private readonly repo: Repository<AppLog>,
  ) {}

  async findAll(query: LogsQuery) {
    const page = Math.max(1, query.page || 1)
    const skip = (page - 1) * PAGE_LIMIT

    const qb = this.repo.createQueryBuilder('log').orderBy('log.created_at', 'DESC')

    if (query.level) {
      qb.andWhere('log.level = :level', { level: query.level })
    }
    if (query.search) {
      qb.andWhere('(log.message LIKE :s OR log.endpoint LIKE :s)', { s: `%${query.search}%` })
    }

    const [data, total] = await qb.skip(skip).take(PAGE_LIMIT).getManyAndCount()
    return { data, meta: { page, limit: PAGE_LIMIT, total, totalPages: Math.ceil(total / PAGE_LIMIT) } }
  }

  async getStats(): Promise<LogStats> {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const [errorCount, warnCount, infoCount, totalToday] = await Promise.all([
      this.repo.count({ where: { level: 'error' } }),
      this.repo.count({ where: { level: 'warn' } }),
      this.repo.count({ where: { level: 'info' } }),
      this.repo
        .createQueryBuilder('log')
        .where('log.created_at >= :start', { start: todayStart })
        .getCount(),
    ])

    return { errorCount, warnCount, infoCount, totalToday }
  }

  async create(dto: Partial<AppLog>): Promise<AppLog> {
    const log = this.repo.create({ ...dto, id: generateUlid() })
    return this.repo.save(log)
  }

  async bulkDelete(ids: string[]): Promise<void> {
    if (!ids.length) return
    await this.repo.delete({ id: In(ids) })
  }

  async deleteAll(level?: LogLevel): Promise<void> {
    const qb = this.repo.createQueryBuilder().delete().from(AppLog)
    if (level) qb.where('level = :level', { level })
    await qb.execute()
  }
}
