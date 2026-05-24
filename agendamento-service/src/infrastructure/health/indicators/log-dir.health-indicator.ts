import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import * as fs from 'fs';
import * as path from 'path';

const LOG_DIR = path.resolve(process.cwd(), 'logs');

@Injectable()
export class LogDirHealthIndicator extends HealthIndicator {
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      if (!fs.existsSync(LOG_DIR)) {
        fs.mkdirSync(LOG_DIR, { recursive: true });
      }
      fs.accessSync(LOG_DIR, fs.constants.W_OK);
      return this.getStatus(key, true, { path: LOG_DIR });
    } catch (error) {
      throw new HealthCheckError(
        'Log directory not writable',
        this.getStatus(key, false, { path: LOG_DIR, error: (error as Error).message }),
      );
    }
  }
}
