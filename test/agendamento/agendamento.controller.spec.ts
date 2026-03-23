import { Test, TestingModule } from '@nestjs/testing';
import { AgendamentosController } from '../../src/agendamento/agendamento.controller';
import { AgendamentosService } from '../../src/agendamento/agendamento.service';
import { Agendamento } from '../../src/agendamento/agendamento.interface';
import { NotFoundException } from '@nestjs/common';

describe('AgendamentosController', () => {
  let controller: AgendamentosController;
  let mockService: jest.Mocked<AgendamentosService>;

  beforeEach(async () => {
    mockService = {
      listar: jest.fn(),
      buscarPorId: jest.fn(),
      criar: jest.fn(),
      remover: jest.fn(),
    } as unknown as jest.Mocked<AgendamentosService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgendamentosController],
      providers: [
        {
          provide: AgendamentosService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AgendamentosController>(AgendamentosController);
  });

  it('deve listar agendamentos', () => {
    const lista: Agendamento[] = [
      {
        id: 1,
        paciente: 'João',
        medico: 'Dra Maria',
        data: '2026-04-10',
        horario: '14:00',
      },
    ];

    mockService.listar.mockReturnValue(lista);

    const result = controller.listar();

    expect(result).toEqual(lista);
    expect(mockService.listar).toHaveBeenCalled();
  });

  it('deve retornar um agendamento por id', () => {
    const agendamento: Agendamento = {
      id: 1,
      paciente: 'João',
      medico: 'Dra Maria',
      data: '2026-04-10',
      horario: '14:00',
    };

    mockService.buscarPorId.mockReturnValue(agendamento);

    const result = controller.buscar('1');

    expect(result).toEqual(agendamento);
    expect(mockService.buscarPorId).toHaveBeenCalledWith(1);
  });

  it('deve lançar erro ao buscar inexistente', () => {
    mockService.buscarPorId.mockReturnValue(undefined);

    expect(() => controller.buscar('999')).toThrow(
      new NotFoundException('Agendamento com id 999 não encontrado.'),
    );
  });

  it('deve criar agendamento', () => {
    const novo: Agendamento = {
      id: 2,
      paciente: 'Maria',
      medico: 'Dr João',
      data: '2026-05-01',
      horario: '10:00',
    };

    mockService.criar.mockReturnValue(novo);

    const result = controller.criar(novo);

    expect(result).toEqual(novo);
    expect(mockService.criar).toHaveBeenCalledWith(novo);
  });

  it('deve remover agendamento', () => {
    const agendamento: Agendamento = {
      id: 1,
      paciente: 'João',
      medico: 'Dra Maria',
      data: '2026-04-10',
      horario: '14:00',
    };

    mockService.remover.mockReturnValue(agendamento);

    const result = controller.remover('1');

    expect(result).toEqual(agendamento);
    expect(mockService.remover).toHaveBeenCalledWith(1);
  });

  it('deve lançar erro ao remover inexistente', () => {
    mockService.remover.mockReturnValue(undefined);

    expect(() => controller.remover('999')).toThrow(
      new NotFoundException('Agendamento com id 999 não encontrado.'),
    );
  });
});
