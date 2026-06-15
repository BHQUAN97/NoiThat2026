import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

import { databaseConfig } from './config/database.config';
import { jwtConfig } from './config/jwt.config';
import { r2Config } from './config/r2.config';
import { mailConfig } from './config/mail.config';

import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';
import { MediaModule } from './modules/media/media.module';
import { SettingsModule } from './modules/settings/settings.module';
import { ServicesModule } from './common/services/services.module';

// NoiThat2026 modules
import { ProductCategoriesModule } from './modules/product-categories/product-categories.module';
import { ProductsModule } from './modules/products/products.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { VideosModule } from './modules/videos/videos.module';
import { NewsModule } from './modules/news/news.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { FormsModule } from './modules/forms/forms.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { LogsModule } from './modules/logs/logs.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { PageConfigsModule } from './modules/page-configs/page-configs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, r2Config, mailConfig],
      envFilePath: ['.env'],
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql' as const,
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),

    AuthModule,
    HealthModule,
    UsersModule,
    MediaModule,
    SettingsModule,
    ServicesModule,
    ProductCategoriesModule,
    ProductsModule,
    ProjectsModule,
    VideosModule,
    NewsModule,
    PricingModule,
    ReviewsModule,
    FormsModule,
    NotificationsModule,
    LogsModule,
    AnalyticsModule,
    PageConfigsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
