import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ProfissionaisService } from './profissionais.service';
import { CreateProfissionalDto } from './create-profissionais.dto';

import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Profissionais')
@Controller('profissionais')
export class ProfissionaisController {
  constructor(private readonly service: ProfissionaisService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os profissionais' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso' })
  async listar() {
    return await this.service.listar();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar profissional por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do profissional',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Profissional encontrado' })
  @ApiResponse({ status: 404, description: 'Profissional não encontrado' })
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return await this.service.buscarPorId(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar um novo profissional' })
  @ApiResponse({ status: 201, description: 'Profissional criado com sucesso' })
  async criar(@Body() body: CreateProfissionalDto) {
    return await this.service.criar(body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover profissional' })
  @ApiParam({
    name: 'id',
    description: 'ID do profissional',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Profissional removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Profissional não encontrado' })
  async remover(@Param('id', ParseIntPipe) id: number) {
    return await this.service.remover(id);
  }
}