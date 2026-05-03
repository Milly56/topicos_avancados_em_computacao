
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreatePacienteDto } from './create-paciente.dto';
import { Paciente } from '@prisma/client';

@Injectable()
export class PacienteService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Paciente[]> {
    return this.prisma.paciente.findMany();
  }

  async create(data: CreatePacienteDto, userId: string): Promise<Paciente> {
    return this.prisma.paciente.create({
      data: {
        ...data,
        user_id: userId,
      },
    });
  }

  async findById(id: string): Promise<Paciente> {
    const paciente = await this.prisma.paciente.findUnique({ where: { id } });

    if (!paciente) {
      throw new NotFoundException(`Paciente com id ${id} não encontrado`);
    }

    return paciente;
  }

  async delete(id: string): Promise<void> {
   
    try {
      await this.prisma.paciente.delete({ where: { id } });
    } catch {
      throw new NotFoundException(`Paciente com id ${id} não encontrado`);
    }
  }
}