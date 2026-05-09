
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateProfissionalDto } from './create-profissionais.dto';

@Injectable()
export class ProfissionaisService {
  constructor(private prisma: PrismaService) {}

  async listar() {
    return this.prisma.profissional.findMany();
  }

  async buscarPorId(id: string) {
    const profissional = await this.prisma.profissional.findUnique({
      where: { id },
    });

    if (!profissional) {
      throw new NotFoundException('Profissional não encontrado');
    }

    return profissional;
  }

  async criar(data: CreateProfissionalDto) {
    return this.prisma.profissional.create({
      data: {
        nome: data.nome,
        especialidade: data.especialidade,
        telefone: data.telefone
      },
    });
  }

  async remover(id: string) {
    await this.buscarPorId(id);

    return this.prisma.profissional.delete({
      where: { id },
    });
  }
}