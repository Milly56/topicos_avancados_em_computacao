import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQHealthIndicator extends HealthIndicator {
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const url = process.env.RABBITMQ_URL ?? 'amqp://guest:guest@rabbitmq:5672';
    let channel: amqp.ChannelModel | null = null;

    try {
      channel = await amqp.connect(url);
      await channel.close();
      return this.getStatus(key, true);
    } catch (error) {
      if (channel) {
        try { await channel.close(); } catch { /* ignore */ }
      }
      throw new HealthCheckError(
        'RabbitMQ unavailable',
        this.getStatus(key, false, { error: (error as Error).message }),
      );
    }
  }
}
