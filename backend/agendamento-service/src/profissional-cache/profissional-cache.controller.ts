import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PrismaService } from '../prisma.service';

@Controller()
export class ProfissionalCacheController {
  private readonly logger = new Logger(ProfissionalCacheController.name);

  constructor(private prisma: PrismaService) {}

  @EventPattern('profissional:criado')
  async handleCriado(@Payload() data: any) {
    await this.upsert(data);
  }

  @EventPattern('profissional:atualizado')
  async handleAtualizado(@Payload() data: any) {
    await this.upsert(data);
  }

  @EventPattern('profissional:deletado')
  async handleDeletado(@Payload() data: any) {
    try {
      await this.prisma.profissionalCache
        .delete({ where: { id: data.id } })
        .catch(() => null);

      this.logger.log(`ProfissionalCache removido: ${data.id}`);
    } catch (err: any) {
      this.logger.error('Erro ao remover profissional', err?.message);
    }
  }

  private async upsert(data: any) {
    try {
      await this.prisma.profissionalCache.upsert({
        where: { id: data.id },
        update: {
          nome: data.nome,
          especialidade: data.especialidade,
          telefone: data.telefone,
          email: data.email,
        },
        create: {
          id: data.id,
          nome: data.nome,
          especialidade: data.especialidade,
          telefone: data.telefone,
          email: data.email,
        },
      });

      this.logger.log(`ProfissionalCache upsert: ${data.id}`);
    } catch (err: any) {
      this.logger.error('Erro ao processar upsert de profissional', err?.message);
    }
  }
}