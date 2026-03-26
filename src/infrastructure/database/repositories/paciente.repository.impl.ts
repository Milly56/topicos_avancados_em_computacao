// Implementação concreta do repositório de Pacientes usando um ORM (ex: TypeORM)
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Paciente } from "../../../domain/entities/paciente.entity";
import { IPacienteRepository } from "../../../domain/repositories/i-paciente.repository";
import { PacienteSchema } from "../schemas/paciente.schema"; // Entidade do ORM

@Injectable()
export class PacienteRepositoryImpl implements IPacienteRepository {
  constructor(
    @InjectRepository(PacienteSchema)
    private readonly ormRepository: Repository<PacienteSchema>,
  ) {}

  public async save(paciente: Paciente): Promise<Paciente> {
    const pacienteSchema = this.ormRepository.create({
      id: paciente.getId(),
      nome: paciente.getNome(),
      cpf: paciente.getCpf(),
      dataNascimento: paciente.getDataNascimento(),
    });
    const saved = await this.ormRepository.save(pacienteSchema);
    return new Paciente(saved.nome, saved.cpf, saved.dataNascimento);
  }

  public async findById(id: string): Promise<Paciente | null> {
    const found = await this.ormRepository.findOne({ where: { id } });
    if (!found) return null;
    return new Paciente(found.nome, found.cpf, found.dataNascimento);
  }

  public async findByCpf(cpf: string): Promise<Paciente | null> {
    const found = await this.ormRepository.findOne({ where: { cpf } });
    if (!found) return null;
    return new Paciente(found.nome, found.cpf, found.dataNascimento);
  }

  public async findAll(): Promise<Paciente[]> {
    const found = await this.ormRepository.find();
    return found.map(pacienteSchema => new Paciente(pacienteSchema.nome, pacienteSchema.cpf, pacienteSchema.dataNascimento));
  }
}