import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
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

    const { accessToken, userId } =
      await this.authService.getInstagramAccessToken(code);

    const { id, username } = await this.authService.getInstagramUser(
      accessToken,
    );

    return 'Instagram login';
  }

  @Get('/instagram/cancel')
  async instagramLoginCancel() {
    return 'Instagram login canceled';
  }
}
