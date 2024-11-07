import { CacheModule } from '@nestjs/cache-manager';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nJsonLoader,
  I18nModule,
} from 'nestjs-i18n';
import { join } from 'path';
import { AppController } from './app.controller';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingMiddleware } from './common/middlewares/logging.middleware';
import { LanguageService } from './common/services/language.service';
import {
  cacheConfig,
  envValidationSchema,
  typeOrmConfig,
} from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        ...envValidationSchema,
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    I18nModule.forRoot({
      loader: I18nJsonLoader,
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, 'i18n/'),
        watch: true,
      },
      typesOutputPath: join(process.cwd(), 'src/generated/i18n.generated.ts'),
      resolvers: [new HeaderResolver(['x-lang']), AcceptLanguageResolver],
    }),
    CacheModule.registerAsync(cacheConfig),
  ],
  controllers: [AppController],
  providers: [
    LanguageService,
    Logger,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
