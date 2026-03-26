// Implementação concreta do repositório de Agendamentos usando um ORM (ex: TypeORM)
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agendamento } from '../../../domain/entities/agendamento.entity';
import { IAgendamentoRepository } from '../../../domain/repositories/i-agendamento.repository';
import { AgendamentoSchema } from '../schemas/agendamento.schema'; // Entidade do ORM

@Injectable()
export class AgendamentoRepositoryImpl implements IAgendamentoRepository {
  constructor(
    @InjectRepository(AgendamentoSchema)
    private readonly ormRepository: Repository<AgendamentoSchema>,
  ) {}

  public async save(agendamento: Agendamento): Promise<Agendamento> {
    const agendamentoSchema = this.ormRepository.create({
      id: agendamento.getId(),
      medicoId: agendamento.getMedicoId(),
      pacienteId: agendamento.getPacienteId(),
      dataHora: agendamento.getDataHora(),
      status: agendamento.getStatus(),
    });
    const saved = await this.ormRepository.save(agendamentoSchema);
    return new Agendamento(saved.medicoId, saved.pacienteId, saved.dataHora); // Reconstroi a entidade de domínio
  }

  public async findById(id: string): Promise<Agendamento | null> {
    const found = await this.ormRepository.findOne({ where: { id } });
    if (!found) return null;
    return new Agendamento(found.medicoId, found.pacienteId, found.dataHora);
  }

  public async findByMedicoAndData(medicoId: string, dataHora: Date): Promise<Agendamento | null> {
    const found = await this.ormRepository.findOne({ where: { medicoId, dataHora } });
    if (!found) return null;
    return new Agendamento(found.medicoId, found.pacienteId, found.dataHora);
  }
}