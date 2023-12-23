import { IsEmail, IsOptional, IsString } from 'class-validator';
import { UserRegisterDto } from './user-register.dto.js';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
