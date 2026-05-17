import { Injectable, Inject } from '@nestjs/common';
import { Agendamento } from '../entities/agendamento.entity';
import { IAgendamentoRepository } from '../repositories/i-agendamento.repository';

@Injectable()
export class AgendamentoService {
  constructor(
    @Inject('IAgendamentoRepository')
    private readonly agendamentoRepository: IAgendamentoRepository,
  ) {}

  public async criarAgendamento(medicoId: string, pacienteId: string, dataHora: Date): Promise<Agendamento> {
    const agendamentoExistente = await this.agendamentoRepository.findByMedicoAndData(medicoId, dataHora);
    if (agendamentoExistente) {
      throw new Error('Médico já possui um agendamento neste horário.');
    }

    const novoAgendamento = new Agendamento(medicoId, pacienteId, dataHora);
    return this.agendamentoRepository.save(novoAgendamento);
  }

  public async cancelarAgendamento(agendamentoId: string): Promise<Agendamento> {
    const agendamento = await this.agendamentoRepository.findById(agendamentoId);
    if (!agendamento) {
      throw new Error('Agendamento não encontrado.');
    }
    agendamento.cancelar();
    return this.agendamentoRepository.save(agendamento);
  }
}
