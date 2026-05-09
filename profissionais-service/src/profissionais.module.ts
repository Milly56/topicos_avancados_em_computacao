import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ProfissionaisController } from './profissionais.controller';
import { PrismaService } from './prisma.service';

import { CriarProfissionalHandler } from './commands/handlers/criar-profissional.handler';
import { ListarProfissionaisHandler } from './queries/handlers/listar-profissionais.handler';
import { RemoverProfissionalHandler } from './commands/handlers/remover-profissional.handler';
import { ProfissionaisService } from './profissionais.service';

@Module({
  imports: [CqrsModule],
  controllers: [ProfissionaisController],
  providers: [
    PrismaService,
    ProfissionaisService,
    CriarProfissionalHandler,
    ListarProfissionaisHandler,
    RemoverProfissionalHandler,
  ],
})
export class ProfissionaisModule {}