import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProfissionalSyncService implements OnModuleInit {
  private readonly logger = new Logger(ProfissionalSyncService.name);

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  async onModuleInit() {
    await this.sincronizarTudo();
  }

  async sincronizarTudo() {
    try {
      const url =
        process.env.PROFISSIONAIS_SERVICE_URL || 'http://profissionais-service:3005';

      const { data: profissionais } = await firstValueFrom(
        this.httpService.get(`${url}/profissionais`),
      );

      for (const p of profissionais) {
        await this.prisma.profissionalCache.upsert({
          where: { id: p.id },
          update: {
            nome: p.nome,
            especialidade: p.especialidade,
            telefone: p.telefone,
            email: p.email,
          },
          create: {
            id: p.id,
            nome: p.nome,
            especialidade: p.especialidade,
            telefone: p.telefone,
            email: p.email,
          },
        });
      }

      this.logger.log(`Sincronização inicial: ${profissionais.length} profissionais`);
    } catch (err: any) {
      this.logger.error('Falha na sincronização inicial de profissionais', err?.message);
    }
  }
}