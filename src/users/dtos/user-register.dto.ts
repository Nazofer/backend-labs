import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserRegisterDto {
  @IsNotEmpty({ message: 'Email must not be empty' })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsNotEmpty({ message: 'Password must not be empty' })
  @IsString({ message: 'Invalid password' })
  password: string;

  @IsNotEmpty({ message: 'Name must not be empty' })
  @IsString({ message: 'Invalid name' })
  name: string;
}
