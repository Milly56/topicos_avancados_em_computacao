import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PacienteService } from '../src/paciente.service';
import { PrismaService } from '../src/prisma.service';
import { PacienteGateway } from '../src/paciente.gateway';
import { Paciente } from '@prisma/client';

// ─── Mock Redis ───────────────────────────────────────────────────────────────
const mockRedis = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  publish: jest.fn(),
  disconnect: jest.fn(),
};

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => mockRedis);
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
const makePaciente = (overrides: Partial<Paciente> = {}): Paciente => ({
  id: 'uuid-1',
  nome: 'Maria Silva',
  idade: 30,
  telefone: '(83) 99999-9999',
  email: 'maria@email.com',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
} as Paciente);

// ─── Mocks de dependências ────────────────────────────────────────────────────
const mockPrisma = {
  paciente: {
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
};

const mockGateway = {
  emitPacienteCriado: jest.fn(),
  emitPacienteMarcarConsulta: jest.fn(),
  emitPacienteRemovido: jest.fn(),
};

// ─── Suite ────────────────────────────────────────────────────────────────────
describe('PacienteService', () => {
  let service: PacienteService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacienteService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: PacienteGateway, useValue: mockGateway },
      ],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
  });

  // ── findAll ─────────────────────────────────────────────────────────────────
  describe('findAll', () => {
    it('deve retornar lista de pacientes', async () => {
      const pacientes = [makePaciente(), makePaciente({ id: 'uuid-2', email: 'joao@email.com' })];
      mockPrisma.paciente.findMany.mockResolvedValue(pacientes);

      const result = await service.findAll();

      expect(result).toEqual(pacientes);
      expect(mockPrisma.paciente.findMany).toHaveBeenCalledTimes(1);
    });

    it('deve retornar lista vazia quando não houver pacientes', async () => {
      mockPrisma.paciente.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  // ── create ──────────────────────────────────────────────────────────────────
  describe('create', () => {
    const dto = { nome: 'Maria Silva', idade: 30, telefone: '(83) 99999-9999', email: 'maria@email.com' };
    const paciente = makePaciente();

    beforeEach(() => {
      mockPrisma.paciente.create.mockResolvedValue(paciente);
      mockRedis.set.mockResolvedValue('OK');
      mockRedis.publish.mockResolvedValue(1);
    });

    it('deve criar paciente e retorná-lo', async () => {
      const result = await service.create(dto);

      expect(mockPrisma.paciente.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(paciente);
    });

    it('deve salvar no cache Redis após criar', async () => {
      await service.create(dto);

      expect(mockRedis.set).toHaveBeenCalledWith(
        `paciente:${paciente.id}`,
        JSON.stringify(paciente),
        'EX',
        60,
      );
    });

    it('deve publicar evento no Redis após criar', async () => {
      await service.create(dto);

      expect(mockRedis.publish).toHaveBeenCalledWith(
        'paciente:criado',
        JSON.stringify(paciente),
      );
    });

    it('deve emitir evento via gateway após criar', async () => {
      await service.create(dto);

      expect(mockGateway.emitPacienteCriado).toHaveBeenCalledWith(paciente);
    });

    it('deve retornar paciente mesmo se Redis falhar', async () => {
      mockRedis.set.mockRejectedValue(new Error('Redis down'));
      mockRedis.publish.mockRejectedValue(new Error('Redis down'));

      const result = await service.create(dto);

      expect(result).toEqual(paciente);
    });

    it('deve retornar paciente mesmo se gateway falhar', async () => {
      mockGateway.emitPacienteCriado.mockImplementation(() => {
        throw new Error('Gateway error');
      });

      const result = await service.create(dto);

      expect(result).toEqual(paciente);
    });
  });

  // ── findByEmail ──────────────────────────────────────────────────────────────
  describe('findByEmail', () => {
    const email = 'maria@email.com';
    const cacheKey = `paciente:email:${email}`;
    const paciente = makePaciente();

    it('deve retornar paciente do cache quando disponível', async () => {
      mockRedis.get.mockResolvedValue(JSON.stringify(paciente));

      const result = await service.findByEmail(email);

      expect(result).toEqual(paciente);
      expect(mockPrisma.paciente.findUnique).not.toHaveBeenCalled();
    });

    it('deve buscar no banco quando cache vazio e salvar no cache', async () => {
      mockRedis.get.mockResolvedValue(null);
      mockPrisma.paciente.findUnique.mockResolvedValue(paciente);
      mockRedis.set.mockResolvedValue('OK');

      const result = await service.findByEmail(email);

      expect(mockPrisma.paciente.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(mockRedis.set).toHaveBeenCalledWith(
        cacheKey,
        JSON.stringify(paciente),
        'EX',
        60,
      );
      expect(result).toEqual(paciente);
    });

    it('deve retornar null quando paciente não existe', async () => {
      mockRedis.get.mockResolvedValue(null);
      mockPrisma.paciente.findUnique.mockResolvedValue(null);

      const result = await service.findByEmail(email);

      expect(result).toBeNull();
      expect(mockRedis.set).not.toHaveBeenCalled();
    });

    it('deve buscar no banco quando Redis falhar', async () => {
      mockRedis.get.mockRejectedValue(new Error('Redis down'));
      mockPrisma.paciente.findUnique.mockResolvedValue(paciente);

      const result = await service.findByEmail(email);

      expect(result).toEqual(paciente);
    });
  });

  // ── findById ─────────────────────────────────────────────────────────────────
  describe('findById', () => {
    const id = 'uuid-1';
    const cacheKey = `paciente:${id}`;
    const paciente = makePaciente();

    it('deve retornar paciente do cache quando disponível', async () => {
      mockRedis.get.mockResolvedValue(JSON.stringify(paciente));

      const result = await service.findById(id);

      expect(result).toEqual(paciente);
      expect(mockPrisma.paciente.findUnique).not.toHaveBeenCalled();
    });

    it('deve buscar no banco quando cache vazio e salvar no cache', async () => {
      mockRedis.get.mockResolvedValue(null);
      mockPrisma.paciente.findUnique.mockResolvedValue(paciente);
      mockRedis.set.mockResolvedValue('OK');

      const result = await service.findById(id);

      expect(mockPrisma.paciente.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(mockRedis.set).toHaveBeenCalledWith(cacheKey, JSON.stringify(paciente), 'EX', 60);
      expect(result).toEqual(paciente);
    });

    it('deve lançar NotFoundException quando paciente não existe', async () => {
      mockRedis.get.mockResolvedValue(null);
      mockPrisma.paciente.findUnique.mockResolvedValue(null);

      await expect(service.findById(id)).rejects.toThrow(
        new NotFoundException(`Paciente com id ${id} não encontrado`),
      );
    });

    it('deve buscar no banco quando Redis falhar', async () => {
      mockRedis.get.mockRejectedValue(new Error('Redis down'));
      mockPrisma.paciente.findUnique.mockResolvedValue(paciente);

      const result = await service.findById(id);

      expect(result).toEqual(paciente);
    });
  });

  // ── marcarConsulta ───────────────────────────────────────────────────────────
  describe('marcarConsulta', () => {
    const id = 'uuid-1';
    const paciente = makePaciente();
    const consultaDto = { date: '2024-06-01', profissional_id: 'prof-1', observacoes: 'Retorno' };

    beforeEach(() => {
      mockRedis.get.mockResolvedValue(JSON.stringify(paciente));
    });

    it('deve retornar payload com paciente_id', async () => {
      const result = await service.marcarConsulta(id, consultaDto);

      expect(result).toEqual({ paciente_id: id, ...consultaDto });
    });

    it('deve emitir evento via gateway', async () => {
      await service.marcarConsulta(id, consultaDto);

      expect(mockGateway.emitPacienteMarcarConsulta).toHaveBeenCalledWith({
        paciente_id: id,
        ...consultaDto,
      });
    });

    it('deve lançar NotFoundException se paciente não existir', async () => {
      mockRedis.get.mockResolvedValue(null);
      mockPrisma.paciente.findUnique.mockResolvedValue(null);

      await expect(service.marcarConsulta(id, consultaDto)).rejects.toThrow(NotFoundException);
    });

    it('deve retornar payload mesmo se gateway falhar', async () => {
      mockGateway.emitPacienteMarcarConsulta.mockImplementation(() => {
        throw new Error('Gateway error');
      });

      const result = await service.marcarConsulta(id, consultaDto);

      expect(result).toEqual({ paciente_id: id, ...consultaDto });
    });
  });

  // ── delete ───────────────────────────────────────────────────────────────────
  describe('delete', () => {
    const id = 'uuid-1';
    const paciente = makePaciente();

    beforeEach(() => {
      mockPrisma.paciente.findUnique.mockResolvedValue(paciente);
      mockPrisma.paciente.delete.mockResolvedValue(paciente);
      mockRedis.del.mockResolvedValue(1);
      mockRedis.publish.mockResolvedValue(1);
    });

    it('deve deletar paciente com sucesso', async () => {
      await service.delete(id);

      expect(mockPrisma.paciente.delete).toHaveBeenCalledWith({ where: { id } });
    });

    it('deve remover do cache após deletar', async () => {
      await service.delete(id);

      expect(mockRedis.del).toHaveBeenCalledWith(`paciente:${id}`);
    });

    it('deve publicar evento de remoção no Redis', async () => {
      await service.delete(id);

      expect(mockRedis.publish).toHaveBeenCalledWith(
        'paciente:deletado',
        JSON.stringify({ id }),
      );
    });

    it('deve emitir evento de remoção via gateway', async () => {
      await service.delete(id);

      expect(mockGateway.emitPacienteRemovido).toHaveBeenCalledWith(id);
    });

    it('deve lançar NotFoundException se paciente não existir', async () => {
      mockPrisma.paciente.findUnique.mockResolvedValue(null);

      await expect(service.delete(id)).rejects.toThrow(
        new NotFoundException(`Paciente com id ${id} não encontrado`),
      );
      expect(mockPrisma.paciente.delete).not.toHaveBeenCalled();
    });

    it('deve deletar mesmo se Redis falhar', async () => {
      mockRedis.del.mockRejectedValue(new Error('Redis down'));
      mockRedis.publish.mockRejectedValue(new Error('Redis down'));

      await expect(service.delete(id)).resolves.not.toThrow();
      expect(mockPrisma.paciente.delete).toHaveBeenCalled();
    });

    it('deve deletar mesmo se gateway falhar', async () => {
      mockGateway.emitPacienteRemovido.mockImplementation(() => {
        throw new Error('Gateway error');
      });

      await expect(service.delete(id)).resolves.not.toThrow();
    });
  });

  // ── onModuleDestroy ──────────────────────────────────────────────────────────
  describe('onModuleDestroy', () => {
    it('deve desconectar o Redis ao destruir o módulo', () => {
      service.onModuleDestroy();

      expect(mockRedis.disconnect).toHaveBeenCalledTimes(1);
    });
  });
});