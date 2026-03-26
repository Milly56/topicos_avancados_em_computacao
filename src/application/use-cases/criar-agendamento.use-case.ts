// Caso de uso para criar um novo agendamento
import { Injectable } from '@nestjs/common';
import { AgendamentoService } from '../../domain/services/agendamento.service';
import { CriarAgendamentoDto, AgendamentoOutputDto } from '../dtos/criar-agendamento.dto';

@Injectable()
export class CriarAgendamentoUseCase {
  constructor(private readonly agendamentoService: AgendamentoService) {}

  public async execute(input: CriarAgendamentoDto): Promise<AgendamentoOutputDto> {
    const agendamento = await this.agendamentoService.criarAgendamento(
      input.medicoId,
      input.pacienteId,
      input.dataHora,
    );
    return {
      id: agendamento.getId(),
      medicoId: agendamento.getMedicoId(),
      pacienteId: agendamento.getPacienteId(),
      dataHora: agendamento.getDataHora(),
      status: agendamento.getStatus(),
    };
  }
}