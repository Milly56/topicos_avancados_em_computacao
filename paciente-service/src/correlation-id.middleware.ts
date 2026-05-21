import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import { CorrelationIdService } from './correlation-id.service';

const CORRELATION_ID_HEADER = 'x-correlation-id';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(private readonly correlationIdService: CorrelationIdService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const rawHeader = req.headers[CORRELATION_ID_HEADER];
    const correlationId =
      typeof rawHeader === 'string' && rawHeader.trim().length > 0
        ? rawHeader
        : randomUUID();

    res.setHeader(CORRELATION_ID_HEADER, correlationId);
    req.headers[CORRELATION_ID_HEADER] = correlationId;

    this.correlationIdService.run(correlationId, () => next());
  }
}
