import { IsString, IsNumber, IsPositive } from 'class-validator';

export class ProcessarPagamentoRequestDto {
  @IsString()
  agendamentoId: string;

  @IsNumber()
  @IsPositive()
  valor: number;

  @IsString()
  metodoPagamento: string;
}

export class PagamentoResponseDto {
  id: string;
  agendamentoId: string;
  valor: number;
  status: string;
  metodoPagamento: string;
  dataPagamento: Date;
}