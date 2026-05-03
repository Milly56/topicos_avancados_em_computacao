import { NestFactory } from '@nestjs/core';
import { PacienteModule } from './paciente.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  await app.listen(3000);
}
bootstrap();