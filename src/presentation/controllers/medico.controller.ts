// Controlador NestJS para médicos
import { Controller, Post, Body, Get } from '@nestjs/common';
import { CriarMedicoUseCase } from '../../application/use-cases/criar-medico.use-case';
import { ListarMedicosUseCase } from '../../application/use-cases/listar-medicos.use-case';
import { CriarMedicoRequestDto, MedicoResponseDto } from '../dtos/medico.request.dto';
import { MedicoOutputDto } from '../../application/dtos/medico.dto';

@Controller('medicos')
export class MedicoController {
  constructor(
    private readonly criarMedicoUseCase: CriarMedicoUseCase,
    private readonly listarMedicosUseCase: ListarMedicosUseCase,
  ) {}

  @Post()
  public async criarMedico(@Body() input: CriarMedicoRequestDto): Promise<MedicoResponseDto> {
    const medicoDto: MedicoOutputDto = await this.criarMedicoUseCase.execute(input);
    return medicoDto; // Mapeamento direto para o DTO de resposta
  }

  @Get()
  public async listarMedicos(): Promise<MedicoResponseDto[]> {
    const medicosDto: MedicoOutputDto[] = await this.listarMedicosUseCase.execute();
    return medicosDto;
  }
}