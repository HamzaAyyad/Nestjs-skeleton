import { Request } from 'express';

export interface RequestModel extends Request {
  id: string;
}
