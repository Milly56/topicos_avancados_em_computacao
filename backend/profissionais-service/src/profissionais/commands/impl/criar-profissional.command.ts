import { CreateProfissionalDto } from '../../create-profissionais.dto';

export class CriarProfissionalCommand {
  constructor(
    public readonly data: CreateProfissionalDto,
  ) {}
}