// Representa a entidade de domínio Medico
export class Medico {
  private id: string;
  private nome: string;
  private especialidade: string;
  private crm: string;

  constructor(nome: string, especialidade: string, crm: string) {
    this.id = Math.random().toString(36).substring(2, 15); // Exemplo simples de ID
    this.nome = nome;
    this.especialidade = especialidade;
    this.crm = crm;
  }

  public getId(): string {
    return this.id;
  }

  public getNome(): string {
    return this.nome;
  }

  public getEspecialidade(): string {
    return this.especialidade;
  }

  public getCrm(): string {
    return this.crm;
  }

  public atualizarEspecialidade(novaEspecialidade: string): void {
    this.especialidade = novaEspecialidade;
  }

  // Outros métodos de negócio relacionados ao médico
}