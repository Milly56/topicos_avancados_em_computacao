import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgendamentoController } from '../../controllers/agendamento.controller';
import { CriarAgendamentoUseCase } from '../../../application/use-cases/criar-agendamento.use-case';
import { AgendamentoService } from '../../../domain/services/agendamento.service';
import { IAgendamentoRepository } from '../../../domain/repositories/i-agendamento.repository';
import { AgendamentoRepositoryImpl } from '../../../infrastructure/database/repositories/agendamento.repository.impl';
import { AgendamentoSchema } from '../../../infrastructure/database/schemas/agendamento.schema';

@Module({
  imports: [TypeOrmModule.forFeature([AgendamentoSchema])],
  controllers: [AgendamentoController],
  providers: [
    CriarAgendamentoUseCase,
    AgendamentoService,
    { provide: IAgendamentoRepository, useClass: AgendamentoRepositoryImpl },
  ],
  exports: [],
})
export class AgendamentoModule {}