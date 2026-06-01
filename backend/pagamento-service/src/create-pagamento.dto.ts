import { ApiProperty } from '@nestjs/swagger';

export class CreatePagamentoDto {
  @ApiProperty({ example: 200 })
  valor!: number;

  @ApiProperty({ example: 'Consulta médica' })
  descricao!: string;

  @ApiProperty({ example: '2026-03-26' })
  dataPagamento!: string;

  @ApiProperty({ example: 'pago' })
  status!: 'pendente' | 'pago' | 'cancelado';
}
