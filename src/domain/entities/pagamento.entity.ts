import { v4 as uuidv4 } from 'uuid';

export class Pagamento {
  private id: string;
  private agendamentoId: string;
  private valor: number;
  private status: 'pendente' | 'aprovado' | 'recusado' | 'estornado';
  private metodoPagamento: string;
  private dataPagamento: Date;

  constructor(agendamentoId: string, valor: number, metodoPagamento: string) {
    this.id = uuidv4();
    this.agendamentoId = agendamentoId;
    this.valor = valor;
    this.metodoPagamento = metodoPagamento;
    this.status = 'pendente';
    this.dataPagamento = new Date();
  }

  public static reconstituir(
    id: string,
    agendamentoId: string,
    valor: number,
    metodoPagamento: string,
    status: 'pendente' | 'aprovado' | 'recusado' | 'estornado',
    dataPagamento: Date,
  ): Pagamento {
    const pagamento = new Pagamento(agendamentoId, valor, metodoPagamento);
    pagamento.id = id;
    pagamento.status = status;
    pagamento.dataPagamento = dataPagamento;
    return pagamento;
  }

  public getId(): string {
    return this.id;
  }

  public getAgendamentoId(): string {
    return this.agendamentoId;
  }

  public getValor(): number {
    return this.valor;
  }

  public getStatus(): 'pendente' | 'aprovado' | 'recusado' | 'estornado' {
    return this.status;
  }

  public getMetodoPagamento(): string {
    return this.metodoPagamento;
  }

  public getDataPagamento(): Date {
    return this.dataPagamento;
  }

  public confirmarPagamento(): void {
    if (this.status !== 'pendente') {
      throw new Error('Não é possível confirmar um pagamento que não está pendente.');
    }
    this.status = 'aprovado';
  }

  public recusarPagamento(): void {
    if (this.status !== 'pendente') {
      throw new Error('Não é possível recusar um pagamento que não está pendente.');
    }
    this.status = 'recusado';
  }

  public estornarPagamento(): void {
    if (this.status !== 'aprovado') {
      throw new Error('Apenas pagamentos aprovados podem ser estornados.');
    }
    this.status = 'estornado';
  }
}
