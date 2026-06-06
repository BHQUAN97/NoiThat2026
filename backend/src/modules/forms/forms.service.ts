import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ulid } from 'ulid'
import { FormSubmission } from './entities/form-submission.entity'
import { CreateQuoteFormDto, CreateContactFormDto } from './dto/create-form.dto'
import { SimpleMailService } from '../../common/services/simple-mail.service'
import { NotificationsGateway } from '../notifications/notifications.gateway'

@Injectable()
export class FormsService {
  private readonly logger = new Logger(FormsService.name)

  constructor(
    @InjectRepository(FormSubmission)
    private readonly repo: Repository<FormSubmission>,
    private readonly mailService: SimpleMailService,
    private readonly notifications: NotificationsGateway,
  ) {}

  // Tạo form báo giá mới, gửi email thông báo admin + xác nhận khách
  async createQuoteForm(dto: CreateQuoteFormDto): Promise<FormSubmission> {
    const submission = this.repo.create({
      id: ulid(),
      form_type: 'quote',
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
      content: dto.content as Record<string, unknown> | undefined,
      status: 'new',
    })
    await this.repo.save(submission)
    this.logger.log(`Quote form submitted: id=${submission.id} phone=${dto.phone}`)

    // Thông báo real-time cho admin đang online
    this.notifications.notifyNewForm({ id: submission.id, form_type: 'quote', name: dto.name, phone: dto.phone, created_at: submission.created_at.toISOString() })

    // Gửi email bất đồng bộ — không chặn response
    this.mailService.notifyAdmin({ formType: 'quote', name: dto.name, phone: dto.phone, email: dto.email, content: dto.content }).catch(() => {})
    if (dto.email) {
      this.mailService.confirmToCustomer({ formType: 'quote', name: dto.name, phone: dto.phone, email: dto.email }).catch(() => {})
    }

    return submission
  }

  // Tạo form liên hệ mới
  async createContactForm(dto: CreateContactFormDto): Promise<FormSubmission> {
    const submission = this.repo.create({
      id: ulid(),
      form_type: 'contact',
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
      content: { message: (dto.content as any)?.message || dto.content },
      status: 'new',
    })
    await this.repo.save(submission)
    this.logger.log(`Contact form submitted: id=${submission.id} phone=${dto.phone}`)

    // Thông báo real-time cho admin đang online
    this.notifications.notifyNewForm({ id: submission.id, form_type: 'contact', name: dto.name, phone: dto.phone, created_at: submission.created_at.toISOString() })

    this.mailService.notifyAdmin({ formType: 'contact', name: dto.name, phone: dto.phone, email: dto.email, content: submission.content }).catch(() => {})
    if (dto.email) {
      this.mailService.confirmToCustomer({ formType: 'contact', name: dto.name, phone: dto.phone, email: dto.email }).catch(() => {})
    }

    return submission
  }

  // Admin: lấy danh sách form submissions
  async findAll(page = 1, limit = 20, status?: string): Promise<{ data: FormSubmission[], total: number }> {
    const qb = this.repo.createQueryBuilder('f').orderBy('f.created_at', 'DESC')
    if (status) qb.where('f.status = :status', { status })
    const [data, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount()
    return { data, total }
  }

  // Admin: cập nhật trạng thái form
  async updateStatus(id: string, status: 'new' | 'processing' | 'done'): Promise<void> {
    await this.repo.update(id, { status })
  }
}
