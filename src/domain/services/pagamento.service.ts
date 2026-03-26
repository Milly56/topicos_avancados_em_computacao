// Serviço de domínio que contém lógica de negócio que envolve a entidade Pagamento
import { Pagamento } from '../entities/pagamento.entity';
import { IPagamentoRepository } from '../repositories/i-pagamento.repository';

export class PagamentoService {
  constructor(private readonly pagamentoRepository: IPagamentoRepository) {}

  public async criarPagamento(agendamentoId: string, valor: number, metodoPagamento: string): Promise<Pagamento> {
    const novoPagamento = new Pagamento(agendamentoId, valor, metodoPagamento);
    return this.pagamentoRepository.save(novoPagamento);
  }

  public async confirmarPagamento(pagamentoId: string): Promise<Pagamento> {
    const pagamento = await this.pagamentoRepository.findById(pagamentoId);
    if (!pagamento) {
      throw new Error('Pagamento não encontrado.');
    }
    pagamento.confirmarPagamento();
    return this.pagamentoRepository.save(pagamento);
  }

  public async recusarPagamento(pagamentoId: string): Promise<Pagamento> {
    const pagamento = await this.pagamentoRepository.findById(pagamentoId);
    if (!pagamento) {
      throw new Error('Pagamento não encontrado.');
    }
    pagamento.recusarPagamento();
    return this.pagamentoRepository.save(pagamento);
  }

  public async buscarPagamentoPorAgendamentoId(agendamentoId: string): Promise<Pagamento | null> {
    return this.pagamentoRepository.findByAgendamentoId(agendamentoId);
  }
}