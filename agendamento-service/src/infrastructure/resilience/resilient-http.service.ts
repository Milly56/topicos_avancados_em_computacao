import { Injectable, OnModuleDestroy } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import CircuitBreaker = require('opossum');
import { AppLoggerService } from '../logging/app-logger.service.js';
import { correlationIdStorage } from '../logging/correlation-id.context.js';

const TIMEOUT_MS = 5_000;
const RETRY_COUNT = 3;
const RETRY_BASE_MS = 500;
const CB_VOLUME_THRESHOLD = 5;
const CB_ERROR_THRESHOLD = 50;
const CB_RESET_TIMEOUT_MS = 30_000;

function jitteredBackoff(attempt: number): number {
  return Math.pow(2, attempt) * RETRY_BASE_MS + Math.random() * RETRY_BASE_MS;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class ResilientHttpService implements OnModuleDestroy {
  private readonly client: AxiosInstance;
  private readonly breakers = new Map<string, CircuitBreaker<[() => Promise<unknown>], unknown>>();

  constructor(private readonly logger: AppLoggerService) {
    this.client = axios.create({ timeout: TIMEOUT_MS });
  }

  private getBreaker(serviceName: string): CircuitBreaker<[() => Promise<unknown>], unknown> {
    if (this.breakers.has(serviceName)) return this.breakers.get(serviceName)!;

    const cb = new CircuitBreaker((fn: () => Promise<unknown>) => fn(), {
      timeout: false,
      volumeThreshold: CB_VOLUME_THRESHOLD,
      errorThresholdPercentage: CB_ERROR_THRESHOLD,
      resetTimeout: CB_RESET_TIMEOUT_MS,
    });

    cb.on('open', () =>
      this.logger.warn(`Circuit breaker [${serviceName}] OPEN`, ResilientHttpService.name),
    );
    cb.on('halfOpen', () =>
      this.logger.log(`Circuit breaker [${serviceName}] HALF-OPEN`, ResilientHttpService.name),
    );
    cb.on('close', () =>
      this.logger.log(`Circuit breaker [${serviceName}] CLOSED`, ResilientHttpService.name),
    );

    this.breakers.set(serviceName, cb);
    return cb;
  }

  private correlationHeaders(): Record<string, string> {
    const id = correlationIdStorage.getStore();
    return id ? { 'X-Correlation-ID': id } : {};
  }

  private async withRetry<T>(label: string, request: () => Promise<T>): Promise<T> {
    let lastError!: Error;
    for (let attempt = 0; attempt <= RETRY_COUNT; attempt++) {
      if (attempt > 0) {
        const delay = jitteredBackoff(attempt - 1);
        this.logger.warn(
          `[${label}] retry ${attempt}/${RETRY_COUNT} em ${Math.round(delay)}ms`,
          ResilientHttpService.name,
        );
        await sleep(delay);
      }
      try {
        return await request();
      } catch (err) {
        lastError = err as Error;
        this.logger.error(
          `[${label}] tentativa ${attempt + 1} falhou: ${lastError.message}`,
          undefined,
          ResilientHttpService.name,
        );
      }
    }
    throw lastError;
  }

  async get<T>(url: string, serviceName: string, config?: AxiosRequestConfig): Promise<T> {
    const cb = this.getBreaker(serviceName);
    return cb.fire(() =>
      this.withRetry<T>(`GET ${url}`, async () => {
        const res = await this.client.get<T>(url, {
          ...config,
          headers: { ...config?.headers, ...this.correlationHeaders() },
        });
        return res.data;
      }),
    ) as Promise<T>;
  }

  async post<T>(url: string, data: unknown, serviceName: string, config?: AxiosRequestConfig): Promise<T> {
    const cb = this.getBreaker(serviceName);
    return cb.fire(() =>
      this.withRetry<T>(`POST ${url}`, async () => {
        const res = await this.client.post<T>(url, data, {
          ...config,
          headers: { ...config?.headers, ...this.correlationHeaders() },
        });
        return res.data;
      }),
    ) as Promise<T>;
  }

  onModuleDestroy(): void {
    this.breakers.forEach((cb) => cb.shutdown());
  }
}
