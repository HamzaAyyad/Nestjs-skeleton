import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import { I18nMiddleware, I18nValidationExceptionFilter } from 'nestjs-i18n';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { winstonLogger } from './common/libs/utils/winston-logger.util';
import { swaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      instance: winstonLogger,
    }),
  });

  useGlobalMidlewares(app);
  useGlobalFilters(app);
  useGlobalInterceptors(app);
  useGlobalPipes(app);

  setUpSwagger(app);

  await app.listen(process.env.SERVER_PORT ?? 3000);
}

const setUpSwagger = (app: NestExpressApplication) => {
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('swagger', app, documentFactory, {
    yamlDocumentUrl: 'swagger/yaml',
    jsonDocumentUrl: 'swagger/json',
  });
};

const useGlobalPipes = (app: NestExpressApplication) => {
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
};

const useGlobalFilters = (app: NestExpressApplication) => {
  app.useGlobalFilters(new I18nValidationExceptionFilter());
};

const useGlobalMidlewares = (app: NestExpressApplication) => {
  app.use(
    helmet({
      crossOriginEmbedderPolicy: { policy: 'require-corp' },
    })
  );
  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: process.env.ALLOWED_ORIGINS?.split(','),
  });
  app.useBodyParser('urlencoded', { extended: true });
  app.useBodyParser('json', { limit: '50mb' });
  app.use(I18nMiddleware);
};

const useGlobalInterceptors = (app: NestExpressApplication) => {
  app.useGlobalInterceptors(new ResponseInterceptor());
};

bootstrap().catch((err) => console.error(err));
