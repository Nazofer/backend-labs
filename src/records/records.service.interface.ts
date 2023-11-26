import { Record } from './record.entity';

export interface IRecordsService {
  getById: (id: number) => Promise<Record>;
  getAll: (userId: number, categoryId: number) => Promise<Record[]>;
  create: (record: Record) => Promise<Record>;
  delete: (id: number) => Promise<void>;
}
