
import { Controller, Get, Post, Delete, Param, Body, Headers } from '@nestjs/common';
import { ProfissionaisService } from './profissionais.service';
import { CreateProfissionalDto } from './create-profissionais.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Profissionais')
@Controller('profissionais')
export class ProfissionaisController {
  constructor(private service: ProfissionaisService) {}

  @Get()
  @ApiOperation({ summary: 'Listar profissionais' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso' })
  listar() {
    return this.service.listar();
  }

  @Post()
  @ApiOperation({ summary: 'Criar profissional' })
  @ApiResponse({ status: 201, description: 'Profissional criado' })
  criar(
    @Body() body: CreateProfissionalDto,
    @Headers('x-consumer-username') userId: string,
  ) {
    return this.service.criar(body, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover profissional' })
  @ApiResponse({ status: 200, description: 'Removido com sucesso' })
  remover(@Param('id') id: string) {
    return this.service.remover(id);
  }
}