// DTO de entrada para o caso de uso de criação de agendamento
export class CriarAgendamentoDto {
  medicoId: string;
  pacienteId: string;
  dataHora: Date;
}

// DTO de saída (opcional, pode ser a própria entidade de domínio ou um DTO mais simples)
export class AgendamentoOutputDto {
  id: string;
  medicoId: string;
  pacienteId: string;
  dataHora: Date;
  status: string;
}