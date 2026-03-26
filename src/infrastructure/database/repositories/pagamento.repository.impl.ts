// Implementação concreta do repositório de Pagamentos usando um ORM (ex: TypeORM)
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagamento } from '../../../domain/entities/pagamento.entity';
import { IPagamentoRepository } from '../../../domain/repositories/i-pagamento.repository';
import { PagamentoSchema } from '../schemas/pagamento.schema'; // Entidade do ORM

@Injectable()
export class PagamentoRepositoryImpl implements IPagamentoRepository {
  constructor(
    @InjectRepository(PagamentoSchema)
    private readonly ormRepository: Repository<PagamentoSchema>,
  ) {}

  public async save(pagamento: Pagamento): Promise<Pagamento> {
    const pagamentoSchema = this.ormRepository.create({
      id: pagamento.getId(),
      agendamentoId: pagamento.getAgendamentoId(),
      valor: pagamento.getValor(),
      status: pagamento.getStatus(),
      metodoPagamento: pagamento.getMetodoPagamento(),
      dataPagamento: pagamento.getDataPagamento(),
    });
    const saved = await this.ormRepository.save(pagamentoSchema);
    return new Pagamento(saved.agendamentoId, saved.valor, saved.metodoPagamento);
  }

  public async findById(id: string): Promise<Pagamento | null> {
    const found = await this.ormRepository.findOne({ where: { id } });
    if (!found) return null;
    return new Pagamento(found.agendamentoId, found.valor, found.metodoPagamento);
  }

  public async findByAgendamentoId(agendamentoId: string): Promise<Pagamento | null> {
    const found = await this.ormRepository.findOne({ where: { agendamentoId } });
    if (!found) return null;
    return new Pagamento(found.agendamentoId, found.valor, found.metodoPagamento);
  }
}