import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagamentoController } from '../../controllers/pagamento.controller';
import { ProcessarPagamentoUseCase } from '../../../application/use-cases/processar-pagamento.use-case';
import { ConsultarPagamentoUseCase } from '../../../application/use-cases/consultar-pagamento.use-case';
import { PagamentoService } from '../../../domain/services/pagamento.service';
import { IPagamentoRepository } from '../../../domain/repositories/i-pagamento.repository';
import { PagamentoRepositoryImpl } from '../../../infrastructure/database/repositories/pagamento.repository.impl';
import { PagamentoSchema } from '../../../infrastructure/database/schemas/pagamento.schema';
import { IPagamentoGateway } from '../../../infrastructure/gateways/pagamento.gateway';
import { StripePagamentoGatewayImpl } from '../../../infrastructure/gateways/stripe-pagamento.gateway.impl';
// { provide: 'IPagamentoRepository', useClass: PagamentoRepositoryImpl }
@Module({
  imports: [TypeOrmModule.forFeature([PagamentoSchema])],
  controllers: [PagamentoController],
  providers: [
    ProcessarPagamentoUseCase,
    ConsultarPagamentoUseCase,
    PagamentoService,
    { provide: 'IPagamentoRepository', useClass: PagamentoRepositoryImpl },
    { provide: IPagamentoGateway, useClass: StripePagamentoGatewayImpl }, // Implementação do gateway de pagamento
  ],
  exports: [],
})
export class PagamentoModule {}