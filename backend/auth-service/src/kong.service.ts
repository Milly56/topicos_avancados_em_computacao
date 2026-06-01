import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

function toAxiosError(err: unknown) {
  return err as Error & { response?: { status: number } };
}

@Injectable()
export class KongService {
  private readonly logger = new Logger(KongService.name);
  private readonly http: AxiosInstance;
  private readonly secret: string;

  constructor() {
    this.http = axios.create({
      baseURL: process.env.KONG_ADMIN_URL ?? 'http://kong:8001',
      timeout: 10_000,
    });
    this.secret = process.env.JWT_SECRET ?? 'segredo-super-seguro';
  }

  async registerConsumer(userId: string, role: string): Promise<void> {
    try {
      await this.http.put(`/consumers/${userId}`, {
        username: userId,
        custom_id: role,
      });
      this.logger.log(`Consumer criado no Kong: ${userId} (role: ${role})`);
    } catch (err) {
      const error = toAxiosError(err);
      this.logger.error(`Erro ao criar consumer ${userId}: ${error.message}`);
      throw error;
    }

    try {
      await this.http.post(`/consumers/${userId}/jwt`, {
        key: userId,
        algorithm: 'HS256',
        secret: this.secret,
      });
      this.logger.log(`Credencial JWT criada para consumer: ${userId}`);
    } catch (err) {
      const error = toAxiosError(err);
      if (error.response?.status === 409) {
        this.logger.warn(`Credencial JWT já existe para: ${userId}`);
        return;
      }
      this.logger.error(`Erro ao criar JWT credential para ${userId}: ${error.message}`);
      throw error;
    }
  }

  async deleteConsumer(userId: string): Promise<void> {
    try {
      await this.http.delete(`/consumers/${userId}`);
      this.logger.log(`Consumer removido do Kong: ${userId}`);
    } catch (err) {
      const error = toAxiosError(err);
      this.logger.warn(`Falha ao remover consumer ${userId}: ${error.message}`);
    }
  }

  async updateConsumerRole(userId: string, newRole: string): Promise<void> {
    try {
      await this.http.patch(`/consumers/${userId}`, { custom_id: newRole });
      this.logger.log(`Role atualizada no Kong para consumer ${userId}: ${newRole}`);
    } catch (err) {
      const error = toAxiosError(err);
      this.logger.error(`Erro ao atualizar role do consumer ${userId}: ${error.message}`);
      throw error;
    }
  }
}