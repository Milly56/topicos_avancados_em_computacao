import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CacheModule } from '@nestjs/cache-manager';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { ProfissionaisController } from './profissionais.controller';
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.service';
import { ProfissionaisWebSocketGateway } from './websocket.gateway';

import { CriarProfissionalHandler } from './commands/handlers/criar-profissional.handler';
import { ListarProfissionaisHandler } from './queries/handlers/listar-profissionais.handler';
import { RemoverProfissionalHandler } from './commands/handlers/remover-profissional.handler';
import { ProfissionaisService } from './profissionais.service';

@Module({
  imports: [
    CqrsModule,
    CacheModule.register({
      ttl: 60,
      max: 100,
    }),
    EventEmitterModule.forRoot(), 
  ],
  controllers: [ProfissionaisController],
  providers: [
    PrismaService,
    ProfissionaisService,
    RedisService,
    ProfissionaisWebSocketGateway,
    CriarProfissionalHandler,
    ListarProfissionaisHandler,
    RemoverProfissionalHandler,
  ],
})
export class ProfissionaisModule {}