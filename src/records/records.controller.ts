import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller.js';
import { TYPES } from '../types.js';
import { ILogger } from '../logger/logger.interface.js';
import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { IRecordsController } from './records.controller.interface.js';
import { IRecordsService } from './records.service.interface.js';

@injectable()
export class RecordsController
  extends BaseController
  implements IRecordsController
{
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.IRecordsService) private recordsService: IRecordsService
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        method: 'post',
        path: '/',
        func: this.createRecord,
      },
      {
        method: 'delete',
        path: '/:id',
        func: this.deleteRecord,
      },
      {
        method: 'get',
        path: '/:id',
        func: this.getRecord,
      },
      {
        method: 'get',
        path: '/',
        func: this.getRecordByUserOrCategory,
      },
    ]);
  }

  async createRecord(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    try {
      const record = await this.recordsService.create(body);
      return this.ok(res, record);
    } catch (err) {
      next(err);
    }
  }

  async deleteRecord(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      await this.recordsService.delete(Number(id));
      return this.ok(res, { message: 'Record deleted' });
    } catch (err) {
      return next(err);
    }
  }

  async getRecord(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const record = await this.recordsService.getById(Number(id));
      return this.ok(res, record);
    } catch (err) {
      return next(err);
    }
  }

  async getRecordByUserOrCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { userId, categoryId } = req.query;
    try {
      const records = await this.recordsService.getAll(
        Number(userId),
        Number(categoryId)
      );
      return this.ok(res, records);
    } catch (err) {
      return next(err);
    }
  }
}
