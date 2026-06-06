import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export type FormType = 'quote' | 'contact'
export type FormStatus = 'new' | 'processing' | 'done'

@Entity('form_submissions')
export class FormSubmission {
  @PrimaryColumn({ type: 'char', length: 26 })
  id!: string

  @Column({ type: 'enum', enum: ['quote', 'contact'] })
  form_type!: FormType

  @Column({ length: 100 })
  name!: string

  @Column({ length: 20 })
  phone!: string

  @Column({ length: 200, nullable: true })
  email?: string

  @Column({ type: 'json', nullable: true })
  content?: Record<string, unknown>

  @Column({ type: 'enum', enum: ['new', 'processing', 'done'], default: 'new' })
  status!: FormStatus

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
