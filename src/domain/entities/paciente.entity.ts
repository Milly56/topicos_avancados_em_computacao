// Representa a entidade de domínio Paciente
export class Paciente {
  private id: string;
  private nome: string;
  private cpf: string;
  private dataNascimento: Date;

  constructor(nome: string, cpf: string, dataNascimento: Date) {
    this.id = Math.random().toString(36).substring(2, 15); // Exemplo simples de ID
    this.nome = nome;
    this.cpf = cpf;
    this.dataNascimento = dataNascimento;
  }

  public getId(): string {
    return this.id;
  }

  public getNome(): string {
    return this.nome;
  }

  public getCpf(): string {
    return this.cpf;
  }

  public getDataNascimento(): Date {
    return this.dataNascimento;
  }

  public atualizarNome(novoNome: string): void {
    this.nome = novoNome;
  }

  // Outros métodos de negócio relacionados ao paciente
}