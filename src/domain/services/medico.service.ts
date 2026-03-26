// Serviço de domínio que contém lógica de negócio que envolve a entidade Medico
import { Medico } from '../entities/medico.entity';
import { IMedicoRepository } from '../repositories/i-medico.repository';

export class MedicoService {
  constructor(private readonly medicoRepository: IMedicoRepository) {}

  public async criarMedico(nome: string, especialidade: string, crm: string): Promise<Medico> {
    const medicoExistente = await this.medicoRepository.findByCrm(crm);
    if (medicoExistente) {
      throw new Error("Médico com este CRM já cadastrado.");
    }
    const novoMedico = new Medico(nome, especialidade, crm);
    return this.medicoRepository.save(novoMedico);
  }

  public async buscarMedicoPorId(id: string): Promise<Medico | null> {
    return this.medicoRepository.findById(id);
  }

  public async listarMedicos(): Promise<Medico[]> {
    return this.medicoRepository.findAll();
  }
}