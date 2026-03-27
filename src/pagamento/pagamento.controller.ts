import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreatePagamentoDto } from './create-pagamento.dto';
import { PagamentoService } from './pagamento.service';

@ApiTags('pagamento')
@Controller('pagamento')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) {}

  @ApiOperation({ summary: 'Lista todos os pagamentos' })
  @Get()
  findAll() {
    return this.pagamentoService.findAll();
  }

  @ApiOperation({ summary: 'Busca pagamento por ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagamentoService.findOne(id);
  }

  @ApiOperation({ summary: 'Cria um pagamento' })
  @Post()
  create(@Body() body: CreatePagamentoDto) {
    return this.pagamentoService.create(body);
  }

  @ApiOperation({ summary: 'Remove um pagamento' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagamentoService.remove(id);
  }
}
