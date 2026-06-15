import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { Request, Response } from 'express'
import { generateUlid } from '../helpers/ulid.helper'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Internal server error'
    let stack: string | undefined

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus()
      const exceptionResponse = exception.getResponse()

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>
        if (Array.isArray(resp.message)) {
          message = (resp.message as string[]).join(', ')
        } else if (typeof resp.message === 'string') {
          message = resp.message
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message
      stack = exception.stack
      this.logger.error(`Unhandled exception: ${exception.message}`, exception.stack)
    }

    // Gửi response về client trước
    response.status(statusCode).json({
      success: false,
      data: null,
      message,
      statusCode,
    })

    // Ghi vào app_logs (fire-and-forget, không block response)
    if (statusCode !== 404) {
      const level = statusCode >= 500 ? 'error' : 'warn'
      const ip = (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
        || request.ip
        || request.socket?.remoteAddress
        || null
      const ua = (request.headers['user-agent'] as string | undefined) || null
      const endpoint = `${request.method} ${request.url}`.slice(0, 255)

      this.dataSource.query(
        `INSERT INTO app_logs (id, level, message, stack_trace, endpoint, status_code, ip, user_agent, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [generateUlid(), level, message.slice(0, 500), stack?.slice(0, 5000) || null, endpoint, statusCode, ip, ua?.slice(0, 500) || null],
      ).catch(() => {})
    }
  }
}
