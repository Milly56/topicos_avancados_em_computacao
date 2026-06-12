import { Module } from '@nestjs/common';
import { AgendamentosController } from './agendamento.controller';
import { AgendamentosService } from './agendamento.service';
import { PrismaModule } from '../prisma.module';
import { ProfissionalCacheModule } from '../profissional-cache/profissional-cache.module';

@Module({
  imports: [PrismaModule, ProfissionalCacheModule],
  controllers: [AgendamentosController],
  providers: [AgendamentosService],
})
export class AgendamentoModule {}