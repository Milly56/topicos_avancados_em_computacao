// Interface que define o contrato para o repositório de Médicos
import { Medico } from '../entities/medico.entity';

export interface IMedicoRepository {
  save(medico: Medico): Promise<Medico>;
  findById(id: string): Promise<Medico | null>;
  findByCrm(crm: string): Promise<Medico | null>;
  findAll(): Promise<Medico[]>;
  // Outros métodos de busca e manipulação
}
