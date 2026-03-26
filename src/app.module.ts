import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgendamentoModule } from './presentation/modules/agendamento/agendamento.module';
import { MedicoModule } from './presentation/modules/medico/medico.module';
import { PacienteModule } from './presentation/modules/paciente/paciente.module';
import { PagamentoModule } from './presentation/modules/pagamento/pagamento.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'mydatabase',
      entities: [__dirname + '/**/*.schema{.ts,.js}'], // Inclui todos os schemas
      synchronize: true, // Apenas para desenvolvimento, não usar em produção
    }),
    AgendamentoModule,
    MedicoModule,
    PacienteModule,
    PagamentoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}