import { NestFactory } from '@nestjs/core';
import { PacienteModule } from './paciente.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(PacienteModule);

  app.setGlobalPrefix('paciente');

  const config = new DocumentBuilder()
    .setTitle('Paciente API')
    .setDescription('API de pacientes')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('paciente/api', app, document);

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