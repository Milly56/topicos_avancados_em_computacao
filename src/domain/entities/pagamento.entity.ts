// Representa a entidade de domínio Pagamento
export class Pagamento {
  private id: string;
  private agendamentoId: string;
  private valor: number;
  private status: 'pendente' | 'aprovado' | 'recusado' | 'estornado';
  private metodoPagamento: string;
  private dataPagamento: Date;

  constructor(agendamentoId: string, valor: number, metodoPagamento: string) {
    this.id = Math.random().toString(36).substring(2, 15); // Exemplo simples de ID
    this.agendamentoId = agendamentoId;
    this.valor = valor;
    this.metodoPagamento = metodoPagamento;
    this.status = 'pendente';
    this.dataPagamento = new Date();
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

  public getStatus(): string {
    return this.status;
  }

  public getMetodoPagamento(): string {
    return this.metodoPagamento;
  }

  public getDataPagamento(): Date {
    return this.dataPagamento;
  }

  public confirmarPagamento(): void {
    if (this.status === 'pendente') {
      this.status = 'aprovado';
    } else {
      throw new Error('Não é possível confirmar um pagamento que não está pendente.');
    }
  }

  public recusarPagamento(): void {
    if (this.status === 'pendente') {
      this.status = 'recusado';
    } else {
      throw new Error('Não é possível recusar um pagamento que não está pendente.');
    }
  }

  // Outros métodos de negócio relacionados ao pagamento
}