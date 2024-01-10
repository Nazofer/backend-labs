import { NextFunction, Request, Response } from 'express';
import { IMiddleWare } from './middleware.interface';

export class CanPerformGuard implements IMiddleWare {
  execute(req: Request, res: Response, next: NextFunction): void {
    if (!req.params.id) {
      return next();
    }

    if (req.id === Number(req.params.id)) {
      return next();
    }
    res.status(403).send({ error: 'Forbidden' });
  }
}
