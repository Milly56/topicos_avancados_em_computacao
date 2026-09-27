import { Injectable, OnModuleInit } from '@nestjs/common';
import { Registry, Gauge, Counter, Histogram, collectDefaultMetrics } from 'prom-client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MetricsService implements OnModuleInit {
  readonly registry: Registry;

  readonly profissionaisAtivos: Gauge<string>;
  readonly requisicaoTotal: Counter<string>;
  readonly requisicaoLatencia: Histogram<string>;

  constructor(private readonly prisma: PrismaService) {
    this.registry = new Registry();
    this.registry.setDefaultLabels({ service: 'profissionais-service' });

    collectDefaultMetrics({ register: this.registry });

    this.profissionaisAtivos = new Gauge({
      name: 'profissionais_ativos_total',
      help: 'Número atual de profissionais ativos no banco de dados',
      registers: [this.registry],
    });

    this.requisicaoTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total de requisições HTTP recebidas',
      labelNames: ['method', 'route', 'status'],
      registers: [this.registry],
    });

    this.requisicaoLatencia = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Latência das requisições HTTP em segundos',
      labelNames: ['method', 'route', 'status'],
      buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
      registers: [this.registry],
    });
  }

  async onModuleInit() {
    await this.atualizarProfissionaisAtivos();
  }

  async atualizarProfissionaisAtivos() {
    const count = await this.prisma.profissional.count();
    this.profissionaisAtivos.set(count);
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}