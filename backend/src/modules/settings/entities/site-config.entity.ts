import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm'

@Entity('site_config')
export class SiteConfig {
  @PrimaryColumn({ length: 100 })
  key!: string

  @Column({ type: 'longtext' })
  value!: string

  @Column({ length: 50, default: 'string' })
  type!: string

  @UpdateDateColumn()
  updated_at!: Date
}
