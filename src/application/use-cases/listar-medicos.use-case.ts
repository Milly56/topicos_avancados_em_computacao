// Caso de uso para listar todos os médicos
import { Injectable } from '@nestjs/common';
import { MedicoService } from '../../domain/services/medico.service';
import { MedicoOutputDto } from '../dtos/medico.dto';

@Injectable()
export class ListarMedicosUseCase {
  constructor(private readonly medicoService: MedicoService) {}

  public async execute(): Promise<MedicoOutputDto[]> {
    const medicos = await this.medicoService.listarMedicos();
    return medicos.map(medico => ({
      id: medico.getId(),
      nome: medico.getNome(),
      especialidade: medico.getEspecialidade(),
      crm: medico.getCrm(),
    }));
  }
}