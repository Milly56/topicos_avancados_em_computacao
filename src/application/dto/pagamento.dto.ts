// DTOs para a camada de aplicação do módulo de Pagamento
export class ProcessarPagamentoDto {
  agendamentoId: string;
  valor: number;
  metodoPagamento: string;
}

export class PagamentoOutputDto {
  id: string;
  agendamentoId: string;
  valor: number;
  status: string;
  metodoPagamento: string;
  dataPagamento: Date;
}