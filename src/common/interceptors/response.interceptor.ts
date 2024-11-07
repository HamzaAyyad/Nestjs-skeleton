import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { RequestModel } from '../interfaces/request.interface';
import { ResponseModel } from '../interfaces/response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>
  ): Observable<ResponseModel<T>> {
    return next.handle().pipe(map((data) => this._mapResponse(data, context)));
  }

  private _mapResponse(data: T, context: ExecutionContext) {
    return {
      statusCode: context.switchToHttp().getResponse<Response>().statusCode,
      error: null,
      data,
      requestId: context.switchToHttp().getRequest<RequestModel>().id,
    };
  }
}
