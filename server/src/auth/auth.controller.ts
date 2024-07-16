import { HttpService } from '@nestjs/axios';
import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { firstValueFrom, map } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly httpService: HttpService) {}
  @Get('/instagram')
  async instagramLoginRedirct(
    @Query('code') rawCode: string,
    @Res() res: Response,
  ) {
    const code = rawCode.split('#')[0];
    if (!code) {
      res.redirect(HttpStatus.TEMPORARY_REDIRECT, process.env.CLIENT_URL);
      return;
    }

    const payload = new FormData();
    payload.append('client_id', process.env.INSTAGRAM_CLIENT_ID);
    payload.append('client_secret', process.env.INSTAGRAM_CLIENT_SECRET);
    payload.append('grant_type', 'authorization_code');
    payload.append('redirect_uri', process.env.INSTAGRAM_REDIRECT_URI);
    payload.append('code', code);

    const { accessToken, userId } = await firstValueFrom(
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

    const { id, username } = await firstValueFrom(
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

    return 'Instagram login';
  }

  @Get('/instagram/cancel')
  async instagramLoginCancel() {
    return 'Instagram login canceled';
  }
}
