import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from './prisma.module';
import { KongService } from './kong.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'segredo-super-seguro',
      signOptions: { expiresIn: '1d' },
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService,KongService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}