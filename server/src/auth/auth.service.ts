import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { JwtPayload } from './auth.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
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
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
  createUserToken(user: JwtPayload) {
    return this.jwtService.sign(user) as string;
  }
}
