import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { AuthProvider } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @Get('/instagram')
  async instagramLoginRedirct(
    @Query('code') rawCode: string,
    @Res() res: Response,
  ) {
    const code = rawCode.split('#')[0];
    if (!code) {
      res.redirect(
        HttpStatus.TEMPORARY_REDIRECT,
        `${process.env.CLIENT_URL}?error=invalid_code`,
      );
      return;
    }

    const { accessToken, userId } =
      await this.authService.getInstagramAccessToken(code);

    const user = await this.userService
      .getUser({
        authProvider: AuthProvider.INSTAGRAM,
        authId: String(userId),
      })
      .catch(() => null);
    if (user) {
      const token = await this.authService.createUserToken(user);
      res.redirect(
        HttpStatus.TEMPORARY_REDIRECT,
        `${process.env.CLIENT_URL}?token=${token}`,
      );
      return;
    }

    const { full_name, username } = await this.authService.getInstagramUser(
      accessToken,
    );

    const registeredUser = await this.userService.registerUser({
      type: AuthProvider.INSTAGRAM,
      email: username,
      name: full_name,
    });
    const token = await this.authService.createUserToken(registeredUser);
    res.redirect(
      HttpStatus.TEMPORARY_REDIRECT,
      `${process.env.CLIENT_URL}?token=${token}`,
    );
    return;
  }

  @Get('/instagram/cancel')
  async instagramLoginCancel(@Res() res: Response) {
    res.redirect(
      HttpStatus.TEMPORARY_REDIRECT,
      `${process.env.CLIENT_URL}?error=canceled`,
    );
    return;
  }
}
