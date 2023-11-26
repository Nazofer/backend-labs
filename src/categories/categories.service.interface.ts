import { Category } from './category.entity';

export interface ICategoriesService {
  getAll: () => Promise<Category[]>;

  getById: (id: number) => Promise<Category>;

  create: (name: string) => Promise<Category>;

  update: (id: number, category: Category) => Promise<Category>;

  delete: (id: number) => Promise<void>;
}
