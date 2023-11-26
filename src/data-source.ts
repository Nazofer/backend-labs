import { DataSource } from 'typeorm';
import { User } from './users/user.entity.js';
import { Category } from './categories/category.entity.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'backend-labs',
  synchronize: true,
  logging: true,
  entities: [User, Category],
  subscribers: [],
  migrations: [],
});
