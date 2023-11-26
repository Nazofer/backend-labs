import { User } from './user.entity';

export interface IUsersService {
  create: (name: string) => Promise<User>;

  delete: (id: number) => Promise<void>;

  getById: (id: number) => Promise<User>;

  getAll: () => Promise<User[]>;

  update: (id: number, user: User) => Promise<User>;
}
