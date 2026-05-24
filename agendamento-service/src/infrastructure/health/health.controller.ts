import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PrismaHealthIndicator } from './indicators/prisma.health-indicator.js';
import { RabbitMQHealthIndicator } from './indicators/rabbitmq.health-indicator.js';
import { LogDirHealthIndicator } from './indicators/log-dir.health-indicator.js';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prisma: PrismaHealthIndicator,
    private readonly rabbitmq: RabbitMQHealthIndicator,
    private readonly logDir: LogDirHealthIndicator,
  ) {}

  @Get('live')
  @ApiOperation({ summary: 'Liveness probe' })
  live() {
    return { status: 'ok' };
  }

  @Get('ready')
  @HealthCheck()
  @ApiOperation({ summary: 'Readiness probe — verifica PostgreSQL e RabbitMQ' })
  ready() {
    return this.health.check([
      () => this.prisma.isHealthy('postgres'),
      () => this.rabbitmq.isHealthy('rabbitmq'),
    ]);
  }

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Status detalhado de todos os health checks' })
  check() {
    return this.health.check([
      () => this.prisma.isHealthy('postgres'),
      () => this.rabbitmq.isHealthy('rabbitmq'),
      () => this.logDir.isHealthy('log-dir'),
    ]);
  }
}
