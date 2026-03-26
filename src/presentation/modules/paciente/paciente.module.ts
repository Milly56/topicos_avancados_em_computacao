import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PacienteController } from "../../controllers/paciente.controller";
import { CriarPacienteUseCase } from "../../../application/use-cases/criar-paciente.use-case";
import { ListarPacientesUseCase } from "../../../application/use-cases/listar-pacientes.use-case";
import { PacienteService } from "../../../domain/services/paciente.service";
import { IPacienteRepository } from "../../../domain/repositories/i-paciente.repository";
import { PacienteRepositoryImpl } from "../../../infrastructure/database/repositories/paciente.repository.impl";
import { PacienteSchema } from "../../../infrastructure/database/schemas/paciente.schema";

@Module({
  imports: [TypeOrmModule.forFeature([PacienteSchema])],
  controllers: [PacienteController],
  providers: [
    CriarPacienteUseCase,
    ListarPacientesUseCase,
    PacienteService,
    { provide: IPacienteRepository, useClass: PacienteRepositoryImpl },
  ],
  exports: [],
})
export class PacienteModule {}