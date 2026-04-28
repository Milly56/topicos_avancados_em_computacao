import { ApiProperty } from '@nestjs/swagger';

export class CreateProfissionalDto {
  @ApiProperty({ example: 'João Silva' })
  nome!: string;

  @ApiProperty({ example: 'Cardiologista' })
  especialidade!: string;

  @ApiProperty({ example: '(83) 99999-9999' })
  telefone!: string;
}