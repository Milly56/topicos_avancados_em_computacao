import { Module } from '@nestjs/common';
import { PagamentoController } from './pagamento.controller';
import { PagamentoService } from './pagamento.service';

@Module({
  imports: [],
  controllers: [PagamentoController],
  providers: [PagamentoService],
})
export class PagamentoModule {}
