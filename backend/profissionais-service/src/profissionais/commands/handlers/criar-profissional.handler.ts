import {
  CommandHandler,
  ICommandHandler,
} from '@nestjs/cqrs';

import { ProfissionaisService } from '../../profissionais.service';

import { CriarProfissionalCommand } from '../impl/criar-profissional.command';

@CommandHandler(CriarProfissionalCommand)
export class CriarProfissionalHandler
  implements ICommandHandler<CriarProfissionalCommand>
{
  constructor(
    private readonly service: ProfissionaisService,
  ) {}

  async execute(command: CriarProfissionalCommand) {
    return this.service.criar(
      command.data,
    );
  }
}