import { Router } from 'express';

export class BaseController {
  _router;

  constructor() {
    this._router = Router();
  }

  router() {
    return this._router;
  }

  send(res, code, message) {
    res.type('application/json');
    return res.status(code).json(message);
  }

  ok(res, message) {
    return this.send(res, 200, message);
  }

  created(res, message) {
    return this.send(res, 201, message);

  }

  _bindRoutes(routes) {
    for (const route of routes) {
      console.log(route);
      const middlewares = route.middlewares?.map((m) => m.execute.bind(m));
      const handler = route.func.bind(this);
      const pipeline = middlewares ? [...middlewares, handler] : handler;
      this._router[route.method](route.path, pipeline);
    }
  }
}