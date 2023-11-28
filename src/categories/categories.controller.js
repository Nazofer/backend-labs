import { BaseController } from '../common/base.controller.js';

export class CategoriesController extends BaseController {
  categories;

  constructor(categories) {
    super();
    this.categories = categories;
    this._bindRoutes([
      {
        method: 'post',
        path: '/',
        func: this.createCategory
      },
      {
        method: 'delete',
        path: '/:id',
        func: this.deleteCategory
      },
      {
        method: 'get',
        path: '/',
        func: this.getCategories
      },
      {
        method: 'get',
        path: '/:id',
        func: this.getCategory
      }
    ]);
  }

  _generateId() {
    return this.categories.length + 1;
  }

  createCategory(req, res) {
    const { name } = req.body;
    const category = {
      id: this._generateId(),
      name,
    };
    this.categories.push(category);
    return this.created(res, category);
  }

  deleteCategory(req, res) {
    const { id } = req.params;
    const category = this.categories.find((u) => u.id === Number(id));
    if (!category) {
      return this.send(res, 404, { message: 'Category not found' });
    }
    this.categories = this.categories.filter((u) => u.id !== Number(id));
    return this.ok(res, category);
  }

  getCategories(req, res) {
    return this.ok(res, this.categories);
  }

  getCategory(req, res) {
    const { id } = req.params;
    const category = this.categories.find((u) => u.id === Number(id));
    if (!category) {
      return this.send(res, 404, { message: 'Category not found' });
    }
    return this.ok(res, category);
  }
}