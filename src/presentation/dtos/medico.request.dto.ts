// DTOs de requisição HTTP para o módulo de Médico
import { IsString, IsNotEmpty } from 'class-validator';

export class CriarMedicoRequestDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  especialidade: string;

  @IsString()
  @IsNotEmpty()
  crm: string;
}

export class MedicoResponseDto {
  id: string;
  nome: string;
  especialidade: string;
  crm: string;
}