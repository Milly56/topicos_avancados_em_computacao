import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ProfissionaisService } from './profissionais.service';
import type { Profissional } from './profissionais.interface';

import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Profissionais')
@Controller('profissionais')
export class ProfissionaisController {
  constructor(private readonly service: ProfissionaisService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os profissionais' })
  listar() {
    return this.service.listar();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar profissional por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do profissional',
    example: 1,
  })
  buscar(@Param('id') id: string) {
    return this.service.buscarPorId(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Criar um novo profissional' })
  @ApiBody({
    description: 'Dados do profissional',
    schema: {
      example: {
        id: 1,
        nome: 'Dr João',
        especialidade: 'Cardiologia',
        telefone: '83999999999',
      },
    },
  })
  criar(@Body() profissional: Profissional) {
    return this.service.criar(profissional);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover profissional' })
  @ApiParam({
    name: 'id',
    description: 'ID do profissional',
    example: 1,
  })
  remover(@Param('id') id: string) {
    return this.service.remover(Number(id));
  }
}