import { UserRegisterDto } from './dtos/user-register.dto';
import { User } from './user.entity';

export interface IUsersService {
  create: (data: UserRegisterDto) => Promise<User>;

  delete: (id: number) => Promise<void>;

  getById: (id: number) => Promise<User>;

  getByEmail: (email: string) => Promise<User | null>;

  getAll: () => Promise<User[]>;

  update: (id: number, user: User) => Promise<User>;

  getUserBalance: (userId: number) => Promise<number>;
}
