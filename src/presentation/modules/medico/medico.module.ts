import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoController } from '../../controllers/medico.controller';
import { CriarMedicoUseCase } from '../../../application/use-cases/criar-medico.use-case';
import { ListarMedicosUseCase } from '../../../application/use-cases/listar-medicos.use-case';
import { MedicoService } from '../../../domain/services/medico.service';
import { IMedicoRepository } from '../../../domain/repositories/i-medico.repository';
import { MedicoRepositoryImpl } from '../../../infrastructure/database/repositories/medico.repository.impl';
import { MedicoSchema } from '../../../infrastructure/database/schemas/medico.schema';

@Module({
  imports: [TypeOrmModule.forFeature([MedicoSchema])],
  controllers: [MedicoController],
  providers: [
    CriarMedicoUseCase,
    ListarMedicosUseCase,
    MedicoService,
    { provide: IMedicoRepository, useClass: MedicoRepositoryImpl },
  ],
  exports: [],
})
export class MedicoModule {}