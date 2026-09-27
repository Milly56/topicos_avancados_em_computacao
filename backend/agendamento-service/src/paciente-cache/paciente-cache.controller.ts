import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PrismaService } from '../prisma.service';

@Controller()
export class PacienteCacheController {
  private readonly logger = new Logger(PacienteCacheController.name);

  constructor(private prisma: PrismaService) {}

  @EventPattern('paciente:criado')
  async handleCriado(@Payload() data: any) {
    await this.upsert(data);
  }

  @EventPattern('paciente:deletado')
  async handleDeletado(@Payload() data: any) {
    try {
      await this.prisma.pacienteCache
        .delete({ where: { id: data.id } })
        .catch(() => null);
      this.logger.log(`PacienteCache removido: ${data.id}`);
    } catch (err: any) {
      this.logger.error('Erro ao remover paciente do cache', err?.message);
    }
  }

  private async upsert(data: any) {
    try {
      await this.prisma.pacienteCache.upsert({
        where: { id: data.id },
        update: {
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
          idade: data.idade,
        },
        create: {
          id: data.id,
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
          idade: data.idade,
        },
      });
      this.logger.log(`PacienteCache upsert: ${data.id}`);
    } catch (err: any) {
      this.logger.error('Erro ao processar upsert de paciente', err?.message);
    }
  }
}