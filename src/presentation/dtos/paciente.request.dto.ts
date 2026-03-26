// DTOs de requisição HTTP para o módulo de Paciente
import { IsString, IsNotEmpty, IsDateString } from "class-validator";

export class CriarPacienteRequestDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsDateString()
  dataNascimento: string; // String para validação, convertida para Date no controlador ou serviço
}

export class PacienteResponseDto {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: Date;
}