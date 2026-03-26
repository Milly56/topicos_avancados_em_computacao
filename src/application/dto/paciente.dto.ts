// DTOs para a camada de aplicação do módulo de Paciente
export class CriarPacienteDto {
  nome: string;
  cpf: string;
  dataNascimento: Date;
}

export class PacienteOutputDto {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: Date;
}