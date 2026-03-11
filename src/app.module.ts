import { Module } from '@nestjs/common';
import { AgendamentoModule } from './agendamento/agendamento.module';
import { PagamentoController } from './pagamento/pagamento.controller';
import { PagamentoService } from './pagamento/pagamento.service';
import { PagamentoModule } from './pagamento/pagamento.module';

@Module({
  imports: [AgendamentoModule, PagamentoModule],
  controllers: [PagamentoController],
  providers: [PagamentoService],
})
export class AppModule {}
