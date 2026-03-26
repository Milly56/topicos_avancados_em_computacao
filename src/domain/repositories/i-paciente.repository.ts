// Interface que define o contrato para o repositório de Pacientes
import { Paciente } from "../entities/paciente.entity";

export interface IPacienteRepository {
  save(paciente: Paciente): Promise<Paciente>;
  findById(id: string): Promise<Paciente | null>;
  findByCpf(cpf: string): Promise<Paciente | null>;
  findAll(): Promise<Paciente[]>;
  // Outros métodos de busca e manipulação
}