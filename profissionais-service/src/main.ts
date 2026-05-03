import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ProfissionaisModule } from './profissionais.module';

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

  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();
