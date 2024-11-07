import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { RequestModel } from '../interfaces/request.interface';
import { LanguageService } from '../services/language.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly _languageService: LanguageService,
    private readonly _logger: Logger
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception?.getStatus() ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception?.message ?? this._languageService.translate('common.error');

    this._logger.error(
      `Error: ${message} - Status: ${status} - RequestId: ${ctx.getRequest<RequestModel>().id}`,
      exception.stack,
      {
        statusCode: status,
        error: {
          message,
        },
        requestId: ctx.getRequest<RequestModel>().id,
      }
    );

    response.status(status).json({
      statusCode: status,
      error: {
        message,
      },
      requestId: ctx.getRequest<RequestModel>().id,
    });
  }
}
