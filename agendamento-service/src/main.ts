import { NestFactory } from '@nestjs/core';
import { AgendamentoModule } from './agendamento.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AgendamentoModule);

  const config = new DocumentBuilder()
    .setTitle('API de Agendamentos')
    .setDescription('Documentação da API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('agendamento/api', app, document);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST ?? 'localhost',       
      port: parseInt(process.env.REDIS_PORT ?? '6379'),  
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();