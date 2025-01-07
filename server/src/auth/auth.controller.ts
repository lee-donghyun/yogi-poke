import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
