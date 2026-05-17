import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessarPagamentoRequestDto {
  @ApiProperty({ example: 'uuid-do-agendamento', description: 'ID do agendamento vinculado ao pagamento' })
  @IsString()
  @IsNotEmpty()
  agendamentoId: string;

  @ApiProperty({ example: 150.0, description: 'Valor a ser cobrado em reais' })
  @IsNumber()
  @IsPositive()
  valor: number;

  @ApiProperty({
    example: 'cartao_credito',
    description: 'Método de pagamento (cartao_credito, cartao_debito, pix, boleto)',
  })
  @IsString()
  @IsNotEmpty()
  metodoPagamento: string;
}

export class PagamentoResponseDto {
  @ApiProperty({ example: 'uuid-do-pagamento' })
  id: string;

  @ApiProperty({ example: 'uuid-do-agendamento' })
  agendamentoId: string;

  @ApiProperty({ example: 150.0 })
  valor: number;

  @ApiProperty({ example: 'aprovado', enum: ['pendente', 'aprovado', 'recusado', 'estornado'] })
  status: string;

  @ApiProperty({ example: 'cartao_credito' })
  metodoPagamento: string;

  @ApiProperty({ example: '2026-05-16T10:00:00.000Z' })
  dataPagamento: Date;
}
