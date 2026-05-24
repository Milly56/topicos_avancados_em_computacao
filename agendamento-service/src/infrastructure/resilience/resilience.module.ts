import { Module } from '@nestjs/common';
import { ResilientHttpService } from './resilient-http.service.js';

@Module({
  providers: [ResilientHttpService],
  exports: [ResilientHttpService],
})
export class ResilienceModule {}
