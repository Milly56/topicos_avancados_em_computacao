import { Module } from '@nestjs/common';
import { PacienteController } from './paciente.controller';
import { PacienteService } from './paciente.service';
import { PrismaModule } from './prisma.module';
import { PacienteGateway } from './paciente.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [PacienteController],
  providers: [PacienteService, PacienteGateway],
})
export class PacienteModule {}

export { PacienteModule as AppModule };
