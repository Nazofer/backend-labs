import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app.js';
import { LoggerService } from './logger/logger.service.js';
import { ILogger } from './logger/logger.interface.js';
import { TYPES } from './types.js';
import { IUsersController } from './users/users.controller.interface.js';
import { UsersController } from './users/users.controller.js';
import { IRecordsController } from './records/records.controller.interface.js';
import { RecordsController } from './records/records.controller.js';
import { ICategoriesController } from './categories/categories.controller.interface.js';
import { CategoriesController } from './categories/categories.controller.js';
import { IExceptionFilter } from './errors/exception.filter.interface.js';
import { ExceptionFilter } from './errors/exception.filter.js';
import { IHealthCheckController } from './healthcheck/healthcheck.controller.interface.js';
import { HealthCheckController } from './healthcheck/healthcheck.controller.js';
import { IUsersService } from './users/users.service.interface.js';
import { UsersService } from './users/users.service.js';
import { ICategoriesService } from './categories/categories.service.interface.js';
import { CategoriesService } from './categories/categories.service.js';

interface ICompositionRootReturn {
  app: App;
  appContainer: Container;
}

// DI container binding interfaces to their implementations
const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<App>(TYPES.Application).to(App);
  bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
  bind<IExceptionFilter>(TYPES.IExceptionFilter).to(ExceptionFilter);
  bind<IHealthCheckController>(TYPES.IHealthCheckController).to(
    HealthCheckController
  );
  bind<IUsersController>(TYPES.IUsersController).to(UsersController);
  bind<IUsersService>(TYPES.IUsersService).to(UsersService);
  bind<ICategoriesController>(TYPES.ICategoriesController).to(
    CategoriesController
  );
  bind<ICategoriesService>(TYPES.ICategoriesService).to(CategoriesService);
  bind<IRecordsController>(TYPES.IRecordsController).to(RecordsController);
});

const CompositionRoot = (): ICompositionRootReturn => {
  const appContainer = new Container();
  appContainer.load(appBindings);
  const app = appContainer.get<App>(TYPES.Application);
  app.init();
  return { app, appContainer };
};

export const { app, appContainer } = CompositionRoot();
