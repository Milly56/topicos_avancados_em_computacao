import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { CacheModule } from '@nestjs/cache-manager';
import { CqrsModule } from '@nestjs/cqrs';
import { ClsModule } from 'nestjs-cls';
import { EventEmitterModule } from '@nestjs/event-emitter';

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

import { CriarProfissionalHandler } from './commands/handlers/criar-profissional.handler';
import { RemoverProfissionalHandler } from './commands/handlers/remover-profissional.handler';

import { ListarProfissionaisHandler } from './queries/handlers/listar-profissionais.handler';
import { VerificarEmailHandler } from './queries/handlers/verificar-email.handler';
import { PrismaModule } from 'src/prisma/prisma.module';

const CommandHandlers = [CriarProfissionalHandler, RemoverProfissionalHandler];
const QueryHandlers = [ListarProfissionaisHandler, VerificarEmailHandler];

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    PrismaModule,
    EventEmitterModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      ttl: 300,
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
      },
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
    ...CommandHandlers,
    ...QueryHandlers,
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