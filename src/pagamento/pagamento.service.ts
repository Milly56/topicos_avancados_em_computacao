import { Injectable } from '@nestjs/common';

@Injectable()
export class PagamentoService {
  private pagamentos = new Map<string, any>();

  async processarPagamento(amount: number, userId: string) {
    if (amount <= 0) {
      throw new Error('Valor inválido');
    }

    if (!userId) {
      throw new Error('Usuário não encontrado');
    }

    const chave = `${userId}-${amount}`;

    // evita duplicidade
    if (this.pagamentos.has(chave)) {
      return {
        status: 'duplicado',
        transactionId: this.pagamentos.get(chave).transactionId,
      };
    }

    const resultado = {
      status: 'aprovado',
      transactionId: Math.random().toString(36).substring(2),
    };

    this.pagamentos.set(chave, resultado);

    return resultado;
  }
}