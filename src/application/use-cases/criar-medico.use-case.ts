// Caso de uso para criar um novo médico
import { Injectable } from '@nestjs/common';
import { MedicoService } from '../../domain/services/medico.service';
import { CriarMedicoDto, MedicoOutputDto } from '../dtos/medico.dto';

@Injectable()
export class CriarMedicoUseCase {
  constructor(private readonly medicoService: MedicoService) {}

  public async execute(input: CriarMedicoDto): Promise<MedicoOutputDto> {
    const medico = await this.medicoService.criarMedico(
      input.nome,
      input.especialidade,
      input.crm,
    );
    return {
      id: medico.getId(),
      nome: medico.getNome(),
      especialidade: medico.getEspecialidade(),
      crm: medico.getCrm(),
    };
  }
}