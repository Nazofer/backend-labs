import { Repository } from 'typeorm';
import { Category } from './category.entity.js';
import { AppDataSource } from '../../data-source.js';
import { HTTPError } from '../errors/http-error.class.js';
import { ICategoriesService } from './categories.service.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class CategoriesService implements ICategoriesService {
  private repo: Repository<Category>;
  constructor() {
    this.repo = AppDataSource.getRepository(Category);
  }

  async getById(id: number): Promise<Category> {
    const category = await this.repo.findOne({ where: { id } });
    if (!category) {
      throw new HTTPError(404, `Category with id ${id} not found`);
    }
    return category;
  }

  async getAll(): Promise<Category[]> {
    return await this.repo.find();
  }

  async create(name: string): Promise<Category> {
    const existingCategory = await this.repo.findOne({ where: { name } });
    if (existingCategory) {
      throw new HTTPError(400, `Category with name ${name} already exists`);
    }
    const category = this.repo.create({ name });
    return await this.repo.save(category);
  }

  async update(id: number, category: Category): Promise<Category> {
    const oldCategory = await this.getById(id);
    return this.repo.save({ ...oldCategory, ...category });
  }

  async delete(id: number): Promise<void> {
    const oldCategory = await this.getById(id);
    await this.repo.remove(oldCategory);
  }
}
