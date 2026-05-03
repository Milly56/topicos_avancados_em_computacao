
import { Body, Controller, Delete, Get, Param, Post, Headers } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { CreatePacienteDto } from './create-paciente.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Paciente')
@Controller('paciente')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os pacientes' })
  findAll() {
    return this.pacienteService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Criar paciente' })
  @ApiBody({ type: CreatePacienteDto })
  create(
    @Body() body: CreatePacienteDto,
    @Headers('x-consumer-username') userId: string,
  ) {
    return this.pacienteService.create(body, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar paciente por ID' })
  @ApiParam({ name: 'id', example: 'uuid-123' })
  findById(@Param('id') id: string) {
    return this.pacienteService.findById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar paciente' })
  @ApiParam({ name: 'id', example: 'uuid-123' })
  delete(@Param('id') id: string) {
    return this.pacienteService.delete(id);
  }
}