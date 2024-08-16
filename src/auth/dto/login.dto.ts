import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsStrongPassword,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @IsLowercase()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({ minLength: 6 })
  password: string;
}
