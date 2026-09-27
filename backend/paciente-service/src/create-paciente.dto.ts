import { ApiProperty } from '@nestjs/swagger';

export class CreatePacienteDto {
  @ApiProperty({ example: 'Maria Silva' })
  nome!: string;

  @ApiProperty({ example: 30 })
  idade!: number;

  @ApiProperty({ example: '(83) 99999-9999' })
  telefone!: string;

  @ApiProperty({ example: 'maria@email.com' })
  email!: string;
}