import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  create(@Body() dto: RegisterDto) {
    try {
      return this.authService.create(dto);
    } catch (error) {
      return {
        message: 'User Creation failed',
        statusCode: error.status,
      };
    }
  }
  @Post('login')
  login(@Body() dto: LoginDto) {
    try {
      return this.authService.login(dto);
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status,
      };
    }
  }
  @Post('gLogin')
  googleSignIn(@Body() body) {
    console.log(body);
    return this.authService.googlelogin(body);
  }
}
