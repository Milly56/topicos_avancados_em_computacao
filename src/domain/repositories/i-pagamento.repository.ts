// Interface que define o contrato para o repositório de Pagamentos
import { Pagamento } from '../entities/pagamento.entity';

export interface IPagamentoRepository {
  save(pagamento: Pagamento): Promise<Pagamento>;
  findById(id: string): Promise<Pagamento | null>;
  findByAgendamentoId(agendamentoId: string): Promise<Pagamento | null>;
  // Outros métodos de busca e manipulação
}