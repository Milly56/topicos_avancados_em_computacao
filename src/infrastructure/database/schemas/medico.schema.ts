// Exemplo de schema para TypeORM (representa a tabela no banco de dados)
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('medicos')
export class MedicoSchema {
  @PrimaryColumn()
  id: string;

  @Column()
  nome: string;

  @Column()
  especialidade: string;

  @Column({ unique: true })
  crm: string;
}