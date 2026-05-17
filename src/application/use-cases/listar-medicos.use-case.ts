import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MedicoService } from '../../domain/services/medico.service';
import { MedicoOutputDto } from '../dto/medico.dto';

const CACHE_KEY = 'medicos:all';

@Injectable()
export class ListarMedicosUseCase {
  constructor(
    private readonly medicoService: MedicoService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  public async execute(): Promise<MedicoOutputDto[]> {
    const cached = await this.cache.get<MedicoOutputDto[]>(CACHE_KEY);
    if (cached) return cached;

    const medicos = await this.medicoService.listarMedicos();
    const result = medicos.map(medico => ({
      id: medico.getId(),
      nome: medico.getNome(),
      especialidade: medico.getEspecialidade(),
      crm: medico.getCrm(),
    }));

    await this.cache.set(CACHE_KEY, result);
    return result;
  }
}
