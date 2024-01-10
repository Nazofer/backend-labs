import { DataSource } from 'typeorm';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  ssl: process.env.DB_SSL === 'true' ? true : false,
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['./src/**/*.entity{.ts,.js}'],
  migrations: ['./db/migrations/*{.ts,.js}'],
  synchronize: true,
});
