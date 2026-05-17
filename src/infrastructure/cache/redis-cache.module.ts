import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import KeyvRedis from '@keyv/redis';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        stores: [
          new KeyvRedis(process.env.REDIS_URL ?? 'redis://redis:6379'),
        ],
        ttl: 60 * 1000, // 60 segundos em ms
      }),
    }),
  ],
})
export class RedisCacheModule {}
