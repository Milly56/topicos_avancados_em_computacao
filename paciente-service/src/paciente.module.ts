// paciente.module.ts
import { Module } from '@nestjs/common';
import {PacienteController } from './paciente.controller';
import { PacienteService } from './paciente.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PacienteController],
  providers: [PacienteService],
})
export class PacienteModule {}