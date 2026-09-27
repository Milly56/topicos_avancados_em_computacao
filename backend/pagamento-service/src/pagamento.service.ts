import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreatePagamentoDto } from './create-pagamento.dto';

@Injectable()
export class PagamentoService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.pagamento.findMany();
  }

  async findOne(id: string) {
    const pagamento = await this.prisma.pagamento.findUnique({
      where: { id: Number(id) },
    });

    if (!pagamento) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    return pagamento;
  }

  async create(data: CreatePagamentoDto) {
    return this.prisma.pagamento.create({
      data: {
        valor: data.valor,
        descricao: data.descricao,
        dataPagamento: new Date(data.dataPagamento),
        status: data.status,
      },
    });
  }

  async remove(id: string) {
    const pagamento = await this.findOne(id);

    return this.prisma.pagamento.delete({
      where: { id: pagamento.id },
    });
  }
}