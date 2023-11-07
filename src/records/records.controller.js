import { BaseController } from '../common/base.controller.js';


export class RecordsController extends BaseController {
  records;

  constructor(records) {
    super();
    this.records = records;
    this._bindRoutes([
      {
        method: 'post',
        path: '/',
        func: this.createRecord
      },
      {
        method: 'delete',
        path: '/:id',
        func: this.deleteRecord
      },
      {
        method: 'get',
        path: '/:id',
        func: this.getRecord
      },
      {
        method: 'get',
        path: '/',
        func: this.getRecordByUserOrCategory
      }
    ]);
  }

  _generateId() {
    return this.records.length + 1;
  }

  createRecord(req, res) {
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

  deleteRecord(req, res) {
    const { id } = req.params;
    const record = this.records.find((u) => u.id === Number(id));
    if (!record) {
      return this.send(res, 404, { message: 'Record not found' });
    }
    this.records = this.records.filter((u) => u.id !== Number(id));
    return this.ok(res, record);
  }

  getRecord(req, res) {
    const { id } = req.params;
    const record = this.records.find((u) => u.id === Number(id));
    if (!record) {
      return this.send(res, 404, { message: 'Record not found' });
    }
    return this.ok(res, record);
  }

  getRecordByUserOrCategory(req, res) {
    const { userId, categoryId } = req.query;
    if (!userId && !categoryId) {
      return this.send(res, 400, { message: 'Missing userId or categoryId' });
    }

    const records = [];

    if (userId) {
      records.push(...this.records.filter((u) => u.userId === Number(userId)));
    }

    if (categoryId) {
      records.push(...this.records.filter((u) => u.categoryId === Number(categoryId)));
    }

    if (records.length === 0) {
      return this.send(res, 404, { message: 'Record not found' });
    }

    return this.ok(res, records);
  }
}