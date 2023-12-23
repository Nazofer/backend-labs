import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller.js';
import { TYPES } from '../types.js';
import { ILogger } from '../logger/logger.interface.js';
import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { IRecordsController } from './records.controller.interface.js';
import { IRecordsService } from './records.service.interface.js';
import { CreateRecordDto } from './dtos/create-record.dto.js';
import { ValidateMiddleware } from '../common/validate.middleware.js';
import { AuthGuard } from '../common/auth.guard.js';

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
        middlewares: [new ValidateMiddleware(CreateRecordDto), new AuthGuard()],
      },
      {
        method: 'delete',
        path: '/:id',
        func: this.deleteRecord,
        middlewares: [new AuthGuard()],
      },
      {
        method: 'get',
        path: '/:id',
        func: this.getRecord,
        middlewares: [new AuthGuard()],
      },
      {
        method: 'get',
        path: '/',
        func: this.getRecordByUserOrCategory,
        middlewares: [new AuthGuard()],
      },
    ]);
  }

  async createRecord(req: Request, res: Response, next: NextFunction) {
    const { body, id: userId } = req;
    try {
      const record = await this.recordsService.create(body, userId!);
      return this.ok(res, record);
    } catch (err) {
      next(err);
    }
  }

  async deleteRecord(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { id: userId } = req; // from auth middleware
    try {
      await this.recordsService.delete(Number(id), userId!);
      return this.ok(res, { message: 'Record deleted' });
    } catch (err) {
      return next(err);
    }
  }

  async getRecord(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { id: userId } = req; // from auth middleware
    try {
      const record = await this.recordsService.getById(Number(id), userId!);
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
    const { categoryId } = req.query;
    const { id: userId } = req; // from auth middleware
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
