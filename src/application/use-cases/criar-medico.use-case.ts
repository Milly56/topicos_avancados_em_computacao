import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MedicoService } from '../../domain/services/medico.service';
import { CriarMedicoDto, MedicoOutputDto } from '../dto/medico.dto';

@Injectable()
export class CriarMedicoUseCase {
  constructor(
    private readonly medicoService: MedicoService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  public async execute(input: CriarMedicoDto): Promise<MedicoOutputDto> {
    const medico = await this.medicoService.criarMedico(
      input.nome,
      input.especialidade,
      input.crm,
    );

    await this.cache.del('medicos:all');

    return {
      id: medico.getId(),
      nome: medico.getNome(),
      especialidade: medico.getEspecialidade(),
      crm: medico.getCrm(),
    };
  }
}
