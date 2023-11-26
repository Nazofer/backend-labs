import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller.js';
import { TYPES } from '../types.js';
import { ILogger } from '../logger/logger.interface.js';
import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { User } from './user.interface.js';
import { IUsersController } from './users.controller.interface.js';

@injectable()
export class UsersController
  extends BaseController
  implements IUsersController
{
  users: User[] = [{ id: 1, name: 'Ryan Gosling' }];

  constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
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

  _generateId() {
    return this.users.length + 1;
  }

  createUser(req: Request, res: Response) {
    const { name } = req.body;
    const user = {
      id: this._generateId(),
      name,
    };
    this.users.push(user);
    return this.created(res, user);
  }

  deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const user = this.users.find((u) => u.id === Number(id));
    if (!user) {
      return this.send(res, 404, { message: 'User not found' });
    }
    this.users = this.users.filter((u) => u.id !== Number(id));
    return this.ok(res, user);
  }

  getUsers(req: Request, res: Response) {
    return this.ok(res, this.users);
  }

  getUser(req: Request, res: Response) {
    const { id } = req.params;
    const user = this.users.find((u) => u.id === Number(id));
    if (!user) {
      return this.send(res, 404, { message: 'User not found' });
    }
    return this.ok(res, user);
  }
}
