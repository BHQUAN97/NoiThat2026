import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SiteConfig } from './entities/site-config.entity'

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SiteConfig)
    private readonly repo: Repository<SiteConfig>,
  ) {}

  async get(key: string): Promise<string | null> {
    const item = await this.repo.findOne({ where: { key } })
    return item?.value ?? null
  }

  async getAll(): Promise<Record<string, string>> {
    const items = await this.repo.find()
    return Object.fromEntries(items.map((i) => [i.key, i.value]))
  }

  async set(key: string, value: string, type = 'string') {
    await this.repo.save({ key, value, type })
    return { key, value }
  }

  async setMany(entries: Array<{ key: string; value: string; type?: string }>) {
    const records = entries.map((e) => ({ key: e.key, value: e.value, type: e.type ?? 'string' }))
    await this.repo.save(records)
  }
}
