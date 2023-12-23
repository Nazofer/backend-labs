import { Record } from './record.entity';

export interface IRecordsService {
  getById: (id: number) => Promise<Record>;
  getAll: (userId: number, categoryId: number) => Promise<Record[]>;
  create: (record: Record, userId: number) => Promise<Record>;
  delete: (id: number, userId: number) => Promise<void>;
  getUserBalance: (userId: number) => Promise<number>;
}
