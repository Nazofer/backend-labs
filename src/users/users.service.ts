import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source.js';
import { User } from './user.entity.js';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IUsersService } from './users.service.interface';
import { HTTPError } from '../errors/http-error.class.js';
import { IRecordsService } from '../records/records.service.interface.js';
import { TYPES } from '../types.js';

@injectable()
export class UsersService implements IUsersService {
  private repo: Repository<User>;
  constructor(
    @inject(TYPES.IRecordsService) private recordsService: IRecordsService
  ) {
    this.repo = AppDataSource.getRepository(User);
  }

  async getUserBalance(userId: number): Promise<number> {
    return await this.recordsService.getUserBalance(userId);
  }

  async getById(id: number): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new HTTPError(404, `User with id ${id} not found`);
    }
    return user;
  }

  async getAll(): Promise<User[]> {
    return this.repo.find();
  }

  async create(name: string): Promise<User> {
    const existingUser = await this.repo.findOne({ where: { name } });
    if (existingUser) {
      throw new HTTPError(400, `User with name ${name} already exists`);
    }
    const user = this.repo.create({ name });
    return await this.repo.save(user);
  }

  async update(id: number, user: User): Promise<User> {
    const oldUser = await this.getById(id);
    return this.repo.save({ ...oldUser, ...user });
  }

  async delete(id: number): Promise<void> {
    const oldUser = await this.getById(id);
    await this.repo.remove(oldUser);
  }
}
