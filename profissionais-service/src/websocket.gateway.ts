import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { OnModuleDestroy, Logger } from '@nestjs/common'; 
import { Server, Socket } from 'socket.io';
import { RedisService } from './redis.service';
import { createClient } from 'redis';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class ProfissionaisWebSocketGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleDestroy
{
  @WebSocketServer() server!: Server;
  private logger = new Logger('WebSocketGateway');
  private redisSubscriber: any;
  private redisPublisher: any;

  constructor(private redisService: RedisService) {}

  async afterInit(server: Server) {
    this.logger.log('WebSocket initialized');
    await this.setupRedisPubSub();
  }

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
    client.emit('status', { message: 'Conectado ao servidor de eventos' });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  private async setupRedisPubSub() {
    try {

      const redisOptions = {
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
        },
      };

  
      this.redisSubscriber = createClient(redisOptions);

      this.redisSubscriber.on('error', (err: any) => {
        this.logger.error('Redis Subscriber error:', err);
      });

      this.redisSubscriber.on('connect', () => {
        this.logger.log('Redis Subscriber conectado');
      });

      this.redisPublisher = createClient(redisOptions);

      this.redisPublisher.on('error', (err: any) => {
        this.logger.error('Redis Publisher error:', err);
      });

      this.redisPublisher.on('connect', () => {
        this.logger.log('Redis Publisher conectado');
      });

      await this.redisSubscriber.connect();
      await this.redisPublisher.connect();

      const channels = [
        'profissional:criado',
        'profissional:atualizado',
        'profissional:deletado',
        'paciente:criado',
        'paciente:atualizado',
        'paciente:deletado',
      ];

      for (const channel of channels) {
        await this.redisSubscriber.subscribe(channel, (message: string) => {
          this.logger.debug(`Evento recebido em ${channel}`);
          try {
            const data = JSON.parse(message);

            this.server.emit(channel, {
              channel,
              data,
              timestamp: new Date().toISOString(),
            });

            this.server.emit('evento', {
              channel,
              data,
              timestamp: new Date().toISOString(),
            });
          } catch (err) {
            this.logger.error('Erro ao parsear mensagem:', err);
          }
        });
      }

      this.logger.log(`Inscrito em ${channels.length} canais de eventos`);
    } catch (err) {
      this.logger.error('Erro ao configurar Redis Pub/Sub:', err);
    }
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, data: { channel: string }) {
    this.logger.log(`Cliente ${client.id} inscrito em ${data.channel}`);
    client.join(data.channel);
    return { status: 'inscrito', channel: data.channel };
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, data: { channel: string }) {
    this.logger.log(`Cliente ${client.id} desinscrito de ${data.channel}`);
    client.leave(data.channel);
    return { status: 'desinscrito', channel: data.channel };
  }

  @SubscribeMessage('emit')
  handleEmit(client: Socket, data: any) {
    this.logger.log(`Evento emitido por ${client.id}`);
    this.server.emit('evento', data);
    return { status: 'emitido' };
  }

  async publishEvent(channel: string, data: any) {
    try {
      if (!this.redisPublisher) {
        this.logger.warn('Redis Publisher não inicializado');
        return;
      }

      await this.redisPublisher.publish(channel, JSON.stringify(data));
      this.logger.debug(`Evento publicado em ${channel}`);
    } catch (err) {
      this.logger.error('Erro ao publicar evento:', err);
    }
  }

  async onModuleDestroy() {
    this.logger.log('Desconectando Redis...');
    if (this.redisSubscriber) {
      await this.redisSubscriber.quit();
    }
    if (this.redisPublisher) {
      await this.redisPublisher.quit();
    }
  }
}