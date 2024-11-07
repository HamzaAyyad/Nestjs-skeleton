import { AbstractKeyValuePair } from './Abstract-key-value.interface';

export interface ResponseModel<T> {
  statusCode: number;
  error: {
    message: string;
    context?: AbstractKeyValuePair[];
  } | null;
  data?: T;
  requestId?: string;
}
