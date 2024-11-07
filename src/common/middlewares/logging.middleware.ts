import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { RequestModel } from '../interfaces/request.interface';
import { isNotEmpty } from '../libs/helpers/is-not-empty.helper';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly _logger: Logger) {}

  use(req: RequestModel, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') ?? '';
    const requestStartDate = new Date();

    req.id = uuidv4();

    const { data, isNotEmpty } = this._getRequestData(req);

    this._logger.log(
      `Request: ${method} ${originalUrl} ${req.id} ${userAgent}`,
      {
        method,
        originalUrl,
        userAgent,
        data: isNotEmpty ? JSON.stringify(data) : '',
        requestId: req.id,
      }
    );

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const responseTime = new Date().getTime() - requestStartDate.getTime();

      this._logger.log(
        `Response: ${method} ${originalUrl} ${req.id} ${userAgent} ${statusCode} ${contentLength} - ${responseTime}ms`,
        {
          method,
          originalUrl,
          userAgent,
          statusCode,
          contentLength,
          responseTime,
          requestId: req.id,
        }
      );
    });

    next();
  }

  private _getRequestData(req: RequestModel) {
    let data: Record<string, unknown> = {};

    if (isNotEmpty(req?.query)) {
      data = { ...data, query: req.query };
    }

    if (isNotEmpty(req?.params) && this._checkIfParamIsEmpty(req.params)) {
      data = { ...data, params: req.params };
    }

    if (isNotEmpty(req?.body)) {
      data = { ...data, body: req.body };
    }

    return { data, isNotEmpty: isNotEmpty(data) };
  }

  private _checkIfParamIsEmpty(param: Record<string, unknown>) {
    return !!Number(Object.keys(param)[0]);
  }
}
