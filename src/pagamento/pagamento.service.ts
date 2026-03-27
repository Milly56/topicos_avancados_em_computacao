import { Injectable, NotFoundException } from '@nestjs/common';
import { Pagamento } from './pagamento.interface';
import { CreatePagamentoDto } from './create-pagamento.dto';

@Injectable()
export class PagamentoService {
  private pagamentos: Pagamento[] = [];
  private idCounter = 1;

  findAll(): Pagamento[] {
    return this.pagamentos;
  }

  findOne(id: string): Pagamento {
    const pagamento = this.pagamentos.find((p) => p.id === Number(id));

    if (!pagamento) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    return pagamento;
  }

  create(data: CreatePagamentoDto): Pagamento {
    const novoPagamento: Pagamento = {
      id: this.idCounter++,
      valor: data.valor,
      descricao: data.descricao,
      dataPagamento: data.dataPagamento,
      status: data.status,
    };

    this.pagamentos.push(novoPagamento);
    return novoPagamento;
  }

  remove(id: string): void {
    const index = this.pagamentos.findIndex((p) => p.id === Number(id));

    if (index === -1) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    this.pagamentos.splice(index, 1);
  }
}
