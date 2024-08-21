import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SECRET } from 'src/config/env.config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  /**This method will verify the jwt token and set the current user
   *
   * @param { ExecutionContext} context
   * @returns {boolean}
   */
  canActivate(context: ExecutionContext): boolean {
    console.log('hello');
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: SECRET,
      });
      request.user = { _id: payload._id };
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }
}
