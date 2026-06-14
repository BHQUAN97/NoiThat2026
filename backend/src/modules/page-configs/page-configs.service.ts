import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PageConfig } from './entities/page-config.entity'
import { PageConfigHistory } from './entities/page-config-history.entity'
import { generateUlid } from '../../common/helpers/ulid.helper'

@Injectable()
export class PageConfigsService {
  constructor(
    @InjectRepository(PageConfig)
    private readonly repo: Repository<PageConfig>,
    @InjectRepository(PageConfigHistory)
    private readonly historyRepo: Repository<PageConfigHistory>,
  ) {}

  async findOrCreate(pageSlug: string): Promise<PageConfig> {
    let config = await this.repo.findOne({ where: { page_slug: pageSlug } })
    if (!config) {
      config = this.repo.create({ page_slug: pageSlug, config_draft: null, config_published: null, version: 0 })
      config.id = generateUlid()
      config = await this.repo.save(config)
    }
    return config
  }

  async getDraft(pageSlug: string): Promise<PageConfig> {
    const config = await this.repo.findOne({ where: { page_slug: pageSlug } })
    if (!config) throw new NotFoundException(`Page config not found: ${pageSlug}`)
    return config
  }

  async create(pageSlug: string, configDraft: Record<string, unknown>, userId: string): Promise<PageConfig> {
    let config = await this.repo.findOne({ where: { page_slug: pageSlug } })
    if (config) {
      config.config_draft = configDraft
      config.updated_by = userId
      return this.repo.save(config)
    }
    const newConfig = this.repo.create({
      page_slug: pageSlug,
      config_draft: configDraft,
      config_published: null,
      version: 0,
      updated_by: userId,
    })
    newConfig.id = generateUlid()
    return this.repo.save(newConfig)
  }

  async saveDraft(pageSlug: string, configDraft: Record<string, unknown>, userId: string): Promise<PageConfig> {
    const config = await this.repo.findOne({ where: { page_slug: pageSlug } })
    if (!config) throw new NotFoundException(`Page config not found: ${pageSlug}`)
    config.config_draft = configDraft
    config.updated_by = userId
    return this.repo.save(config)
  }

  async publish(pageSlug: string, userId: string): Promise<PageConfig> {
    const config = await this.repo.findOne({ where: { page_slug: pageSlug } })
    if (!config) throw new NotFoundException(`Page config not found: ${pageSlug}`)

    // Snapshot history truoc khi publish
    if (config.config_published) {
      const snapshot = this.historyRepo.create({
        page_config_id: config.id,
        config_snapshot: config.config_published,
        version: config.version,
        published_at: config.published_at,
        published_by: config.published_by,
      })
      snapshot.id = generateUlid()
      await this.historyRepo.save(snapshot)
    }

    config.config_published = config.config_draft || {}
    config.version += 1
    config.published_at = new Date()
    config.published_by = userId
    config.updated_by = userId
    return this.repo.save(config)
  }

  async getHistory(pageSlug: string): Promise<PageConfigHistory[]> {
    const config = await this.repo.findOne({ where: { page_slug: pageSlug } })
    if (!config) return []
    return this.historyRepo.find({
      where: { page_config_id: config.id },
      order: { version: 'DESC' },
      take: 20,
    })
  }

  async rollback(pageSlug: string, version: number, userId: string): Promise<PageConfig> {
    const config = await this.repo.findOne({ where: { page_slug: pageSlug } })
    if (!config) throw new NotFoundException(`Page config not found: ${pageSlug}`)

    const history = await this.historyRepo.findOne({
      where: { page_config_id: config.id, version },
    })
    if (!history) throw new NotFoundException(`Version ${version} not found`)

    config.config_draft = history.config_snapshot
    config.updated_by = userId
    return this.repo.save(config)
  }
}
