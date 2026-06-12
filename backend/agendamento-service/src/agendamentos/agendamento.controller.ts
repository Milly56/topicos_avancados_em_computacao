import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { AgendamentosService } from './agendamento.service';
import { CreateAgendamentoDto } from './create-agendamento.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Agendamentos')
@Controller('agendamentos')
export class AgendamentosController {
  constructor(private readonly service: AgendamentosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os agendamentos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de agendamentos',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          paciente: { type: 'string', example: 'João Silva' },
          profissionalId: { type: 'string', example: 'prof-uuid-123' },
          data: { type: 'string', format: 'date-time', example: '2026-06-15T00:00:00.000Z' },
          horario: { type: 'string', example: '14:30' },
        },
      },
    },
  })
  listar() {
    return this.service.listar();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar agendamento por ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Agendamento encontrado',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        paciente: { type: 'string', example: 'João Silva' },
        profissionalId: { type: 'string', example: 'prof-uuid-123' },
        data: { type: 'string', format: 'date-time', example: '2026-06-15T00:00:00.000Z' },
        horario: { type: 'string', example: '14:30' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Não encontrado' })
  async buscar(@Param('id') id: string) {
    const agendamento = await this.service.buscarPorId(Number(id));

    if (!agendamento) {
      throw new NotFoundException(`Agendamento com id ${id} não encontrado.`);
    }

    return agendamento;
  }

  @Post()
  @ApiOperation({ summary: 'Criar um novo agendamento' })
  @ApiBody({ type: CreateAgendamentoDto })
  @ApiResponse({
    status: 201,
    description: 'Agendamento criado',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        paciente: { type: 'string', example: 'João Silva' },
        profissionalId: { type: 'string', example: 'prof-uuid-123' },
        data: { type: 'string', format: 'date-time', example: '2026-06-15T00:00:00.000Z' },
        horario: { type: 'string', example: '14:30' },
      },
    },
  })
  criar(@Body() body: CreateAgendamentoDto) {
    return this.service.criar(body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover agendamento' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Agendamento removido',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        paciente: { type: 'string', example: 'João Silva' },
        profissionalId: { type: 'string', example: 'prof-uuid-123' },
        data: { type: 'string', format: 'date-time', example: '2026-06-15T00:00:00.000Z' },
        horario: { type: 'string', example: '14:30' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Não encontrado' })
  async remover(@Param('id') id: string) {
    const agendamento = await this.service.remover(Number(id));

    if (!agendamento) {
      throw new NotFoundException(`Agendamento com id ${id} não encontrado.`);
    }

    return agendamento;
  }
}