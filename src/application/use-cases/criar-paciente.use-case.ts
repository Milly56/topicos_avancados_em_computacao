// Caso de uso para criar um novo paciente
import { Injectable } from "@nestjs/common";
import { PacienteService } from "../../domain/services/paciente.service";
import { CriarPacienteDto, PacienteOutputDto } from "../dtos/paciente.dto";

@Injectable()
export class CriarPacienteUseCase {
  constructor(private readonly pacienteService: PacienteService) {}

  public async execute(input: CriarPacienteDto): Promise<PacienteOutputDto> {
    const paciente = await this.pacienteService.criarPaciente(
      input.nome,
      input.cpf,
      input.dataNascimento,
    );
    return {
      id: paciente.getId(),
      nome: paciente.getNome(),
      cpf: paciente.getCpf(),
      dataNascimento: paciente.getDataNascimento(),
    };
  }
}