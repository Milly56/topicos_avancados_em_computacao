// Caso de uso para processar um novo pagamento
import { Injectable } from '@nestjs/common';
import { PagamentoService } from '../../domain/services/pagamento.service';
import { ProcessarPagamentoDto, PagamentoOutputDto } from '../dtos/pagamento.dto';
import { IPagamentoGateway } from '../../infrastructure/gateways/pagamento.gateway';

@Injectable()
export class ProcessarPagamentoUseCase {
  constructor(
    private readonly pagamentoService: PagamentoService,
    private readonly pagamentoGateway: IPagamentoGateway, // Injeção do gateway de pagamento
  ) {}

  public async execute(input: ProcessarPagamentoDto): Promise<PagamentoOutputDto> {
    // 1. Criar o pagamento no domínio (status pendente)
    let pagamento = await this.pagamentoService.criarPagamento(
      input.agendamentoId,
      input.valor,
      input.metodoPagamento,
    );

    try {
      // 2. Processar o pagamento via gateway externo
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
      // Em caso de falha na comunicação com o gateway, marcar como recusado
      pagamento = await this.pagamentoService.recusarPagamento(pagamento.getId());
      throw error; // Re-lança o erro para a camada de apresentação
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