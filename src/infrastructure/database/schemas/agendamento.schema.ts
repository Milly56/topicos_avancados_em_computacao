// Exemplo de schema para TypeORM (representa a tabela no banco de dados)
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('agendamentos')
export class AgendamentoSchema {
  @PrimaryColumn()
  id: string;

  @Column()
  medicoId: string;

  @Column()
  pacienteId: string;

  @Column()
  dataHora: Date;

  @Column()
  status: string;
}