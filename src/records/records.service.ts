import { Repository } from 'typeorm';
import { Record } from './record.entity.js';
import { AppDataSource } from '../data-source.js';
import { HTTPError } from '../errors/http-error.class.js';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { IRecordsService } from './records.service.interface.js';

@injectable()
export class RecordsService implements IRecordsService {
  private repo: Repository<Record>;
  constructor() {
    this.repo = AppDataSource.getRepository(Record);
  }

  async getById(id: number): Promise<Record> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) {
      throw new HTTPError(404, `Record with id ${id} not found`);
    }
    return record;
  }

  async getAll(userId: number, categoryId: number): Promise<Record[]> {
    if (!userId && !categoryId) {
      throw new HTTPError(400, 'userId or categoryId must be provided');
    }

    const query = this.repo.createQueryBuilder('record');

    if (userId) {
      query.orWhere('record.userId = :userId', { userId });
    }

    if (categoryId) {
      query.orWhere('record.categoryId = :categoryId', { categoryId });
    }

    const records = await query.getMany();
    console.log(records);

    return records;
  }

  async create(record: Record): Promise<Record> {
    const date = new Date();
    record.createdAt = date;
    const newRecord = await this.repo.create(record);
    return await this.repo.save(newRecord);
  }

  async delete(id: number): Promise<void> {
    const record = await this.getById(id);
    await this.repo.remove(record);
  }
}
