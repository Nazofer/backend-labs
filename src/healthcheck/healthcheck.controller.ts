import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BaseController } from '../common/base.controller.js';
import { TYPES } from '../types.js';
import { ILogger } from '../logger/logger.interface';
import { Request, Response } from 'express';
import { IHealthCheckController } from './healthcheck.controller.interface';

@injectable()
export class HealthCheckController
  extends BaseController
  implements IHealthCheckController
{
  constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
    super(loggerService);
    this.bindRoutes([
      {
        method: 'get',
        path: '/',
        func: this.getHealthCheck,
      },
    ]);
  }

  private getFormattedDate() {
    const date = new Date();
    const lang = 'en-US';
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
      timeZone: 'Europe/Kyiv',
    };
    const formattedDate = new Intl.DateTimeFormat(lang, options).format(date);

    return formattedDate;
  }

  private getStatus() {
    const statuses = ['working', 'done', 'pending', 'failed', 'error'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    return status;
  }

  getHealthCheck(req: Request, res: Response) {
    res.json({ date: this.getFormattedDate(), status: this.getStatus() });
  }
}
