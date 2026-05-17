import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('pacientes')
export class PacienteSchema {
  @PrimaryColumn()
  id: string;

  @Column()
  nome: string;

  @Column({ unique: true })
  cpf: string;

  @Column({ type: 'date' })
  dataNascimento: Date;
}
