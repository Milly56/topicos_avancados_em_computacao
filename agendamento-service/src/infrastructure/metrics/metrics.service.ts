import { Injectable, OnModuleInit } from '@nestjs/common';
import { Registry, Counter, Gauge, Histogram, collectDefaultMetrics } from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  readonly registry = new Registry();

  readonly agendamentoCriadosTotal = new Counter({
    name: 'agendamento_criados_total',
    help: 'Total de agendamentos criados',
    labelNames: ['status'],
    registers: [this.registry],
  });

  readonly agendamentoAtivosSimultaneos = new Gauge({
    name: 'agendamento_ativos_simultaneos',
    help: 'Número atual de agendamentos ativos',
    registers: [this.registry],
  });

  readonly agendamentoCriacaoDuracao = new Histogram({
    name: 'agendamento_criacao_duracao_segundos',
    help: 'Duração do processo de criação de agendamento em segundos',
    buckets: [0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0],
    registers: [this.registry],
  });

  onModuleInit(): void {
    collectDefaultMetrics({ register: this.registry });
  }
}
