import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';

import { verify, sign } from 'jsonwebtoken';
import { JwtPayload } from './auth.interface';

@Injectable()
export class AuthService implements OnModuleInit {
  private JWT_SECRET: string;
  onModuleInit() {
    this.JWT_SECRET = process.env.JWT_SECRET;
  }
  validateRequest(request: any): boolean {
    request.user = null;
    const token = request.headers.authorization;

    if (!token) return false;
    try {
      const user = this.verifyUserToken(token);
      request.user = user;
      return true;
    } catch {
      request.user = null;
      return false;
    }
  }
  verifyUserToken(token: string) {
    try {
      return verify(token, this.JWT_SECRET) as JwtPayload;
    } catch {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
  async createUserToken(user: JwtPayload) {
    return sign(user, this.JWT_SECRET);
  }
}
