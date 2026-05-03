import { NestFactory } from '@nestjs/core';
import { AgendamentoModule } from './agendamento.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AgendamentoModule);

  const config = new DocumentBuilder()
    .setTitle('API de Agendamentos')
    .setDescription('Documentação da API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();