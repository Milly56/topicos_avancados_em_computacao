import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PacienteSyncService implements OnModuleInit {
  private readonly logger = new Logger(PacienteSyncService.name);

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  async onModuleInit() {
    await this.sincronizarTudo();
  }

  async sincronizarTudo() {
    try {
      const url = process.env.PACIENTE_SERVICE_URL || 'http://paciente-service:3000';

      const { data: pacientes } = await firstValueFrom(
        this.httpService.get(`${url}/pacientes`),
      );

      for (const p of pacientes) {
        await this.prisma.pacienteCache.upsert({
          where: { id: p.id },
          update: {
            nome: p.nome,
            email: p.email,
            telefone: p.telefone,
            idade: p.idade,
          },
          create: {
            id: p.id,
            nome: p.nome,
            email: p.email,
            telefone: p.telefone,
            idade: p.idade,
          },
        });
      }

      this.logger.log(`Sincronização inicial: ${pacientes.length} pacientes`);
    } catch (err: any) {
      this.logger.error('Falha na sincronização inicial de pacientes', err?.message);
    }
  }
}