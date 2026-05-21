import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { PacienteController } from './paciente.controller';
import { PacienteService } from './paciente.service';
import { PrismaModule } from './prisma.module';
import { PacienteGateway } from './paciente.gateway';
import { CorrelationIdMiddleware } from './correlation-id.middleware';
import { CorrelationIdService } from './correlation-id.service';
import { MetricsService } from './metrics.service';

@Module({
  imports: [PrismaModule],
  controllers: [PacienteController],
  providers: [
    PacienteService,
    PacienteGateway,
    CorrelationIdService,
    MetricsService,
  ],
})
export class PacienteModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}

export { PacienteModule as AppModule };
