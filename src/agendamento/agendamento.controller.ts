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
import { Agendamento } from './agendamento.interface';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Agendamentos')
@Controller('agendamentos')
export class AgendamentosController {
  constructor(private readonly service: AgendamentosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os agendamentos' })
  listar(): Agendamento[] {
    return this.service.listar();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar agendamento por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do agendamento',
    example: 1,
  })
  buscar(@Param('id') id: string): Agendamento {
    const agendamento = this.service.buscarPorId(Number(id));

    if (!agendamento) {
      throw new NotFoundException(`Agendamento com id ${id} não encontrado.`);
    }

    return agendamento;
  }

  @Post()
  @ApiOperation({ summary: 'Criar um novo agendamento' })
  @ApiBody({
    description: 'Dados do agendamento',
    schema: {
      example: {
        id: 1,
        paciente: 'João',
        medico: 'Dra Maria',
        data: '2026-04-10',
        horario: '14:00',
      },
    },
  })
  criar(@Body() agendamento: Agendamento): Agendamento {
    return this.service.criar(agendamento);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover agendamento' })
  @ApiParam({
    name: 'id',
    description: 'ID do agendamento',
    example: 1,
  })
  remover(@Param('id') id: string): Agendamento {
    const agendamento = this.service.remover(Number(id));

    if (!agendamento) {
      throw new NotFoundException(`Agendamento com id ${id} não encontrado.`);
    }

    return agendamento;
  }
}
