import express, { Express } from 'express';
import { Server } from 'http';
import { ILogger } from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types.js';
import bodyParser from 'body-parser';
import 'reflect-metadata';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { IHealthCheckController } from './healthcheck/healthcheck.controller.interface';
import { IUsersController } from './users/users.controller.interface';
import { IRecordsController } from './records/records.controller.interface';
import { ICategoriesController } from './categories/categories.controller.interface';
import { AppDataSource } from './data-source.js';
import 'dotenv/config';
import { AuthMiddleware } from './common/auth.middleware.js';
@injectable()
export class App {
  app: Express;
  server: Server;
  port: number;

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.IExceptionFilter) private exceptionFilter: IExceptionFilter,
    @inject(TYPES.IHealthCheckController)
    private healthCheckController: IHealthCheckController,
    @inject(TYPES.IUsersController) private userController: IUsersController,
    @inject(TYPES.IRecordsController)
    private recordsController: IRecordsController,
    @inject(TYPES.ICategoriesController)
    private categoriesController: ICategoriesController
  ) {
    this.app = express();
    this.port = Number(process.env.PORT || '3000');
  }

  useMiddlewares(): void {
    this.app.use(bodyParser.json());
    const authMiddleware = new AuthMiddleware();
    this.app.use(authMiddleware.execute.bind(authMiddleware));
  }

  useRoutes(): void {
    this.app.use('/users', this.userController.router);
    this.app.use('/records', this.recordsController.router);
    this.app.use('/categories', this.categoriesController.router);
    this.app.use('/healthcheck', this.healthCheckController.router);
  }

  useExceptionFilters(): void {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init(): Promise<void> {
    this.useMiddlewares();
    this.useRoutes();
    this.useExceptionFilters();
    AppDataSource.initialize()
      .then(() => {
        this.logger.log('Database connected');
      })
      .catch((err) => {
        this.logger.error(err);
      });
    this.server = this.app.listen(this.port);
    this.logger.log(`Server running at http://localhost:${this.port}`);
  }
}
