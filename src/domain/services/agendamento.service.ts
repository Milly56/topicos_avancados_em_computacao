// Serviço de domínio que contém lógica de negócio que envolve a entidade Agendamento
import { Agendamento } from '../entities/agendamento.entity';
import { IAgendamentoRepository } from '../repositories/i-agendamento.repository';

export class AgendamentoService {
  constructor(private readonly agendamentoRepository: IAgendamentoRepository) {}

  public async criarAgendamento(medicoId: string, pacienteId: string, dataHora: Date): Promise<Agendamento> {
    // Lógica de negócio de domínio: verificar se o médico está disponível
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
    agendamento.cancelar(); // Lógica de negócio da entidade
    return this.agendamentoRepository.save(agendamento);
  }
}