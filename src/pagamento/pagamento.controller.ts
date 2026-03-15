import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreatePagamentoDto } from './create-pagamento.dto';

constructor(private pagamentoService: PagamentoService) {}

@ApiTags('pagamento')
@Controller('pagamento')
export class PagamentoController {

  @ApiOperation({ summary: 'Lista todos os pagamentos' })
  @Get()
  findAll() {
    return this.pagamentoService.findAll();
  }

  @ApiOperation({ summary: 'Busca pagamento por ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id };
  }

  @ApiOperation({ summary: 'Cria um pagamento' })
  @Post()
  create(@Body() body: CreatePagamentoDto) {
    return body;
  }

  @ApiOperation({ summary: 'Remove um pagamento' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return { deleted: id };
  }
}