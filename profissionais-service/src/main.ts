import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ProfissionaisModule } from './profissionais.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ProfissionaisModule);

  app.setGlobalPrefix('profissionais');

  const config = new DocumentBuilder()
    .setTitle('Profissionais API')
    .setDescription('Documentação da API de profissionais')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('profissionais/api', app, document);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: parseInt(process.env.REDIS_PORT ?? '6379'),
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();