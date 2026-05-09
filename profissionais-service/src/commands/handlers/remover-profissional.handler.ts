import {
  CommandHandler,
  ICommandHandler,
} from '@nestjs/cqrs';

import { NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma.service';
import { RemoverProfissionalCommand } from '../impl/remover-profissional.command';

@CommandHandler(RemoverProfissionalCommand)
export class RemoverProfissionalHandler
  implements ICommandHandler<RemoverProfissionalCommand>
{
  constructor(
    private prisma: PrismaService,
  ) {}

  async execute(command: RemoverProfissionalCommand) {

    const profissional =
      await this.prisma.profissional.findUnique({
        where: {
          id: command.id,
        },
      });

    if (!profissional) {
      throw new NotFoundException(
        'Profissional não encontrado',
      );
    }

    return this.prisma.profissional.delete({
      where: {
        id: command.id,
      },
    });
  }
}