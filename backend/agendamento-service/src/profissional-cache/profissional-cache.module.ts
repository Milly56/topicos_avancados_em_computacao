import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma.module';
import { ProfissionalCacheController } from './profissional-cache.controller';
import { ProfissionalSyncService } from './profissional-sync.service';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [ProfissionalCacheController],
  providers: [ProfissionalSyncService],
  exports: [ProfissionalSyncService],
})
export class ProfissionalCacheModule {}