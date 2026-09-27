import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MetricsService } from './Metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { method, route } = req;
    const routePath = route?.path || req.path;

    const end = this.metricsService.requisicaoLatencia.startTimer({
      method,
      route: routePath,
    });

    return next.handle().pipe(
      tap(() => {
        const status = res.statusCode?.toString() || '200';
        end({ status });
        this.metricsService.requisicaoTotal.inc({ method, route: routePath, status });
      }),
      catchError((err) => {
        const status = err.status?.toString() || '500';
        end({ status });
        this.metricsService.requisicaoTotal.inc({ method, route: routePath, status });
        return throwError(() => err);
      }),
    );
  }
}