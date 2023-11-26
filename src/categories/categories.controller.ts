import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller.js';
import { TYPES } from '../types.js';
import { ILogger } from '../logger/logger.interface.js';
import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { Category } from './category.interface.js';
import { ICategoriesController } from './categories.controller.interface.js';

@injectable()
export class CategoriesController
  extends BaseController
  implements ICategoriesController
{
  categories: Category[] = [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
  ];

  constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
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
    ]);
  }

  _generateId() {
    return this.categories.length + 1;
  }

  createCategory(req: Request, res: Response) {
    const { name } = req.body;
    const category = {
      id: this._generateId(),
      name,
    };
    this.categories.push(category);
    return this.created(res, category);
  }

  deleteCategory(req: Request, res: Response) {
    const { id } = req.params;
    const category = this.categories.find((u) => u.id === Number(id));
    if (!category) {
      return this.send(res, 404, { message: 'Category not found' });
    }
    this.categories = this.categories.filter((u) => u.id !== Number(id));
    return this.ok(res, category);
  }

  getCategories(req: Request, res: Response) {
    return this.ok(res, this.categories);
  }

  getCategory(req: Request, res: Response) {
    const { id } = req.params;
    const category = this.categories.find((u) => u.id === Number(id));
    if (!category) {
      return this.send(res, 404, { message: 'Category not found' });
    }
    return this.ok(res, category);
  }
}
