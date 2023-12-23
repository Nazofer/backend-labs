import { Repository } from 'typeorm';
import { Record } from './record.entity.js';
import { AppDataSource } from '../../data-source.js';
import { HTTPError } from '../errors/http-error.class.js';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { IRecordsService } from './records.service.interface.js';
import { CreateRecordDto } from './dtos/create-record.dto.js';

@injectable()
export class RecordsService implements IRecordsService {
  private repo: Repository<Record>;
  constructor() {
    this.repo = AppDataSource.getRepository(Record);
  }

  async getUserBalance(userId: number): Promise<number> {
    const { sum } = await this.repo
      .createQueryBuilder('record')
      .select('CAST(SUM(record.amount) AS INTEGER)', 'sum')
      .where('record.userId = :userId', { userId })
      .getRawOne();

    return parseInt(sum, 10) || 0;
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
    return records;
  }

  async create(record: CreateRecordDto, userId: number): Promise<Record> {
    if (record.amount < 0) {
      const sum = await this.getUserBalance(userId);

      if (sum + record.amount < 0) {
        throw new HTTPError(400, 'Not enough balance');
      }
    }

    const newRecord = this.repo.create({ ...record, userId });
    return await this.repo.save(newRecord);
  }

  async delete(id: number, userId: number): Promise<void> {
    const record = await this.getById(id);

    if (record.userId !== userId) {
      throw new HTTPError(403, 'Forbidden');
    }

    await this.repo.remove(record);
  }
}
