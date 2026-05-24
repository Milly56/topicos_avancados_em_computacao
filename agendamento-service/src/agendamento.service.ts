import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { CreateAgendamentoDto } from './create-agendamento.dto.js';
import { AppLoggerService } from './infrastructure/logging/app-logger.service.js';
import { MetricsService } from './infrastructure/metrics/metrics.service.js';

@Injectable()
export class AgendamentosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLoggerService,
    private readonly metrics: MetricsService,
  ) {}

  listar() {
    return this.prisma.agendamento.findMany({ orderBy: { data: 'asc' } });
  }

  buscarPorId(id: number) {
    return this.prisma.agendamento.findUnique({ where: { id } });
  }

  async criar(dto: CreateAgendamentoDto) {
    const timer = this.metrics.agendamentoCriacaoDuracao.startTimer();
    this.metrics.agendamentoAtivosSimultaneos.inc();

    try {
      this.logger.log(
        `Criando agendamento paciente=${dto.paciente} medico=${dto.medico}`,
        AgendamentosService.name,
      );

      const agendamento = await this.prisma.agendamento.create({
        data: {
          paciente: dto.paciente,
          medico: dto.medico,
          data: new Date(dto.data),
          horario: dto.horario,
        },
      });

      this.logger.log(`Agendamento ${agendamento.id} criado`, AgendamentosService.name);
      this.metrics.agendamentoCriadosTotal.inc({ status: 'sucesso' });

      return agendamento;
    } catch (error) {
      this.metrics.agendamentoCriadosTotal.inc({ status: 'erro' });
      this.logger.error(
        `Falha ao criar agendamento: ${(error as Error).message}`,
        (error as Error).stack,
        AgendamentosService.name,
      );
      throw error;
    } finally {
      timer();
      this.metrics.agendamentoAtivosSimultaneos.dec();
    }
  }

  async remover(id: number) {
    try {
      const agendamento = await this.prisma.agendamento.delete({ where: { id } });
      this.logger.log(`Agendamento ${id} removido`, AgendamentosService.name);
      return agendamento;
    } catch {
      return null;
    }
  }
}
