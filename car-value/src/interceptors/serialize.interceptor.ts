import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

export class SerializeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Runs something before the req is handled by the request handler
    console.log("I'm running before the handler\n", context);
    return next.handle().pipe(
      map((data: any) => {
        //Run something before response is sent
        console.log("I'm running before the response is sent out\n", data);
      }),
    );
  }
}
