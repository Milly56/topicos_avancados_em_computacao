import { Module } from '@nestjs/common';
import { AgendamentosController } from './agendamento.controller';
import { AgendamentosService } from './agendamento.service';

@Module({
  controllers: [AgendamentosController],
  providers: [AgendamentosService],
})
export class AgendamentoModule {}
