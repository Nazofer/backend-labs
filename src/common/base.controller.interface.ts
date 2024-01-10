import { Response, Router } from 'express';
import { ExpressReturnType, IControllerRoute } from './route.interface';

export interface IBaseController {
  get router(): Router;
  send<T>(res: Response, code: number, message?: T): ExpressReturnType;
  ok<T>(res: Response, message?: T): ExpressReturnType;
  created<T>(res: Response, message?: T): ExpressReturnType;
}
