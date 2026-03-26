// Caso de uso para listar todos os pacientes
import { Injectable } from "@nestjs/common";
import { PacienteService } from "../../domain/services/paciente.service";
import { PacienteOutputDto } from "../dtos/paciente.dto";

@Injectable()
export class ListarPacientesUseCase {
  constructor(private readonly pacienteService: PacienteService) {}

  public async execute(): Promise<PacienteOutputDto[]> {
    const pacientes = await this.pacienteService.listarPacientes();
    return pacientes.map(paciente => ({
      id: paciente.getId(),
      nome: paciente.getNome(),
      cpf: paciente.getCpf(),
      dataNascimento: paciente.getDataNascimento(),
    }));
  }
}