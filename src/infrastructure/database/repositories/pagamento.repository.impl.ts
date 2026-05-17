import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagamento } from '../../../domain/entities/pagamento.entity';
import { IPagamentoRepository } from '../../../domain/repositories/i-pagamento.repository';
import { PagamentoSchema } from '../schemas/pagamento.schema';

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
    return this.toEntity(saved);
  }

  public async findById(id: string): Promise<Pagamento | null> {
    const found = await this.ormRepository.findOne({ where: { id } });
    if (!found) return null;
    return this.toEntity(found);
  }

  public async findByAgendamentoId(agendamentoId: string): Promise<Pagamento | null> {
    const found = await this.ormRepository.findOne({ where: { agendamentoId } });
    if (!found) return null;
    return this.toEntity(found);
  }

  private toEntity(schema: PagamentoSchema): Pagamento {
    return Pagamento.reconstituir(
      schema.id,
      schema.agendamentoId,
      schema.valor,
      schema.metodoPagamento,
      schema.status as 'pendente' | 'aprovado' | 'recusado' | 'estornado',
      schema.dataPagamento,
    );
  }
}
