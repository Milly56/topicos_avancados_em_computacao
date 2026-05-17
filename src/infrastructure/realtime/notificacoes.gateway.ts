import { Injectable, Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({ namespace: '/notificacoes', cors: { origin: '*' } })
export class NotificacoesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(NotificacoesGateway.name);

  @WebSocketServer()
  private server: Server;

  handleConnection(client: Socket): void {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket): void {
    client.emit('pong', { timestamp: new Date().toISOString() });
  }

  emitir(evento: string, dados: unknown): void {
    this.server.emit(evento, dados);
    this.logger.log(`Evento emitido: ${evento}`);
  }
}
