import { NestFactory } from '@nestjs/core';
import { PacienteModule } from './paciente.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(PacienteModule);

  const config = new DocumentBuilder()
    .setTitle('Paciente API')
    .setDescription('API de pacientes')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('pacientes/api', app, document);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: parseInt(process.env.REDIS_PORT ?? '6379'),
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`
    ╔═══════════════════════════════════════════════╗
    ║   Paciente Service                             ║
    ║   HTTP:    http://localhost:${process.env.PORT ?? 3000}             ║
    ║   Swagger: http://localhost:${process.env.PORT ?? 3000}/pacientes/api ║
    ║   Redis:   ${process.env.REDIS_HOST ?? 'localhost'}:${process.env.REDIS_PORT ?? 6379}               ║
    ╚═══════════════════════════════════════════════╝
    `);
  });
}
bootstrap();