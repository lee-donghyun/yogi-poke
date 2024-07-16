import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';

import { verify, sign } from 'jsonwebtoken';
import { JwtPayload } from './auth.interface';
import { HttpService } from '@nestjs/axios';
import { map, firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  private JWT_SECRET: string;
  constructor(private httpService: HttpService) {}
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

  getInstagramAccessToken(code: string) {
    const payload = new FormData();
    payload.append('client_id', process.env.INSTAGRAM_CLIENT_ID);
    payload.append('client_secret', process.env.INSTAGRAM_CLIENT_SECRET);
    payload.append('grant_type', 'authorization_code');
    payload.append('redirect_uri', process.env.INSTAGRAM_REDIRECT_URI);
    payload.append('code', code);

    return firstValueFrom(
      this.httpService
        .post<{
          access_token: string;
          user_id: number;
        }>('https://api.instagram.com/oauth/access_token', payload)
        .pipe(
          map((response) => response.data),
          map((response) => ({
            accessToken: response.access_token,
            userId: response.user_id,
          })),
        ),
    );
  }

  async getInstagramUser(accessToken: string) {
    const { username } = await firstValueFrom(
      this.httpService
        .get<{ id: number; username: string }>(
          'https://graph.instagram.com/v20.0/me',
          {
            params: {
              fields: 'id,username',
              access_token: accessToken,
            },
          },
        )
        .pipe(map((response) => response.data)),
    );
    return { username };
  }
}
