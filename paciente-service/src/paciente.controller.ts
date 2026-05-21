import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Headers,
  Header,
} from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { CreatePacienteDto } from './create-paciente.dto';
import { UpdatePacienteDto } from './update-paciente.dto';
import { MarcarConsultaDto } from './marcar-consulta.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

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
    @Headers('x-correlation-id') correlationId: string,
  ) {
    return this.pacienteService.create(body, userId, correlationId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar paciente' })
  @ApiParam({ name: 'id', example: 'uuid-123' })
  @ApiBody({ type: UpdatePacienteDto })
  update(
    @Param('id') id: string,
    @Body() body: UpdatePacienteDto,
    @Headers('x-consumer-username') userId: string,
    @Headers('x-correlation-id') correlationId: string,
  ) {
    return this.pacienteService.update(id, body, userId, correlationId);
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check do banco de dados' })
  health() {
    return this.pacienteService.checkHealth();
  }

  @Get('metrics')
  @Header('Content-Type', 'text/plain; version=0.0.4')
  @ApiOperation({ summary: 'Métricas do serviço de pacientes' })
  metrics() {
    return this.pacienteService.getMetrics();
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

  @Post(':id/consulta')
  @ApiOperation({ summary: 'Marcar consulta para paciente' })
  @ApiParam({ name: 'id', example: 'uuid-123' })
  @ApiBody({ type: MarcarConsultaDto })
  marcarConsulta(
    @Param('id') id: string,
    @Body() body: MarcarConsultaDto,
    @Headers('x-consumer-username') userId: string,
  ) {
    return this.pacienteService.marcarConsulta(id, body, userId);
  }
}
