import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PacienteService } from '../../domain/services/paciente.service';
import { CriarPacienteDto, PacienteOutputDto } from '../dto/paciente.dto';

@Injectable()
export class CriarPacienteUseCase {
  constructor(
    private readonly pacienteService: PacienteService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  public async execute(input: CriarPacienteDto): Promise<PacienteOutputDto> {
    const paciente = await this.pacienteService.criarPaciente(
      input.nome,
      input.cpf,
      input.dataNascimento,
    );

    await this.cache.del('pacientes:all');

    return {
      id: paciente.getId(),
      nome: paciente.getNome(),
      cpf: paciente.getCpf(),
      dataNascimento: paciente.getDataNascimento(),
    };
  }
}
