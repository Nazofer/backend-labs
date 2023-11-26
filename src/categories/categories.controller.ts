import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller.js';
import { TYPES } from '../types.js';
import { ILogger } from '../logger/logger.interface.js';
import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { ICategoriesController } from './categories.controller.interface.js';
import { ICategoriesService } from './categories.service.interface.js';

@injectable()
export class CategoriesController
  extends BaseController
  implements ICategoriesController
{
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.ICategoriesService)
    private categoriesService: ICategoriesService
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        method: 'post',
        path: '/',
        func: this.createCategory,
      },
      {
        method: 'delete',
        path: '/:id',
        func: this.deleteCategory,
      },
      {
        method: 'get',
        path: '/',
        func: this.getCategories,
      },
      {
        method: 'get',
        path: '/:id',
        func: this.getCategory,
      },
      {
        method: 'put',
        path: '/:id',
        func: this.updateCategory,
      },
    ]);
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body;
    try {
      const category = await this.categoriesService.create(name);
      return this.created(res, category);
    } catch (err) {
      return next(err); // pass error to ExceptionFilter
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      await this.categoriesService.delete(Number(id));
      return this.ok(res);
    } catch (err) {
      return next(err);
    }
  }

  async getCategories(req: Request, res: Response) {
    const categories = await this.categoriesService.getAll();
    return this.ok(res, categories);
  }

  async getCategory(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const category = await this.categoriesService.getById(Number(id));
      return this.ok(res, category);
    } catch (err) {
      return next(err);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const category = req.body;
    try {
      const updatedCategory = await this.categoriesService.update(
        Number(id),
        category
      );
      return this.ok(res, updatedCategory);
    } catch (err) {
      return next(err);
    }
  }
}
