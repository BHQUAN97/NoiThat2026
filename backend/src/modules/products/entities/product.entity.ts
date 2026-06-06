import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('products')
export class Product {
  @PrimaryColumn({ type: 'char', length: 26 })
  id!: string

  @Column({ length: 200 })
  name!: string

  @Column({ length: 200, unique: true })
  slug!: string

  @Column({ type: 'char', length: 26 })
  category_id!: string

  @Column({ type: 'text', nullable: true })
  short_description?: string

  @Column({ type: 'longtext', nullable: true })
  description?: string

  @Column({ length: 500, nullable: true })
  thumbnail_url?: string

  @Column({ type: 'json', nullable: true })
  gallery_urls?: string[]

  @Column({ type: 'json', nullable: true })
  specs?: Record<string, string>

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
