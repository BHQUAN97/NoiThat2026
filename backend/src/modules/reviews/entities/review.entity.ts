import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('reviews')
export class Review {
  @PrimaryColumn({ type: 'char', length: 26 })
  id!: string

  @Column({ length: 100 })
  customer_name!: string

  @Column({ length: 100, nullable: true })
  location?: string

  @Column({ type: 'tinyint', default: 5 })
  rating!: number

  @Column({ type: 'text' })
  content!: string

  @Column({ length: 500, nullable: true })
  avatar_url?: string

  @Column({ default: true })
  is_active!: boolean

  @Column({ default: false })
  is_featured!: boolean

  @Column({ default: 0 })
  sort_order!: number

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
