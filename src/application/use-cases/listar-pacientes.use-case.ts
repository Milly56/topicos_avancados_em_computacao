import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PacienteService } from '../../domain/services/paciente.service';
import { PacienteOutputDto } from '../dto/paciente.dto';

const CACHE_KEY = 'pacientes:all';

@Injectable()
export class ListarPacientesUseCase {
  constructor(
    private readonly pacienteService: PacienteService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  public async execute(): Promise<PacienteOutputDto[]> {
    const cached = await this.cache.get<PacienteOutputDto[]>(CACHE_KEY);
    if (cached) return cached;

    const pacientes = await this.pacienteService.listarPacientes();
    const result = pacientes.map(paciente => ({
      id: paciente.getId(),
      nome: paciente.getNome(),
      cpf: paciente.getCpf(),
      dataNascimento: paciente.getDataNascimento(),
    }));

    await this.cache.set(CACHE_KEY, result);
    return result;
  }
}
