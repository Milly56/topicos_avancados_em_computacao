// Serviço de domínio que contém lógica de negócio que envolve a entidade Paciente
import { Paciente } from "../entities/paciente.entity";
import { IPacienteRepository } from "../repositories/i-paciente.repository";

export class PacienteService {
  constructor(private readonly pacienteRepository: IPacienteRepository) {}

  public async criarPaciente(nome: string, cpf: string, dataNascimento: Date): Promise<Paciente> {
    const pacienteExistente = await this.pacienteRepository.findByCpf(cpf);
    if (pacienteExistente) {
      throw new Error("Paciente com este CPF já cadastrado.");
    }
    const novoPaciente = new Paciente(nome, cpf, dataNascimento);
    return this.pacienteRepository.save(novoPaciente);
  }

  public async buscarPacientePorId(id: string): Promise<Paciente | null> {
    return this.pacienteRepository.findById(id);
  }

  public async listarPacientes(): Promise<Paciente[]> {
    return this.pacienteRepository.findAll();
  }
}