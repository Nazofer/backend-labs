import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source.js';
import { User } from './user.entity.js';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { IUsersService } from './users.service.interface';
import { HTTPError } from '../errors/http-error.class.js';

@injectable()
export class UsersService implements IUsersService {
  private repo: Repository<User>;
  constructor() {
    this.repo = AppDataSource.getRepository(User);
  }

  create(name: string): Promise<User> {
    return this.repo.save({ name });
  }

  async delete(id: number): Promise<void> {
    const user = await this.get(id);
    if (!user) throw new HTTPError(404, `User with id ${id} not found`);
    await this.repo.remove(user);
  }

  async get(id: number): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new HTTPError(404, `User with id ${id} not found`);
    }
    return user;
  }

  async getAll(): Promise<User[]> {
    return this.repo.find();
  }
}
