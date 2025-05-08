import { CallHandler, ExecutionContext } from '@nestjs/common/interfaces';
import { Observable } from 'rxjs';
import { ClassSerializerInterceptor } from '@nestjs/common/serializer/class-serializer.interceptor';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomClassSerializerInterceptor extends ClassSerializerInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Skip validation on health requests
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
    if (context.switchToHttp()?.getRequest()?.url?.startsWith('/health')) {
      return next.handle();
    }
    return super.intercept(context, next);
  }
}
