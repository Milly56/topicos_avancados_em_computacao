import { Injectable, NotFoundException, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreatePacienteDto } from './create-paciente.dto';
import { MarcarConsultaDto } from './marcar-consulta.dto';
import { Paciente } from '@prisma/client';
import Redis from 'ioredis';
import { PacienteGateway } from './paciente.gateway';

@Injectable()
export class PacienteService implements OnModuleDestroy {
  private redis: Redis;

  constructor(
    private prisma: PrismaService,
    private gateway: PacienteGateway,
  ) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST ?? 'localhost',
      port: parseInt(process.env.REDIS_PORT ?? '6379'),
    });
  }

  async findAll(): Promise<Paciente[]> {
    return this.prisma.paciente.findMany();
  }

  async create(data: CreatePacienteDto, userId: string): Promise<Paciente> {
    const paciente = await this.prisma.paciente.create({
      data: {
        ...data,
        user_id: userId,
      },
    });

    try {
      await this.redis.set(
        `paciente:${paciente.id}`,
        JSON.stringify(paciente),
        'EX',
        60,
      );
    } catch (error) {
      void error;
    }

    try {
      this.gateway.emitPacienteCriado(paciente);
    } catch (error) {
      void error;
    }

    return paciente;
  }

  async marcarConsulta(
    id: string,
    data: MarcarConsultaDto,
    userId: string,
  ): Promise<
    MarcarConsultaDto & {
      paciente_id: string;
      requested_by: string;
    }
  > {
    await this.findById(id);

    const payload: MarcarConsultaDto & {
      paciente_id: string;
      requested_by: string;
    } = {
      paciente_id: id,
      requested_by: userId,
      ...data,
    };

    try {
      this.gateway.emitPacienteMarcarConsulta(payload);
    } catch (error) {
      void error;
    }

    return payload;
  }

  async findById(id: string): Promise<Paciente> {
    const cacheKey = `paciente:${id}`;
    try {
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached) as Paciente;
      }
    } catch (error) {
      void error;
    }

    const paciente = await this.prisma.paciente.findUnique({ where: { id } });

    if (!paciente) {
      throw new NotFoundException(`Paciente com id ${id} não encontrado`);
    }

    try {
      await this.redis.set(cacheKey, JSON.stringify(paciente), 'EX', 60);
    } catch (error) {
      void error;
    }

    return paciente;
  }

  async delete(id: string): Promise<void> {
    const paciente = await this.prisma.paciente.findUnique({ where: { id } });
    if (!paciente) {
      throw new NotFoundException(`Paciente com id ${id} não encontrado`);
    }

    await this.prisma.paciente.delete({ where: { id } });

    try {
      await this.redis.del(`paciente:${id}`);
    } catch (error) {
      void error;
    }

    try {
      this.gateway.emitPacienteRemovido(id);
    } catch (error) {
      void error;
    }
  }

  onModuleDestroy() {
    this.redis?.disconnect();
  }
}
