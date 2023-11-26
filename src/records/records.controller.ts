import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller.js';
import { TYPES } from '../types.js';
import { ILogger } from '../logger/logger.interface.js';
import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { Record } from './record.interface.js';
import { IRecordsController } from './records.controller.interface.js';

@injectable()
export class RecordsController
  extends BaseController
  implements IRecordsController
{
  records: Record[] = [
    {
      id: 1,
      userId: 1,
      categoryId: 1,
      createdAt: new Date(),
      amount: 100,
    },
  ];

  constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
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

  _generateId() {
    return this.records.length + 1;
  }

  createRecord(req: Request, res: Response) {
    const { name, userId, categoryId, amount } = req.body;
    const record = {
      id: this._generateId(),
      name,
      userId,
      categoryId,
      amount,
      createdAt: new Date(),
    };
    this.records.push(record);
    return this.created(res, record);
  }

  deleteRecord(req: Request, res: Response) {
    const { id } = req.params;
    const record = this.records.find((u) => u.id === Number(id));
    if (!record) {
      return this.send(res, 404, { message: 'Record not found' });
    }
    this.records = this.records.filter((u) => u.id !== Number(id));
    return this.ok(res, record);
  }

  getRecord(req: Request, res: Response) {
    const { id } = req.params;
    const record = this.records.find((u) => u.id === Number(id));
    if (!record) {
      return this.send(res, 404, { message: 'Record not found' });
    }
    return this.ok(res, record);
  }

  getRecordByUserOrCategory(req: Request, res: Response) {
    const { userId, categoryId } = req.query;
    if (!userId && !categoryId) {
      return this.send(res, 400, { message: 'Missing userId or categoryId' });
    }

    const filteredRecords: Record[] = [];

    if (userId) {
      const recordsWithUserId = this.records.filter(
        (u) => u.userId === Number(userId) && !filteredRecords.includes(u)
      );
      filteredRecords.push(...recordsWithUserId);
    }

    if (categoryId) {
      const recordsWithCategoryId = this.records.filter(
        (u) =>
          u.categoryId === Number(categoryId) && !filteredRecords.includes(u)
      );
      filteredRecords.push(...recordsWithCategoryId);
    }

    if (filteredRecords.length === 0) {
      return this.send(res, 404, { message: 'Record not found' });
    }

    return this.ok(res, filteredRecords);
  }
}
