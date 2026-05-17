import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgendamentoModule } from './presentation/modules/agendamento/agendamento.module';
import { MedicoModule } from './presentation/modules/medico/medico.module';
import { PacienteModule } from './presentation/modules/paciente/paciente.module';
import { PagamentoModule } from './presentation/modules/pagamento/pagamento.module';
import { NotificacoesModule } from './presentation/modules/notificacoes/notificacoes.module';
import { RedisCacheModule } from './infrastructure/cache/redis-cache.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'db',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER ?? 'user',
      password: process.env.DB_PASSWORD ?? 'password',
      database: process.env.DB_NAME ?? 'mydatabase',
      entities: [__dirname + '/**/*.schema{.ts,.js}'],
      synchronize: true,
    }),
    RedisCacheModule,
    NotificacoesModule,
    AgendamentoModule,
    MedicoModule,
    PacienteModule,
    PagamentoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
