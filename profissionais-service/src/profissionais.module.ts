import { Module } from '@nestjs/common';
import { ProfissionaisController } from './profissionais.controller';
import { ProfissionaisService } from './profissionais.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProfissionaisController],
  providers: [ProfissionaisService],
})
export class ProfissionaisModule {}
