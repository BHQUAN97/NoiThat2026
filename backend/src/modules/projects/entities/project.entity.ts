import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('projects')
export class Project {
  @PrimaryColumn({ type: 'char', length: 26 })
  id!: string

  @Column({ length: 200 })
  name!: string

  @Column({ length: 200, unique: true })
  slug!: string

  @Column({ length: 100 })
  province!: string

  @Column({ length: 200, nullable: true })
  location?: string

  @Column({ length: 100, nullable: true })
  area_sqm?: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ length: 500, nullable: true })
  thumbnail_url?: string

  @Column({ type: 'json', nullable: true })
  gallery_urls?: string[]

  @Column({ default: 0 })
  sort_order!: number

  @Column({ default: true })
  is_active!: boolean

  @Column({ default: false })
  is_featured!: boolean

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
