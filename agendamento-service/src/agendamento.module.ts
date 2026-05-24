import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AgendamentosController } from './agendamento.controller.js';
import { AgendamentosService } from './agendamento.service.js';
import { PrismaService } from './prisma.service.js';
import { LoggingModule } from './infrastructure/logging/logging.module.js';
import { CorrelationIdMiddleware } from './infrastructure/logging/correlation-id.middleware.js';
import { MetricsModule } from './infrastructure/metrics/metrics.module.js';
import { HealthModule } from './infrastructure/health/health.module.js';
import { ResilienceModule } from './infrastructure/resilience/resilience.module.js';

@Module({
  imports: [LoggingModule, MetricsModule, HealthModule, ResilienceModule],
  controllers: [AgendamentosController],
  providers: [AgendamentosService, PrismaService],
})
export class AgendamentoModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(CorrelationIdMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
