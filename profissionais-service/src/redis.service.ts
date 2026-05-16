import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

interface RedisStore {
  keys(pattern?: string): Promise<string[]>;
}

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.cacheManager.get<T>(key);
    return value ?? null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async reset(): Promise<void> {
    const store = this.cacheManager.stores[0] as unknown as RedisStore;
    if (typeof store.keys === 'function') {
      const keys = await store.keys();
      await Promise.all(keys.map(key => this.cacheManager.del(key)));
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const store = this.cacheManager.stores[0] as unknown as RedisStore;
    if (typeof store.keys === 'function') {
      const keys = await store.keys();
      const matchingKeys = keys.filter(key => key.includes(pattern));
      await Promise.all(matchingKeys.map(key => this.cacheManager.del(key)));
    }
  }
}