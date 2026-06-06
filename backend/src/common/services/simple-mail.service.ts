import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'

export interface FormNotificationData {
  formType: 'quote' | 'contact'
  name: string
  phone: string
  email?: string
  content?: Record<string, unknown>
}

// Email service đơn giản — không phụ thuộc EmailLog entity
@Injectable()
export class SimpleMailService {
  private readonly logger = new Logger(SimpleMailService.name)
  private readonly resend: Resend | null = null
  private readonly from: string
  private readonly adminEmail: string

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('mail.apiKey')
    if (apiKey) {
      this.resend = new Resend(apiKey)
    } else {
      this.logger.warn('RESEND_API_KEY not set — emails will not be sent')
    }
    this.from = 'Nội Thất Duy Mạnh <noreply@duymanhnoithat.vn>'
    this.adminEmail = this.configService.get<string>('mail.adminEmail') || 'duymanhnoithat@gmail.com'
  }

  // Gửi thông báo admin khi có form mới
  async notifyAdmin(data: FormNotificationData): Promise<void> {
    const subject = data.formType === 'quote'
      ? `[Báo Giá Mới] ${data.name} — ${data.phone}`
      : `[Liên Hệ Mới] ${data.name} — ${data.phone}`

    const html = this.buildAdminNotificationHtml(data)
    await this.send(this.adminEmail, subject, html)
  }

  // Gửi xác nhận cho khách hàng (nếu có email)
  async confirmToCustomer(data: FormNotificationData): Promise<void> {
    if (!data.email) return
    const subject = 'Xác nhận yêu cầu — Nội Thất Duy Mạnh'
    const html = this.buildCustomerConfirmHtml(data.name)
    await this.send(data.email, subject, html)
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    if (!this.resend) return

    try {
      const { error } = await this.resend.emails.send({ from: this.from, to: [to], subject, html })
      if (error) throw new Error(error.message)
      this.logger.log(`Email sent to ${to}: ${subject}`)
    } catch (err: any) {
      this.logger.error(`Email failed to ${to}: ${err?.message}`)
    }
  }

  private buildAdminNotificationHtml(data: FormNotificationData): string {
    const rows = [
      ['Loại form', data.formType === 'quote' ? 'Báo giá' : 'Liên hệ'],
      ['Họ tên', data.name],
      ['Điện thoại', data.phone],
      data.email ? ['Email', data.email] : null,
      ...(data.content ? Object.entries(data.content).filter(([, v]) => v).map(([k, v]) => [k, String(v)]) : []),
    ].filter(Boolean) as string[][]

    return `<!DOCTYPE html><html lang="vi"><body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
<h2 style="color:#B45309">Yêu cầu mới từ website</h2>
<table style="width:100%;border-collapse:collapse">
${rows.map(([k, v]) => `<tr><td style="padding:8px;background:#f5f5f4;font-weight:600;width:140px">${k}</td><td style="padding:8px;border-bottom:1px solid #e7e5e4">${this.escape(v)}</td></tr>`).join('')}
</table>
<p style="margin-top:24px;color:#78716C;font-size:13px">© Nội Thất Duy Mạnh</p>
</body></html>`
  }

  private buildCustomerConfirmHtml(name: string): string {
    return `<!DOCTYPE html><html lang="vi"><body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
<h2 style="color:#B45309">Cảm ơn bạn, ${this.escape(name)}!</h2>
<p>Chúng tôi đã nhận được yêu cầu của bạn. Đội tư vấn sẽ liên hệ trong vòng <strong>24 giờ</strong>.</p>
<p>Nếu cần hỗ trợ ngay, gọi hotline: <strong>094.872.8091</strong></p>
<p style="margin-top:32px;color:#78716C;font-size:13px">Nội Thất Duy Mạnh — Vân Nam, Phúc Thọ, Hà Nội</p>
</body></html>`
  }

  private escape(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }
}
