import { Injectable, NotFoundException } from '@nestjs/common';
import { Paciente } from './paciente.interface';
import { v4 as uuidv4 } from 'uuid'; // para gerar IDs únicos

@Injectable()
export class PacienteService {
  private pacientes: Paciente[] = [];

  // Listar todos os pacientes
  findAll(): Paciente[] {
    return this.pacientes;
  }

  // Criar um paciente
  create(paciente: Omit<Paciente, 'id'>): Paciente {
    const newPaciente: Paciente = { id: uuidv4(), ...paciente };
    this.pacientes.push(newPaciente);
    return newPaciente;
  }

  // Buscar paciente por ID
  findById(id: string): Paciente {
    const paciente = this.pacientes.find(p => p.id === id);
    if (!paciente) {
      throw new NotFoundException(`Paciente com id ${id} não encontrado`);
    }
    return paciente;
  }

  // Deletar paciente por ID
  delete(id: string): void {
    const index = this.pacientes.findIndex(p => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Paciente com id ${id} não encontrado`);
    }
    this.pacientes.splice(index, 1);
  }
}