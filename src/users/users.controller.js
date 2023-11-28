import { BaseController } from '../common/base.controller.js';


export class UserController extends BaseController {
  users;

  constructor(users) {
    super();
    this.users = users;
    this._bindRoutes([
      {
        method: 'post',
        path: '/',
        func: this.createUser
      },
      {
        method: 'delete',
        path: '/:id',
        func: this.deleteUser
      },
      {
        method: 'get',
        path: '/',
        func: this.getUsers
      },
      {
        method: 'get',
        path: '/:id',
        func: this.getUser
      }
    ]);
  }

  _generateId() {
    return this.users.length + 1;
  }

  createUser(req, res) {
    const { name } = req.body;
    const user = {
      id: this._generateId(),
      name,
    };
    this.users.push(user);
    return this.created(res, user);
  }

  deleteUser(req, res) {
    const { id } = req.params;
    const user = this.users.find((u) => u.id === Number(id));
    if (!user) {
      return this.send(res, 404, { message: 'User not found' });
    }
    this.users = this.users.filter((u) => u.id !== Number(id));
    return this.ok(res, user);
  }

  getUsers(req, res) {
    return this.ok(res, this.users);
  }

  getUser(req, res) {
    const { id } = req.params;
    const user = this.users.find((u) => u.id === Number(id));
    if (!user) {
      return this.send(res, 404, { message: 'User not found' });
    }
    return this.ok(res, user);
  }
}