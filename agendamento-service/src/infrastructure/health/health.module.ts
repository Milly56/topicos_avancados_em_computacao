import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller.js';
import { PrismaHealthIndicator } from './indicators/prisma.health-indicator.js';
import { RabbitMQHealthIndicator } from './indicators/rabbitmq.health-indicator.js';
import { LogDirHealthIndicator } from './indicators/log-dir.health-indicator.js';
import { PrismaService } from '../../prisma.service.js';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [PrismaService, PrismaHealthIndicator, RabbitMQHealthIndicator, LogDirHealthIndicator],
})
export class HealthModule {}
