import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateProfissionalDto } from './create-profissionais.dto';
import { RedisService } from './redis.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createClient } from 'redis';

@Injectable()
export class ProfissionaisService {
  private readonly CACHE_PREFIX = 'profissional';
  private readonly CACHE_TTL = 600;
  private redisPublisher: any;

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private eventEmitter: EventEmitter2,
  ) {
    this.initializeRedisPublisher();
  }

  private async initializeRedisPublisher() {
    this.redisPublisher = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    });

    this.redisPublisher.on('error', (err: any) => {
      console.error('Redis Publisher error:', err);
    });

    await this.redisPublisher.connect();
  }

  async listar() {
    const cacheKey = `${this.CACHE_PREFIX}:listar`;

    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const profissionais = await this.prisma.profissional.findMany();

    await this.redisService.set(cacheKey, profissionais, this.CACHE_TTL);

    return profissionais;
  }

  async buscarPorId(id: string) {
    const cacheKey = `${this.CACHE_PREFIX}:${id}`;

    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const profissional = await this.prisma.profissional.findUnique({
      where: { id },
    });

    if (!profissional) {
      throw new NotFoundException('Profissional não encontrado');
    }

    await this.redisService.set(cacheKey, profissional, this.CACHE_TTL);

    return profissional;
  }

  async criar(data: CreateProfissionalDto) {
    const profissional = await this.prisma.profissional.create({
      data: {
        nome: data.nome,
        especialidade: data.especialidade,
        telefone: data.telefone,
      },
    });

    await this.redisService.del(`${this.CACHE_PREFIX}:listar`);

    const evento = {
      id: profissional.id,
      nome: profissional.nome,
      especialidade: profissional.especialidade,
      telefone: profissional.telefone,
      timestamp: new Date().toISOString(),
    };

    await this.redisPublisher.publish(
      'profissional:criado',
      JSON.stringify(evento),
    );

    this.eventEmitter.emit('profissional.criado', evento);

    return profissional;
  }

  async remover(id: string) {
    await this.buscarPorId(id);

    const deleted = await this.prisma.profissional.delete({
      where: { id },
    });

    await this.redisService.del(`${this.CACHE_PREFIX}:${id}`);
    await this.redisService.del(`${this.CACHE_PREFIX}:listar`);

    const evento = {
      id: deleted.id,
      timestamp: new Date().toISOString(),
    };

    await this.redisPublisher.publish(
      'profissional:deletado',
      JSON.stringify(evento),
    );

    this.eventEmitter.emit('profissional.deletado', evento);

    return deleted;
  }

  async atualizar(id: string, data: Partial<CreateProfissionalDto>) {
    await this.buscarPorId(id);

    const profissional = await this.prisma.profissional.update({
      where: { id },
      data,
    });

    await this.redisService.del(`${this.CACHE_PREFIX}:${id}`);
    await this.redisService.del(`${this.CACHE_PREFIX}:listar`);

    const evento = {
      id: profissional.id,
      nome: profissional.nome,
      especialidade: profissional.especialidade,
      telefone: profissional.telefone,
      timestamp: new Date().toISOString(),
    };

    await this.redisPublisher.publish(
      'profissional:atualizado',
      JSON.stringify(evento),
    );

    this.eventEmitter.emit('profissional.atualizado', evento);

    return profissional;
  }
}