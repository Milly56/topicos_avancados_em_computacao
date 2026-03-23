import { AgendamentosService } from '../../src/agendamento/agendamento.service';
import { Agendamento } from '../../src/agendamento/agendamento.interface';

describe('AgendamentosService', () => {
  let service: AgendamentosService;

  beforeEach(() => {
    service = new AgendamentosService();
  });

  it('deve criar um agendamento', () => {
    const agendamento: Agendamento = {
      id: 1,
      paciente: 'João',
      medico: 'Dra Maria',
      data: '2026-04-10',
      horario: '14:00',
    };

    const result = service.criar(agendamento);

    expect(result).toEqual(agendamento);
    expect(service.listar()).toHaveLength(1);
  });

  it('deve listar agendamentos', () => {
    service.criar({
      id: 1,
      paciente: 'João',
      medico: 'Dra Maria',
      data: '2026-04-10',
      horario: '14:00',
    });

    expect(service.listar()).toHaveLength(1);
  });

  it('deve buscar por ID', () => {
    const agendamento = {
      id: 1,
      paciente: 'João',
      medico: 'Dra Maria',
      data: '2026-04-10',
      horario: '14:00',
    };

    service.criar(agendamento);

    const result = service.buscarPorId(1);

    expect(result).toEqual(agendamento);
  });

  it('deve remover agendamento', () => {
    service.criar({
      id: 1,
      paciente: 'João',
      medico: 'Dra Maria',
      data: '2026-04-10',
      horario: '14:00',
    });

    service.remover(1);

    expect(service.listar()).toHaveLength(0);
  });
});
