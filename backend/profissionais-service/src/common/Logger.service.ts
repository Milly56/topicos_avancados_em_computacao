import { Injectable, Scope } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import pino from 'pino';

const pinoLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } }
      : undefined,
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  base: {
    service: 'profissionais-service',
    env: process.env.NODE_ENV || 'development',
  },
});

@Injectable({ scope: Scope.DEFAULT })
export class LoggerService {
  constructor(private readonly cls: ClsService) {}

  private buildContext(context?: string) {
    const correlationId = this.cls.get<string>('correlationId');
    return { correlationId, context };
  }

  log(message: string, context?: string) {
    pinoLogger.info(this.buildContext(context), message);
  }

  error(message: string, trace?: string, context?: string) {
    pinoLogger.error({ ...this.buildContext(context), trace }, message);
  }

  warn(message: string, context?: string) {
    pinoLogger.warn(this.buildContext(context), message);
  }

  debug(message: string, context?: string) {
    pinoLogger.debug(this.buildContext(context), message);
  }
}