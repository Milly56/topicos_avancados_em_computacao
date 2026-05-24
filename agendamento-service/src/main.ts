import { NestFactory } from '@nestjs/core';
import { AgendamentoModule } from './agendamento.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppLoggerService } from './infrastructure/logging/app-logger.service.js';

async function bootstrap() {
  const app = await NestFactory.create(AgendamentoModule, { bufferLogs: true });

  const logger = app.get(AppLoggerService);
  app.useLogger(logger);

  const config = new DocumentBuilder()
    .setTitle('API de Agendamentos')
    .setDescription('Documentação da API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);

  const url = await app.getUrl();
  logger.log(`Swagger disponível em: ${url}/api`, 'Bootstrap');
  logger.log(`Metrics disponível em: ${url}/metrics`, 'Bootstrap');
  logger.log(`Health disponível em: ${url}/health`, 'Bootstrap');
}

bootstrap();
