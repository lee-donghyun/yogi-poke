import {
  AuthenticationResponseJSON,
  type RegistrationResponseJSON,
} from '@simplewebauthn/server';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { User } from './auth.decorator';
import { JwtPayload } from './auth.interface';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('passkey/registration')
  async getPasskey(@User() user: JwtPayload) {
    return await this.authService.generatePasskeyRegistrationOptions(user);
  }

  @UseGuards(AuthGuard)
  @Post('passkey/registration')
  async createPasskey(
    @User() user: JwtPayload,
    @Body() passkey: RegistrationResponseJSON,
  ) {
    return await this.authService.verifyPasskeyRegistrationResponse(
      user,
      passkey,
    );
  }

  @Get('passkey/authentication')
  async getPasskeyAuthentication(@Param('id') id: string) {
    return await this.authService.generatePasskeyAuthenticationOptions(
      Number(id),
    );
  }

  @Post('passkey/authentication')
  async verifyPasskeyAuthentication(
    @Param('id') id: string,
    @Body() passkey: AuthenticationResponseJSON,
  ) {
    return await this.authService.verifyPasskeyAuthenticationResponse(
      Number(id),
      passkey,
    );
  }
}
