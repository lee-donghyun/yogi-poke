import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  AuthenticationResponseJSON,
  type RegistrationResponseJSON,
} from '@simplewebauthn/server';
import { UserService } from 'src/user/user.service';

import { User } from './auth.decorator';
import { AuthGuard } from './auth.guard';
import { JwtPayload } from './auth.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('passkey/registration')
  @UseGuards(AuthGuard)
  async createPasskey(
    @User() user: JwtPayload,
    @Body() passkey: RegistrationResponseJSON,
  ) {
    return await this.authService.verifyPasskeyRegistrationResponse(
      user,
      passkey,
    );
  }

  @Get('passkey/registration')
  @UseGuards(AuthGuard)
  async getPasskey(@User() user: JwtPayload) {
    return await this.authService.generatePasskeyRegistrationOptions(user);
  }

  @Get('passkey/authentication')
  async getPasskeyAuthentication(@Query('id') id: string) {
    return await this.authService.generatePasskeyAuthenticationOptions(
      Number(id),
    );
  }

  @Post('passkey/authentication')
  async verifyPasskeyAuthentication(
    @Query('id') id: string,
    @Body() passkey: AuthenticationResponseJSON,
  ) {
    return await this.authService.verifyPasskeyAuthenticationResponse(
      Number(id),
      passkey,
    );
  }
}
