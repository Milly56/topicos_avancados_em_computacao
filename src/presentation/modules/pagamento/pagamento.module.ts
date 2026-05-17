import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagamentoController } from '../../controllers/pagamento.controller';
import { ProcessarPagamentoUseCase } from '../../../application/use-cases/processar-pagamento.use-case';
import { ConsultarPagamentoUseCase } from '../../../application/use-cases/consultar-pagamento.use-case';
import { PagamentoService } from '../../../domain/services/pagamento.service';
import { PagamentoRepositoryImpl } from '../../../infrastructure/database/repositories/pagamento.repository.impl';
import { PagamentoSchema } from '../../../infrastructure/database/schemas/pagamento.schema';
import { StripePagamentoGatewayImpl } from '../../../infrastructure/gateways/stripe-pagamento.gateway.impl';
import { NotificacoesModule } from '../notificacoes/notificacoes.module';

@Module({
  imports: [TypeOrmModule.forFeature([PagamentoSchema]), NotificacoesModule],
  controllers: [PagamentoController],
  providers: [
    ProcessarPagamentoUseCase,
    ConsultarPagamentoUseCase,
    PagamentoService,
    { provide: 'IPagamentoRepository', useClass: PagamentoRepositoryImpl },
    { provide: 'IPagamentoGateway', useClass: StripePagamentoGatewayImpl },
  ],
  exports: [],
})
export class PagamentoModule {}
