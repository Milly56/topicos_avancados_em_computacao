import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsService {
  private pacientesCadastrados = 0;

  incrementPacienteCadastrado() {
    this.pacientesCadastrados += 1;
  }

  getMetrics(): string {
    return [
      '# HELP pacientes_cadastrados_total Contador de pacientes cadastrados',
      '# TYPE pacientes_cadastrados_total counter',
      `pacientes_cadastrados_total ${this.pacientesCadastrados}`,
    ].join('\n');
  }
}
