import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProcessarPagamentoUseCase } from '../../application/use-cases/processar-pagamento.use-case';
import { ConsultarPagamentoUseCase } from '../../application/use-cases/consultar-pagamento.use-case';
import { ProcessarPagamentoRequestDto, PagamentoResponseDto } from '../dtos/pagamento.request.dto';

@ApiTags('Pagamentos')
@Controller('pagamentos')
export class PagamentoController {
  constructor(
    private readonly processarPagamentoUseCase: ProcessarPagamentoUseCase,
    private readonly consultarPagamentoUseCase: ConsultarPagamentoUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Processa um novo pagamento para um agendamento' })
  @ApiResponse({ status: 201, description: 'Pagamento processado com sucesso', type: PagamentoResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou pagamento recusado pelo gateway' })
  public async processarPagamento(@Body() input: ProcessarPagamentoRequestDto): Promise<PagamentoResponseDto> {
    return this.processarPagamentoUseCase.execute(input);
  }

  @Get(':agendamentoId')
  @ApiOperation({ summary: 'Consulta o pagamento de um agendamento' })
  @ApiParam({ name: 'agendamentoId', description: 'ID do agendamento' })
  @ApiResponse({ status: 200, description: 'Pagamento encontrado', type: PagamentoResponseDto })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  public async consultarPagamento(@Param('agendamentoId') agendamentoId: string): Promise<PagamentoResponseDto> {
    const resultado = await this.consultarPagamentoUseCase.execute(agendamentoId);
    if (!resultado) {
      throw new NotFoundException(`Pagamento para o agendamento '${agendamentoId}' não encontrado.`);
    }
    return resultado;
  }
}
