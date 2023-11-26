import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller.js';
import { TYPES } from '../types.js';
import { ILogger } from '../logger/logger.interface.js';
import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { User } from './user.interface.js';
import { IUsersController } from './users.controller.interface.js';
import { IUsersService } from './users.service.interface.js';

@injectable()
export class UsersController
  extends BaseController
  implements IUsersController
{
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.IUsersService) private usersService: IUsersService
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        method: 'post',
        path: '/',
        func: this.createUser,
      },
      {
        method: 'delete',
        path: '/:id',
        func: this.deleteUser,
      },
      {
        method: 'get',
        path: '/',
        func: this.getUsers,
      },
      {
        method: 'get',
        path: '/:id',
        func: this.getUser,
      },
    ]);
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      const user = await this.usersService.create(name);
      return this.created(res, user);
    } catch (err) {
      return next(err); // pass error to ExceptionFilter
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      await this.usersService.delete(Number(id));
      return this.ok(res);
    } catch (err) {
      return next(err);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.usersService.getAll();

      return this.ok(res, users);
    } catch (err) {
      next(err);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const user = await this.usersService.get(Number(id));
      return this.ok(res, user);
    } catch (err) {
      return next(err);
    }
  }
}
