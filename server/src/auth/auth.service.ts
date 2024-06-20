import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { verify, sign } from 'jsonwebtoken';
import { JwtPayload } from './auth.interface';

@Injectable()
export class AuthService {
  static JWT_SECRET = process.env.JWT_SECRET || '';
  validateRequest(request: any): boolean {
    request.user = null;
    const token = request.headers.authorization;
    if (!token) return;
    try {
      const user = this.verifyUserToken(token);
      request.user = user;
    } catch {
      request.user = null;
    }
  }
  verifyUserToken(token: string) {
    try {
      return verify(token, AuthService.JWT_SECRET) as JwtPayload;
    } catch {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
  async createUserToken(user: JwtPayload) {
    return sign(user, AuthService.JWT_SECRET);
  }
}
