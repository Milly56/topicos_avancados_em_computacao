// Controlador NestJS para pagamentos
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ProcessarPagamentoUseCase } from '../../application/use-cases/processar-pagamento.use-case';
import { ConsultarPagamentoUseCase } from '../../application/use-cases/consultar-pagamento.use-case';
import { ProcessarPagamentoRequestDto, PagamentoResponseDto } from '../dtos/pagamento.request.dto';
import { PagamentoOutputDto } from '../../application/dtos/pagamento.dto';

@Controller('pagamentos')
export class PagamentoController {
  constructor(
    private readonly processarPagamentoUseCase: ProcessarPagamentoUseCase,
    private readonly consultarPagamentoUseCase: ConsultarPagamentoUseCase,
  ) {}

  @Post()
  public async processarPagamento(@Body() input: ProcessarPagamentoRequestDto): Promise<PagamentoResponseDto> {
    const pagamentoDto: PagamentoOutputDto = await this.processarPagamentoUseCase.execute(input);
    return pagamentoDto;
  }

  @Get(':agendamentoId')
  public async consultarPagamento(@Param('agendamentoId') agendamentoId: string): Promise<PagamentoResponseDto | null> {
    const pagamentoDto: PagamentoOutputDto | null = await this.consultarPagamentoUseCase.execute(agendamentoId);
    return pagamentoDto;
  }
}