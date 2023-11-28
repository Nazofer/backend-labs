import { DataSource } from 'typeorm';
import { User } from './users/user.entity.js';
import { Category } from './categories/category.entity.js';
import { Record } from './records/record.entity.js';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  ssl: true,
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  // logging: true,
  entities: [User, Category, Record],
  subscribers: [],
  migrations: [],
});
