import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Headers,
} from '@nestjs/common';

import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { CreateProfissionalDto } from './create-profissionais.dto';

import { CriarProfissionalCommand } from './commands/impl/criar-profissional.command';
import { RemoverProfissionalCommand } from './commands/impl/remover-profissional.command';

import { ListarProfissionaisQuery } from './queries/impl/listar-profissionais.query';

@ApiTags('Profissionais')
@Controller('profissionais')
export class ProfissionaisController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar profissionais' })
  @ApiResponse({
    status: 200,
    description: 'Lista retornada com sucesso',
  })
  listar() {
    return this.queryBus.execute(
      new ListarProfissionaisQuery(),
    );
  }

  @Post()
  @ApiOperation({ summary: 'Criar profissional' })
  @ApiResponse({
    status: 201,
    description: 'Profissional criado',
  })
  criar(
    @Body() body: CreateProfissionalDto,
  ) {
    return this.commandBus.execute(
      new CriarProfissionalCommand(
        body,
      ),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover profissional' })
  @ApiResponse({
    status: 200,
    description: 'Removido com sucesso',
  })
  remover(@Param('id') id: string) {
    return this.commandBus.execute(
      new RemoverProfissionalCommand(id),
    );
  }
}