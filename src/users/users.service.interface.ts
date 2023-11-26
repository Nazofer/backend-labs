import { User } from './user.entity';

export interface IUsersService {
  create: (name: string) => Promise<User>;

  delete: (id: number) => Promise<void>;

  get: (id: number) => Promise<User>;

  getAll: () => Promise<User[]>;
}
