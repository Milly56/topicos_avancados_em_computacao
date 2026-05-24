import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as os from 'os';
import { correlationIdStorage } from './correlation-id.context.js';

@Injectable()
export class AppLoggerService implements LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [new winston.transports.Console()],
    });
  }

  private meta(context?: string): Record<string, unknown> {
    return {
      environment: process.env.NODE_ENV ?? 'development',
      machineName: os.hostname(),
      correlationId: correlationIdStorage.getStore() ?? 'no-correlation-id',
      context,
    };
  }

  log(message: string, context?: string): void {
    this.logger.info(message, this.meta(context));
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, { ...this.meta(context), trace });
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, this.meta(context));
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, this.meta(context));
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose(message, this.meta(context));
  }

  fatal(message: string, context?: string): void {
    this.logger.error(message, { ...this.meta(context), level: 'fatal' });
  }
}
