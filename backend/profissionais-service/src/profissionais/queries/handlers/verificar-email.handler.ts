
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { VerificarEmailQuery } from '../impl/verificar-email.query';
import { PrismaService } from '../../../prisma/prisma.service';

@QueryHandler(VerificarEmailQuery)
export class VerificarEmailHandler implements IQueryHandler<VerificarEmailQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ email }: VerificarEmailQuery) {
    const profissional = await this.prisma.profissional.findUnique({
      where: { email },
      select: { id: true },
    });

    return { disponivel: !profissional };
  }
}