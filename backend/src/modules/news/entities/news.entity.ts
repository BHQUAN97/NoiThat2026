import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('news')
export class News {
  @PrimaryColumn({ type: 'char', length: 26 })
  id!: string

  @Column({ length: 200 })
  title!: string

  @Column({ length: 200, unique: true })
  slug!: string

  @Column({ type: 'text', nullable: true })
  excerpt?: string

  @Column({ type: 'longtext', nullable: true })
  content?: string

  @Column({ length: 500, nullable: true })
  thumbnail_url?: string

  @Column({ default: true })
  is_active!: boolean

  @Column({ default: false })
  is_featured!: boolean

  @Column({ type: 'datetime', nullable: true })
  published_at?: Date

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
