import { type RegistrationResponseJSON } from '@simplewebauthn/server';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
  @Get('passkey')
  async getPasskey(@User() user: JwtPayload) {
    return await this.authService.generatePasskeyRegistrationOptions(user);
  }

  @UseGuards(AuthGuard)
  @Post('passkey')
  async createPasskey(
    @User() user: JwtPayload,
    @Body() passkey: RegistrationResponseJSON,
  ) {
    return await this.authService.verifyPasskeyRegistrationResponse(
      user,
      passkey,
    );
  }
}
