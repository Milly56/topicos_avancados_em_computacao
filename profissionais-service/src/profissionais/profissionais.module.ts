import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { ClsModule } from 'nestjs-cls';

import { ProfissionaisService } from './profissionais.service';
import { ProfissionaisController } from './profissionais.controller';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis.service';
import { LoggerService } from '../common/Logger.service';
import { MetricsService } from '../metrics/Metrics.service';
import { MetricsController } from '../metrics/Metrics.controller ';
import { MetricsInterceptor } from '../metrics/Metrics.interceptor';
import { HealthController } from '../health/Health.controller';
import { DatabaseHealthIndicator } from '../health/Database.health';
import { CorrelationIdMiddleware } from '../common/correlation-id.middleware';

@Module({
  imports: [
    TerminusModule,
    ClsModule.forRoot({
      global: true,
      middleware: { mount: false },
    }),
  ],
  controllers: [
    ProfissionaisController,
    MetricsController,
    HealthController,
  ],
  providers: [
    ProfissionaisService,
    PrismaService,
    RedisService,
    LoggerService,
    MetricsService,
    DatabaseHealthIndicator,
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
})
export class ProfissionaisModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorrelationIdMiddleware)
      .forRoutes('*');
  }
}