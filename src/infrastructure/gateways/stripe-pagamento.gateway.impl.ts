import { Injectable } from '@nestjs/common';
import { IPagamentoGateway } from './pagamento.gateway';

@Injectable()
export class StripePagamentoGatewayImpl implements IPagamentoGateway {
  private readonly metodosAceitos = ['cartao_credito', 'cartao_debito', 'pix', 'boleto'];

  public async processarPagamento(dados: {
    valor: number;
    metodo: string;
    referencia: string;
  }): Promise<{ sucesso: boolean; mensagem?: string }> {
    if (!this.metodosAceitos.includes(dados.metodo)) {
      return {
        sucesso: false,
        mensagem: `Método de pagamento '${dados.metodo}' não suportado. Métodos aceitos: ${this.metodosAceitos.join(', ')}.`,
      };
    }

    if (dados.valor <= 0) {
      return { sucesso: false, mensagem: 'Valor do pagamento deve ser maior que zero.' };
    }

    // Simulação de processamento — em produção, integrar com a Stripe SDK
    return { sucesso: true };
  }

  public async estornarPagamento(referencia: string): Promise<{ sucesso: boolean; mensagem?: string }> {
    if (!referencia) {
      return { sucesso: false, mensagem: 'Referência do pagamento é obrigatória para estorno.' };
    }

    // Simulação de estorno — em produção, integrar com a Stripe SDK
    return { sucesso: true };
  }
}
