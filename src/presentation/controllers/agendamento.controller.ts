// Controlador NestJS para agendamentos
import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { CriarAgendamentoUseCase } from '../../application/use-cases/criar-agendamento.use-case';
import { CriarAgendamentoRequestDto, AgendamentoResponseDto } from '../dtos/agendamento.request.dto';
import { AgendamentoOutputDto } from '../../application/dtos/criar-agendamento.dto';

@Controller('agendamentos')
export class AgendamentoController {
  constructor(private readonly criarAgendamentoUseCase: CriarAgendamentoUseCase) {}

  @Post()
  public async criarAgendamento(@Body() input: CriarAgendamentoRequestDto): Promise<AgendamentoResponseDto> {
    const agendamentoDto: AgendamentoOutputDto = await this.criarAgendamentoUseCase.execute({
      medicoId: input.medicoId,
      pacienteId: input.pacienteId,
      dataHora: new Date(input.dataHora),
    });
    return agendamentoDto; // Mapeamento direto para o DTO de resposta
  }

  // Outros endpoints (ex: GET /agendamentos/:id, PUT /agendamentos/:id/cancelar)
}