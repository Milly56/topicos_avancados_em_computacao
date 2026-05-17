import { Injectable, Inject } from '@nestjs/common';
import { PagamentoService } from '../../domain/services/pagamento.service';
import { ProcessarPagamentoDto, PagamentoOutputDto } from '../dto/pagamento.dto';
import { IPagamentoGateway } from '../../infrastructure/gateways/pagamento.gateway';

@Injectable()
export class ProcessarPagamentoUseCase {
  constructor(
    private readonly pagamentoService: PagamentoService,
    @Inject('IPagamentoGateway')
    private readonly pagamentoGateway: IPagamentoGateway,
  ) {}

  public async execute(input: ProcessarPagamentoDto): Promise<PagamentoOutputDto> {
    let pagamento = await this.pagamentoService.criarPagamento(
      input.agendamentoId,
      input.valor,
      input.metodoPagamento,
    );

    try {
      const gatewayResponse = await this.pagamentoGateway.processarPagamento({
        valor: input.valor,
        metodo: input.metodoPagamento,
        referencia: pagamento.getId(),
      });

      if (gatewayResponse.sucesso) {
        pagamento = await this.pagamentoService.confirmarPagamento(pagamento.getId());
      } else {
        pagamento = await this.pagamentoService.recusarPagamento(pagamento.getId());
        throw new Error(gatewayResponse.mensagem || 'Pagamento recusado pelo gateway.');
      }
    } catch (error) {
      if (pagamento.getStatus() === 'pendente') {
        pagamento = await this.pagamentoService.recusarPagamento(pagamento.getId());
      }
      throw error;
    }

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
