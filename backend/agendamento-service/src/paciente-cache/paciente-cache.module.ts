import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PacienteCacheController } from './paciente-cache.controller';
import { PacienteSyncService } from './paciente-sync.service';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [PacienteCacheController],
  providers: [PacienteSyncService],
  exports: [PacienteSyncService],
})
export class PacienteCacheModule {}