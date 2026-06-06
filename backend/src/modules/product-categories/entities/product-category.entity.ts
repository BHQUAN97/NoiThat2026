import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('product_categories')
export class ProductCategory {
  @PrimaryColumn({ type: 'char', length: 26 })
  id!: string

  @Column({ length: 100 })
  name!: string

  @Column({ length: 100, unique: true })
  slug!: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ length: 500, nullable: true })
  thumbnail_url?: string

  @Column({ default: 0 })
  sort_order!: number

  @Column({ default: true })
  is_active!: boolean

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
