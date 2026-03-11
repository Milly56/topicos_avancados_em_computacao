import { Injectable } from '@nestjs/common';
import { Agendamento } from './agendamento.interface';

@Injectable()
export class AgendamentosService {
  private agendamentos: Agendamento[] = [];

  listar(): Agendamento[] {
    return this.agendamentos;
  }

  buscarPorId(id: number): Agendamento | undefined {
    return this.agendamentos.find((a) => a.id === id);
  }

  criar(agendamento: Agendamento): Agendamento {
    this.agendamentos.push(agendamento);
    return agendamento;
  }

  remover(id: number) {
    this.agendamentos = this.agendamentos.filter((a) => a.id !== id);
  }
}
