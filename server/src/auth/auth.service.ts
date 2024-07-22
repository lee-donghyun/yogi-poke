import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';

import { verify, sign } from 'jsonwebtoken';
import { AuthorizedTokenPayload, JwtPayload } from './auth.interface';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  private USER_SECRET: string;
  private AUTHORIZED_SECRET: string;
  constructor(private readonly httpService: HttpService) {}
  onModuleInit() {
    this.USER_SECRET = process.env.USER_SECRET;
    this.AUTHORIZED_SECRET = process.env.AUTHORIZED_SECRET;
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
      return verify(token, this.USER_SECRET) as JwtPayload;
    } catch {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
  createUserToken(user: JwtPayload) {
    return sign(user, this.USER_SECRET) as string;
  }

  verifyAuthorizedToken(token: string) {
    try {
      return verify(token, this.AUTHORIZED_SECRET) as AuthorizedTokenPayload;
    } catch {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
  createAuthorizedToken(payload: AuthorizedTokenPayload) {
    return sign(payload, this.AUTHORIZED_SECRET) as string;
  }

  getInstagramAccessToken(code: string) {
    const payload = new FormData();
    payload.append('client_id', process.env.INSTAGRAM_CLIENT_ID);
    payload.append('client_secret', process.env.INSTAGRAM_CLIENT_SECRET);
    payload.append('grant_type', 'authorization_code');
    payload.append('redirect_uri', process.env.INSTAGRAM_REDIRECT_URI);
    payload.append('code', code);

    return this.httpService
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
      );
  }

  /**
   *
   * @deprecated 비즈니스인증을 한 앱에서만 사용가능합니다. 요기콕콕!에서는 이를 우회하여 사용합니다.
   */
  getInstagramUser(accessToken: string) {
    return this.httpService
      .get<{ id: number; username: string }>(
        'https://graph.instagram.com/v20.0/me',
        {
          params: {
            fields: 'id,username',
            access_token: accessToken,
          },
        },
      )
      .pipe(map((response) => response.data));
  }
}
