import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

@Injectable()
export class CorrelationIdService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<Map<string, string>>();

  run(correlationId: string, callback: () => void) {
    this.asyncLocalStorage.run(new Map([['correlationId', correlationId]]), callback);
  }

  getCorrelationId(): string | undefined {
    return this.asyncLocalStorage.getStore()?.get('correlationId');
  }
}
