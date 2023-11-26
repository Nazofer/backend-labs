import { NextFunction, Request, Response } from 'express';
import { IBaseController } from '../common/base.controller.interface';

export interface IRecordsController extends IBaseController {
  createRecord: (req: Request, res: Response, next: NextFunction) => void;

  deleteRecord: (req: Request, res: Response, next: NextFunction) => void;

  getRecord: (req: Request, res: Response, next: NextFunction) => void;

  getRecordByUserOrCategory: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;
}
