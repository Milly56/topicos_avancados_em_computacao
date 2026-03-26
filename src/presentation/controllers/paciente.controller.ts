// Controlador NestJS para pacientes
import { Controller, Post, Body, Get } from "@nestjs/common";
import { CriarPacienteUseCase } from "../../application/use-cases/criar-paciente.use-case";
import { ListarPacientesUseCase } from "../../application/use-cases/listar-pacientes.use-case";
import { CriarPacienteRequestDto, PacienteResponseDto } from "../dtos/paciente.request.dto";
import { PacienteOutputDto } from "../../application/dtos/paciente.dto";

@Controller("pacientes")
export class PacienteController {
  constructor(
    private readonly criarPacienteUseCase: CriarPacienteUseCase,
    private readonly listarPacientesUseCase: ListarPacientesUseCase,
  ) {}

  @Post()
  public async criarPaciente(@Body() input: CriarPacienteRequestDto): Promise<PacienteResponseDto> {
    const pacienteDto: PacienteOutputDto = await this.criarPacienteUseCase.execute({
      nome: input.nome,
      cpf: input.cpf,
      dataNascimento: new Date(input.dataNascimento),
    });
    return pacienteDto; // Mapeamento direto para o DTO de resposta
  }

  @Get()
  public async listarPacientes(): Promise<PacienteResponseDto[]> {
    const pacientesDto: PacienteOutputDto[] = await this.listarPacientesUseCase.execute();
    return pacientesDto;
  }
}