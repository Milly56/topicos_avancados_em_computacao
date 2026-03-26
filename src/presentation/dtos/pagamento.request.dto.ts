// DTOs de requisição HTTP para o módulo de Pagamento
import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class ProcessarPagamentoRequestDto {
  @IsString()
  @IsNotEmpty()
  agendamentoId: string;

  @IsNumber()
  @IsPositive()
  valor: number;

  @IsString()
  @IsNotEmpty()
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