import { Response, Router } from 'express';
import { ExpressReturnType, IControllerRoute } from './route.interface';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { IBaseController } from './base.controller.interface';

@injectable()
export abstract class BaseController implements IBaseController {
  private readonly _router: Router;

  constructor(private logger: ILogger) {
    this._router = Router();
  }

  get router(): Router {
    return this._router;
  }

  public send<T>(res: Response, code: number, message?: T): ExpressReturnType {
    res.type('application/json');
    return res.status(code).json(message);
  }

  public ok<T>(res: Response, message?: T): ExpressReturnType {
    return this.send<T>(res, 200, message);
  }

  public created<T>(res: Response, message?: T): ExpressReturnType {
    return this.send<T>(res, 201, message);
  }

  protected bindRoutes(routes: IControllerRoute[]): void {
    for (const route of routes) {
      this.logger.log(
        `Binding route ${route.method.toUpperCase()} ${route.path}`
      );
      const middlewares = route.middlewares?.map((m) => m.execute.bind(m));
      const handler = route.func.bind(this);
      const pipeline = middlewares ? [...middlewares, handler] : handler;
      this._router[route.method](route.path, pipeline);
    }
  }
}
