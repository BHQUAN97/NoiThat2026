import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  BeforeInsert,
} from 'typeorm'
import { generateUlid } from '../../../common/helpers/ulid.helper'

@Entity('page_config_history')
export class PageConfigHistory {
  @PrimaryColumn({ type: 'char', length: 26 })
  id!: string

  @Column({ type: 'char', length: 26 })
  page_config_id!: string

  @Column({ type: 'json' })
  config_snapshot!: Record<string, unknown>

  @Column({ type: 'int', unsigned: true })
  version!: number

  @Column({ type: 'timestamp', nullable: true })
  published_at!: Date | null

  @Column({ type: 'char', length: 26, nullable: true })
  published_by!: string | null

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = generateUlid()
  }
}
