import { Module } from '@nestjs/common';
import { AgendamentoModule } from './agendamento/agendamento.module';

@Module({
  imports: [AgendamentoModule],
})

export class AppModule {}
