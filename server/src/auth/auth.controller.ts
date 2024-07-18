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
    const redirectWithToken = (token: string) =>
      res.redirect(
        HttpStatus.TEMPORARY_REDIRECT,
        `${process.env.CLIENT_URL}?token=${token}`,
      );

    const redirectWithError = (error: string) => {
      console.error(error);
      res.redirect(
        HttpStatus.TEMPORARY_REDIRECT,
        `${process.env.CLIENT_URL}?error=${error}`,
      );
      // return empty observable to satisfy observable type
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
              | Promise<string>,
        ),
      ),
      (user): user is string => typeof user === 'string',
    );

    return merge(
      oldUser.pipe(mergeMap((user) => this.authService.createUserToken(user))),
      newUser.pipe(
        mergeMap((accessToken) =>
          this.authService.getInstagramUser(accessToken),
        ),
        mergeMap(({ id, username }) =>
          this.userService.registerUser({
            type: AuthProvider.INSTAGRAM,
            email: username,
            name: username,
            authProviderId: String(id),
          }),
        ),
        mergeMap((user) => this.authService.createUserToken(user)),
      ),
    ).pipe(map(redirectWithToken), catchError(redirectWithError));
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
