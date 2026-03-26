// Exemplo de schema para TypeORM (representa a tabela no banco de dados)
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('pagamentos')
export class PagamentoSchema {
  @PrimaryColumn()
  id: string;

  @Column()
  agendamentoId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor: number;

  @Column()
  status: string;

  @Column()
  metodoPagamento: string;

  @Column({ type: 'timestamp' })
  dataPagamento: Date;
}