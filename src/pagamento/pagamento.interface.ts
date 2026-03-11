export interface Pagamento {
  id: number;
  valor: number;
  descricao: string;
  dataPagamento: string;
  status: 'pendente' | 'pago' | 'cancelado';
}

