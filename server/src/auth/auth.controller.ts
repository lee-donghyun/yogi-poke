import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { AuthProvider } from '@prisma/client';
import {
  catchError,
  map,
  merge,
  mergeMap,
  of,
  partition,
  throwIfEmpty,
} from 'rxjs';

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
    const redirectWithToken = (token: string) => {
      res.redirect(
        HttpStatus.TEMPORARY_REDIRECT,
        `${process.env.CLIENT_URL}?token=${token}`,
      );
      return of();
    };

    const redirectWithAuthorizedToken = (token: string) => {
      res.redirect(
        HttpStatus.TEMPORARY_REDIRECT,
        `${process.env.CLIENT_URL}/third-party-register?code=${token}`,
      );
      return of();
    };

    const redirectWithError = (error: string) => {
      console.error(error);
      res.redirect(
        HttpStatus.TEMPORARY_REDIRECT,
        `${process.env.CLIENT_URL}?error=${error}`,
      );
      return of();
    };

    const [newUser, oldUser] = partition(
      of(rawCode).pipe(
        map((code) => code.split('#')[0]),
        throwIfEmpty(() => new Error('Invalid code')),
        mergeMap((code) => this.authService.getInstagramAccessToken(code)),
        mergeMap(
          ({ accessToken, userId }) =>
            this.userService
              .getUser({
                authProvider: AuthProvider.INSTAGRAM,
                authProviderId: String(userId),
              })
              .catch(() => ({ accessToken, userId })) as
              | ReturnType<typeof this.userService.getUser>
              | Promise<{ accessToken: string; userId: number }>,
        ),
      ),
      (user): user is { accessToken: string; userId: number } =>
        user.hasOwnProperty('accessToken'),
    );

    return merge(
      oldUser.pipe(
        map((user) => this.authService.createUserToken(user)),
        map(redirectWithToken),
      ),
      newUser.pipe(
        map(({ userId }) =>
          this.authService.createAuthorizedToken({
            authProvider: AuthProvider.INSTAGRAM,
            authProviderId: String(userId),
          }),
        ),
        map(redirectWithAuthorizedToken),
      ),
    ).pipe(catchError(redirectWithError));
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
