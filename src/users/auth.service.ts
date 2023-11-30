import { inject, injectable } from 'inversify';
import { IAuthService } from './auth.service.interface';
import 'reflect-metadata';
import { IUsersService } from './users.service.interface';
import { TYPES } from '../types.js';
import bcript from 'bcryptjs';
import { HTTPError } from '../errors/http-error.class.js';
import jsonwebtoken from 'jsonwebtoken';

@injectable()
export class AuthService implements IAuthService {
  private salt: number = Number(process.env.SALT);
  private secret: string = process.env.JWT_SECRET || '';

  constructor(
    @inject(TYPES.IUsersService) private usersService: IUsersService
  ) {}

  async login(email: string, password: string): Promise<string> {
    const existedUser = await this.usersService.getByEmail(email);
    if (!existedUser) {
      throw new HTTPError(404, `User with email ${email} not found`);
    }

    const isPasswordCorrect = await bcript.compare(
      password,
      existedUser.password
    );
    if (!isPasswordCorrect) {
      throw new HTTPError(401, 'Password is incorrect');
    }
    const token = await this.signJWT(email);
    return token;
  }

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<string> {
    const user = await this.usersService.getByEmail(email);
    if (user) {
      throw new HTTPError(422, 'User already exists');
    }

    const hashedPassword = await bcript.hash(password, this.salt);

    await this.usersService.create({ name, email, password: hashedPassword });

    const token = await this.signJWT(email);
    return token;
  }

  private signJWT(email: string): Promise<string> {
    return new Promise((resolve, reject) => {
      jsonwebtoken.sign(
        { email, iat: Math.floor(Date.now() / 1000) },
        this.secret,
        { algorithm: 'HS256', expiresIn: '7d' },
        (err, token) => {
          if (err) {
            reject(err);
          }
          resolve(token as string);
        }
      );
    });
  }
}
