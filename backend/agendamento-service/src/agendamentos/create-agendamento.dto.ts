import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgendamentoDto {
  @ApiProperty({ example: 'uuid-do-paciente', description: 'ID do paciente' })
  @IsString()
  @IsNotEmpty()
  pacienteId!: string;

  @ApiProperty({ example: 'prof-uuid-123', description: 'ID do profissional' })
  @IsString()
  @IsNotEmpty()
  profissionalId!: string;

  @ApiProperty({ example: '2026-06-15T00:00:00.000Z', description: 'Data do agendamento' })
  @IsDateString()
  data!: string;

  @ApiProperty({ example: '14:30', description: 'Horário do agendamento' })
  @IsString()
  @IsNotEmpty()
  horario!: string;
}