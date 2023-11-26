import { NextFunction, Request, Response } from 'express';
import { IBaseController } from '../common/base.controller.interface';

export interface IHealthCheckController extends IBaseController {
  getHealthCheck(req: Request, res: Response, next: NextFunction): void;
}
