import { NextFunction, Request, Response } from 'express';
import { IBaseController } from '../common/base.controller.interface';

export interface IUsersController extends IBaseController {
  register: (req: Request, res: Response, next: NextFunction) => void;

  deleteUser: (req: Request, res: Response, next: NextFunction) => void;

  getUsers: (req: Request, res: Response, next: NextFunction) => void;

  getUser: (req: Request, res: Response, next: NextFunction) => void;
}
