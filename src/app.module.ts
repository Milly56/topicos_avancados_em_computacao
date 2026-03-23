import { Module } from '@nestjs/common';
import { AgendamentoModule } from './agendamento/agendamento.module';
import { PagamentoModule } from './pagamento/pagamento.module';
import { PacienteModule } from './paciente/paciente.module';

@Module({
  imports: [AgendamentoModule, PagamentoModule, PacienteModule],
})
export class AppModule {}
