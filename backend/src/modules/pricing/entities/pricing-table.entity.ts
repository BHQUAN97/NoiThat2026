import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('pricing_tables')
export class PricingTable {
  @PrimaryColumn({ type: 'char', length: 26 })
  id!: string

  @Column({ length: 100 })
  name!: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ type: 'json', nullable: true })
  items?: Array<{ label: string; price: string; unit?: string; note?: string }>

  @Column({ length: 500, nullable: true })
  detail_url?: string

  @Column({ default: 0 })
  sort_order!: number

  @Column({ default: true })
  is_active!: boolean

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
