import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as path from 'path';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false })

  app.setGlobalPrefix('api')
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  }))
  app.use(cookieParser())
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8082'],
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  )
  app.useGlobalInterceptors(new ResponseInterceptor())

  const port = process.env.PORT || 4000
  await app.listen(port)
  console.log(`NoiThat2026 API running on http://localhost:${port}`)
}
bootstrap()
