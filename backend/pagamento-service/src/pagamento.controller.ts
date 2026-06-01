import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePagamentoDto } from './create-pagamento.dto';
import { PagamentoService } from './pagamento.service';

@ApiTags('pagamento')
@Controller('pagamento')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) {}

  @ApiOperation({ summary: 'Lista todos os pagamentos' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso' })
  @Get()
  async findAll() {
    return await this.pagamentoService.findAll();
  }

  @ApiOperation({ summary: 'Busca pagamento por ID' })
  @ApiResponse({ status: 200, description: 'Pagamento encontrado' })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.pagamentoService.findOne(id.toString());
  }

  @ApiOperation({ summary: 'Cria um pagamento' })
  @ApiResponse({ status: 201, description: 'Pagamento criado com sucesso' })
  @Post()
  async create(@Body() body: CreatePagamentoDto) {
    return await this.pagamentoService.create(body);
  }

  @ApiOperation({ summary: 'Remove um pagamento' })
  @ApiResponse({ status: 200, description: 'Pagamento removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.pagamentoService.remove(id.toString());
  }
}