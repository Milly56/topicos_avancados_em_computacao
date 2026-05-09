import {
  IQueryHandler,
  QueryHandler,
} from '@nestjs/cqrs';

import { ProfissionaisService } from '../../profissionais.service';
import { ListarProfissionaisQuery } from '../impl/listar-profissionais.query';

@QueryHandler(ListarProfissionaisQuery)
export class ListarProfissionaisHandler
  implements IQueryHandler<ListarProfissionaisQuery>
{
  constructor(
    private readonly service: ProfissionaisService,
  ) {}

  async execute() {
    return this.service.listar();
  }
}