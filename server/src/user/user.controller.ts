import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/auth/auth.decorator';
import { JwtPayload } from 'src/auth/auth.interface';
import { MateService } from 'src/mate/mate.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private mateService: MateService,
  ) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() body: RegisterUserDto) {
    const user = await this.userService.registerUser(body);
    return this.authService.createUserToken(user);
  }

  @UseGuards(AuthGuard)
  @Get('/my-info')
  async getMyInfo(@User() userPayload: JwtPayload) {
    const user = await this.userService.getUser({ email: userPayload.email });
    const pokes = await this.mateService.getPokedCount({ fromUserId: user.id });
    const pokeds = await this.mateService.getPokedCount({ toUserId: user.id });
    return { ...user, pokes, pokeds };
  }
}
