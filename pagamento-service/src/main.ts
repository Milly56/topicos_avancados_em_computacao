import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PagamentoModule } from './pagamento.module';

async function bootstrap() {
  const app = await NestFactory.create(PagamentoModule);

  const config = new DocumentBuilder()
    .setTitle('Paciente Service API')
    .setDescription('Documentação da API de pagamentos')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3008);
}
bootstrap();