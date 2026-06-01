import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { KongService } from './kong.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly kong: KongService,
  ) {}

  async register(data: { email: string; password: string; role: Role }) {
    const exists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (exists) {
      throw new ConflictException('Email já cadastrado');
    }

    const hash = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hash,
        role: data.role,
      },
    });

    await this.kong.registerConsumer(user.id, user.role);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const match = await bcrypt.compare(data.password, user.password);

    if (!match) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      sub: user.id,
      role: user.role,
      iss: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}