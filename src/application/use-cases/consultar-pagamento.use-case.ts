import { Injectable } from '@nestjs/common';
import { PagamentoService } from '../../domain/services/pagamento.service';
import { PagamentoOutputDto } from '../dto/pagamento.dto';

@Injectable()
export class ConsultarPagamentoUseCase {
  constructor(private readonly pagamentoService: PagamentoService) {}

  public async execute(agendamentoId: string): Promise<PagamentoOutputDto | null> {
    const pagamento = await this.pagamentoService.buscarPagamentoPorAgendamentoId(agendamentoId);
    if (!pagamento) return null;

    return {
      id: pagamento.getId(),
      agendamentoId: pagamento.getAgendamentoId(),
      valor: pagamento.getValor(),
      status: pagamento.getStatus(),
      metodoPagamento: pagamento.getMetodoPagamento(),
      dataPagamento: pagamento.getDataPagamento(),
    };
  }
}
