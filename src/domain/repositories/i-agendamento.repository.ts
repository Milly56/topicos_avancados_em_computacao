// Interface que define o contrato para o repositório de Agendamentos
import { Agendamento } from '../entities/agendamento.entity';

export interface IAgendamentoRepository {
  save(agendamento: Agendamento): Promise<Agendamento>;
  findById(id: string): Promise<Agendamento | null>;
  findByMedicoAndData(medicoId: string, dataHora: Date): Promise<Agendamento | null>;
  // Outros métodos de busca e manipulação
}