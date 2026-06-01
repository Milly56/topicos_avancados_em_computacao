import { Module } from '@nestjs/common';
import { AppController } from './notificacao.controller';
import { AppService } from './notificacao.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
