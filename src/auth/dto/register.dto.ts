import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @IsLowercase()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({ minLength: 6 })
  password: string;
}
