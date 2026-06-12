import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAgendamentoDto } from './create-agendamento.dto';

@Injectable()
export class AgendamentosService {
  constructor(private prisma: PrismaService) {}

  listar() {
    return this.prisma.agendamento.findMany({
      orderBy: { data: 'asc' },
      include: { profissional: true },
    });
  }

  buscarPorId(id: number) {
    return this.prisma.agendamento.findUnique({
      where: { id },
      include: { profissional: true },
    });
  }

  criar(dto: CreateAgendamentoDto) {
    return this.prisma.agendamento.create({
      data: {
        paciente: dto.paciente,
        profissionalId: dto.profissionalId,
        data: new Date(dto.data),
        horario: dto.horario,
      },
      include: { profissional: true },
    });
  }

  async remover(id: number) {
    try {
      return await this.prisma.agendamento.delete({
        where: { id },
      });
    } catch {
      return null;
    }
  }
}