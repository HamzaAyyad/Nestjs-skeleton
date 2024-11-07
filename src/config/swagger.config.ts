import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('NestJS API')
  .setDescription('API documentation for NestJS')
  .setVersion('1.0')
  .addBearerAuth()
  .setExternalDoc('Document Yaml', 'swagger/yaml')
  .build();
