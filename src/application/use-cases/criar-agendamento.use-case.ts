import { Injectable } from '@nestjs/common';
import { AgendamentoService } from '../../domain/services/agendamento.service';
import { CriarAgendamentoDto, AgendamentoOutputDto } from '../dto/criar-agendamento.dto';
import { NotificacoesGateway } from '../../infrastructure/realtime/notificacoes.gateway';

@Injectable()
export class CriarAgendamentoUseCase {
  constructor(
    private readonly agendamentoService: AgendamentoService,
    private readonly notificacoes: NotificacoesGateway,
  ) {}

  public async execute(input: CriarAgendamentoDto): Promise<AgendamentoOutputDto> {
    const agendamento = await this.agendamentoService.criarAgendamento(
      input.medicoId,
      input.pacienteId,
      input.dataHora,
    );

    const resultado: AgendamentoOutputDto = {
      id: agendamento.getId(),
      medicoId: agendamento.getMedicoId(),
      pacienteId: agendamento.getPacienteId(),
      dataHora: agendamento.getDataHora(),
      status: agendamento.getStatus(),
    };

    this.notificacoes.emitir('agendamento.criado', resultado);

    return resultado;
  }
}
