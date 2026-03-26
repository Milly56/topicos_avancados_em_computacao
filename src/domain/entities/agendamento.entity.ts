// Representa a entidade de domínio Agendamento
export class Agendamento {
  private id: string;
  private medicoId: string;
  private pacienteId: string;
  private dataHora: Date;
  private status: 'agendado' | 'cancelado' | 'realizado';

  constructor(medicoId: string, pacienteId: string, dataHora: Date) {
    this.id = Math.random().toString(36).substring(2, 15); // Exemplo simples de ID
    this.medicoId = medicoId;
    this.pacienteId = pacienteId;
    this.dataHora = dataHora;
    this.status = 'agendado';
  }

  public getId(): string {
    return this.id;
  }

  public getMedicoId(): string {
    return this.medicoId;
  }

  public getPacienteId(): string {
    return this.pacienteId;
  }

  public getDataHora(): Date {
    return this.dataHora;
  }

  public getStatus(): string {
    return this.status;
  }

  public cancelar(): void {
    if (this.status === 'agendado') {
      this.status = 'cancelado';
    } else {
      throw new Error('Não é possível cancelar um agendamento que não está agendado.');
    }
  }

  // Outros métodos de negócio relacionados ao agendamento
}