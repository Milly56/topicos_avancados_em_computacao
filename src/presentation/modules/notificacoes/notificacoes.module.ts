import { Module } from '@nestjs/common';
import { NotificacoesGateway } from '../../../infrastructure/realtime/notificacoes.gateway';

@Module({
  providers: [NotificacoesGateway],
  exports: [NotificacoesGateway],
})
export class NotificacoesModule {}
