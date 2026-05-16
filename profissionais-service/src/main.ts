import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ProfissionaisModule } from './profissionais.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CustomIoAdapter } from './custom.io';

async function bootstrap() {
  const app = await NestFactory.create(ProfissionaisModule);

  app.useWebSocketAdapter(new CustomIoAdapter(app) as any); 

  app.setGlobalPrefix('profissionais');

  const config = new DocumentBuilder()
    .setTitle('Profissionais API')
    .setDescription('API de Profissionais com Redis Cache e WebSocket')
    .setVersion('1.0')
    .addTag('profissionais')
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
  await app.listen(process.env.PORT ?? 3005, () => {
    console.log(`
    ╔═══════════════════════════════════════════════╗
    ║   Profissionais Service                        ║
    ║   HTTP:      http://localhost:${process.env.PORT ?? 3005}           ║
    ║   WebSocket: ws://localhost:${process.env.PORT ?? 3005}             ║
    ║   Kong WS:   ws://localhost:8000 (path /ws)    ║
    ║   Swagger:   http://localhost:${process.env.PORT ?? 3005}/profissionais/api ║
    ║   Redis:     ${process.env.REDIS_HOST ?? 'localhost'}:${process.env.REDIS_PORT ?? 6379}              ║
    ╚═══════════════════════════════════════════════╝
    `);
  });
}

bootstrap();