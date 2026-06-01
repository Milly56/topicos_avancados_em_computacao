import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  app.setGlobalPrefix('auth');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('API de autenticação com JWT')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('auth/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();