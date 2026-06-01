import { ApiProperty } from '@nestjs/swagger';

export class CreateAgendamentoDto {
  @ApiProperty({ example: 'João' })
  paciente!: string;

  @ApiProperty({ example: 'Dra Maria' })
  medico!: string;

  @ApiProperty({ example: '2026-04-10' })
  data!: string;

  @ApiProperty({ example: '14:00' })
  horario!: string;
}