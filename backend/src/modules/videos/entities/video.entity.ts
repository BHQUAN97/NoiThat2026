import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export type VideoType = 'youtube' | 'upload'

@Entity('videos')
export class Video {
  @PrimaryColumn({ type: 'char', length: 26 })
  id!: string

  @Column({ length: 200 })
  title!: string

  @Column({ type: 'enum', enum: ['youtube', 'upload'], default: 'youtube' })
  video_type!: VideoType

  @Column({ length: 100, nullable: true })
  youtube_id?: string

  @Column({ length: 1000, nullable: true })
  video_url?: string

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
