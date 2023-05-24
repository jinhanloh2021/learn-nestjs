import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance, ClassConstructor } from 'class-transformer';

export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

// No longer need to export since we are just exporting the decorator
class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<T> | Promise<Observable<T>> {
    return next.handle().pipe(
      map((data: T) => {
        const excludeExtraneousValues = true;
        return plainToInstance(this.dto, data, { excludeExtraneousValues });
      }),
    );
  }
}
