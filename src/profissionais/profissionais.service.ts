import { Injectable } from '@nestjs/common';
import { Profissional } from './profissionais.interface';

@Injectable()
export class ProfissionaisService {
  private profissionais: Profissional[] = [];

  listar(): Profissional[] {
    return this.profissionais;
  }

  buscarPorId(id: number): Profissional | undefined {
    return this.profissionais.find((p) => p.id === id);
  }

  criar(profissional: Profissional): Profissional {
    this.profissionais.push(profissional);
    return profissional;
  }

  remover(id: number) {
    this.profissionais = this.profissionais.filter((p) => p.id !== id);
  }
}