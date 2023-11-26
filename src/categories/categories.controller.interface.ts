import { NextFunction, Request, Response } from 'express';
import { IBaseController } from '../common/base.controller.interface';

export interface ICategoriesController extends IBaseController {
  createCategory: (req: Request, res: Response, next: NextFunction) => void;

  deleteCategory: (req: Request, res: Response, next: NextFunction) => void;

  getCategories: (req: Request, res: Response, next: NextFunction) => void;

  getCategory: (req: Request, res: Response, next: NextFunction) => void;
}
