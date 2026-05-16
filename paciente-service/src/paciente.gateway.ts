import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/paciente', cors: { origin: '*' } })
export class PacienteGateway {
  @WebSocketServer()
  server: Server;

  emitPacienteCriado(paciente: any) {
    this.server?.emit('paciente.criado', paciente);
  }

  emitPacienteRemovido(id: string) {
    this.server?.emit('paciente.removido', { id });
  }

  emitPacienteMarcarConsulta(payload: any) {
    this.server?.emit('paciente.marcar_consulta', payload);
  }
}
