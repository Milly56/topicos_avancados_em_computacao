// DTO de requisição HTTP para criar agendamento
import { IsString, IsDateString } from 'class-validator';

export class CriarAgendamentoRequestDto {
  @IsString()
  medicoId: string;

  @IsString()
  pacienteId: string;

  @IsDateString()
  dataHora: string; // String para validação, convertida para Date no controlador ou serviço
}

// DTO de resposta HTTP para agendamento
export class AgendamentoResponseDto {
  id: string;
  medicoId: string;
  pacienteId: string;
  dataHora: Date;
  status: string;
}