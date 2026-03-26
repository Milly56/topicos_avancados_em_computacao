// Implementação concreta do repositório de Médicos usando um ORM (ex: TypeORM)
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medico } from '../../../domain/entities/medico.entity';
import { IMedicoRepository } from '../../../domain/repositories/i-medico.repository';
import { MedicoSchema } from '../schemas/medico.schema'; // Entidade do ORM

@Injectable()
export class MedicoRepositoryImpl implements IMedicoRepository {
  constructor(
    @InjectRepository(MedicoSchema)
    private readonly ormRepository: Repository<MedicoSchema>,
  ) {}

  public async save(medico: Medico): Promise<Medico> {
    const medicoSchema = this.ormRepository.create({
      id: medico.getId(),
      nome: medico.getNome(),
      especialidade: medico.getEspecialidade(),
      crm: medico.getCrm(),
    });
    const saved = await this.ormRepository.save(medicoSchema);
    return new Medico(saved.nome, saved.especialidade, saved.crm);
  }

  public async findById(id: string): Promise<Medico | null> {
    const found = await this.ormRepository.findOne({ where: { id } });
    if (!found) return null;
    return new Medico(found.nome, found.especialidade, found.crm);
  }

  public async findByCrm(crm: string): Promise<Medico | null> {
    const found = await this.ormRepository.findOne({ where: { crm } });
    if (!found) return null;
    return new Medico(found.nome, found.especialidade, found.crm);
  }

  public async findAll(): Promise<Medico[]> {
    const found = await this.ormRepository.find();
    return found.map(medicoSchema => new Medico(medicoSchema.nome, medicoSchema.especialidade, medicoSchema.crm));
  }
}