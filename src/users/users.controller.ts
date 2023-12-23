import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller.js';
import { TYPES } from '../types.js';
import { ILogger } from '../logger/logger.interface.js';
import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { IUsersController } from './users.controller.interface.js';
import { IUsersService } from './users.service.interface.js';
import { UserRegisterDto } from './dtos/user-register.dto.js';
import { ValidateMiddleware } from '../common/validate.middleware.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';
import { IAuthService } from './auth.service.interface.js';
import { UserLoginDto } from './dtos/user-login.dto.js';
import { AuthGuard } from '../common/auth.guard.js';
import { CanPerformGuard } from '../common/canPerform.guard.js';

@injectable()
export class UsersController
  extends BaseController
  implements IUsersController
{
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.IUsersService) private usersService: IUsersService,
    @inject(TYPES.IAuthService) private authService: IAuthService
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        method: 'post',
        path: '/register',
        func: this.register,
        middlewares: [new ValidateMiddleware(UserRegisterDto)],
      },
      {
        method: 'post',
        path: '/login',
        func: this.login,
        middlewares: [new ValidateMiddleware(UserLoginDto)],
      },
      {
        method: 'delete',
        path: '/:id',
        func: this.deleteUser,
        middlewares: [new AuthGuard(), new CanPerformGuard()],
      },
      {
        method: 'get',
        path: '/',
        func: this.getUsers,
        middlewares: [new AuthGuard()],
      },
      {
        method: 'get',
        path: '/:id',
        func: this.getUser,
        middlewares: [new AuthGuard()],
      },
      {
        method: 'get',
        path: '/:id/balance',
        func: this.getUserBalance,
        middlewares: [new AuthGuard(), new CanPerformGuard()],
      },
      {
        method: 'put',
        path: '/:id',
        func: this.updateUser,
        middlewares: [
          new ValidateMiddleware(UpdateUserDto),
          new AuthGuard(),
          new CanPerformGuard(),
        ],
      },
    ]);
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;
      const token = await this.authService.register(email, password, name);
      return this.created(res, { token });
    } catch (err) {
      return next(err); // pass error to ExceptionFilter
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const token = await this.authService.login(email, password);
      return this.ok(res, { token });
    } catch (err) {
      return next(err);
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
      const user = await this.usersService.getById(Number(id));
      return this.ok(res, user);
    } catch (err) {
      return next(err);
    }
  }

  async getUserBalance(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const balance = await this.usersService.getUserBalance(Number(id));
      return this.ok(res, { balance });
    } catch (err) {
      return next(err);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const user = req.body;
    try {
      const updatedUser = await this.usersService.update(Number(id), user);
      return this.ok(res, updatedUser);
    } catch (err) {
      return next(err);
    }
  }
}
