import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-yet';
import Joi from 'joi';
import { DatabaseType } from 'typeorm';
import { Environments } from '../common/enums/environment.enum';

export const envValidationSchema = {
  SERVER_PORT: Joi.number().required(),
  ENVIRONMENT: Joi.string()
    .valid(...Object.values(Environments))
    .required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_TTL: Joi.number().optional(),
  DB_TYPE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SSL: Joi.boolean().optional(),
  DB_CONNECT_STRING: Joi.string().optional(),
  ALLOWED_ORIGINS: Joi.string().required(),
};

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  useFactory: (configService: ConfigService) => {
    return {
      type: configService.get<DatabaseType>('DB_TYPE'),
      host: configService.get('DB_HOST'),
      connectString: configService.get<string>('DB_CONNECT_STRING'),
      port: parseInt(configService.get('DB_PORT') as string),
      username: configService.get('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME'),
      ssl: configService.get<string>('DB_SSL') === 'true',
      synchronize: false,
      logging: ['error'],
      autoLoadEntities: true,
    } as TypeOrmModuleOptions;
  },
  inject: [ConfigService],
};

export const cacheConfig: CacheModuleAsyncOptions = {
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      socket: {
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      },
    });

    return {
      store,
      ttl: configService.get('REDIS_TTL') ?? 180000,
    };
  },
  inject: [ConfigService],
  isGlobal: true,
};
