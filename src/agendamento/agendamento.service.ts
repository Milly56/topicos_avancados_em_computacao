import { Injectable } from '@nestjs/common';
import { Agendamento } from './agendamento.interface';

@Injectable()
export class AgendamentosService {
  private agendamentos: Agendamento[] = [];

  listar = (): Agendamento[] => {
    return this.agendamentos;
  };

  buscarPorId = (id: number): Agendamento | undefined => {
    return this.agendamentos.find((a) => a.id === id);
  };

  criar = (agendamento: Agendamento): Agendamento => {
    this.agendamentos.push(agendamento);
    return agendamento;
  };

  remover = (id: number): Agendamento | undefined => {
    const index = this.agendamentos.findIndex((a) => a.id === id);

    if (index === -1) return undefined;

    const removido = this.agendamentos[index];
    this.agendamentos.splice(index, 1);

    return removido;
  };
}
