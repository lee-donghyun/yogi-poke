import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthProvider } from '@prisma/client';
import { User } from 'src/auth/auth.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/auth.interface';
import { AuthService } from 'src/auth/auth.service';
import { MateService } from 'src/mate/mate.service';

import { DeleteUserDto } from './dto/delete-user.dto';
import { GetUserByEmailParamDto } from './dto/get-user-by-email.dto';
import { GetUserListParamDto } from './dto/get-user-list.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { signInUserDto } from './dto/sign-in.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private mateService: MateService,
  ) {}

  @Delete('/my-info')
  @UseGuards(AuthGuard)
  async deleteMyInfo(
    @User() userPayload: JwtPayload,
    @Query() query: DeleteUserDto,
  ) {
    await this.userService.getUserByEmailAndPassword({
      email: userPayload.email,
      password: query.password,
    });
    return await this.userService.deleteUser(userPayload.id);
  }

  @Get('/my-info')
  @UseGuards(AuthGuard)
  async getMyInfo(@User() userPayload: JwtPayload) {
    const user = await this.userService.getUser({ email: userPayload.email });
    const pokes = await this.mateService.getPokedCount({ fromUserId: user.id });
    const pokeds = await this.mateService.getPokedCount({ toUserId: user.id });
    return { ...user, pokeds, pokes };
  }

  @Get('/:email')
  @UseGuards(AuthGuard)
  async getUserByEamil(
    @User() userPayload: JwtPayload,
    @Param() param: GetUserByEmailParamDto,
  ) {
    const { authProvider, email, id, name, profileImageUrl } =
      await this.userService.getUser(param);
    const pokes = await this.mateService.getPokedCount({
      fromUserId: userPayload.id,
      toUserId: id,
    });
    const pokeds = await this.mateService.getPokedCount({
      fromUserId: id,
      toUserId: userPayload.id,
    });
    const totalPokes = await this.mateService.getPokeCount(id);
    return {
      authProvider,
      email,
      id,
      name,
      pokeds,
      pokes,
      profileImageUrl,
      totalPokes,
    };
  }

  @Get('/')
  @UseGuards(AuthGuard)
  async getUserList(
    @User() userPayload: JwtPayload,
    @Query() param: GetUserListParamDto,
  ) {
    return this.userService.getUserList(
      { email: param.email, ids: param.ids, name: param.name },
      { limit: param.limit ?? 20, page: param.page ?? 1 },
      param.orderBy ?? 'desc',
      userPayload.id,
    );
  }

  @Patch('/my-info')
  @UseGuards(AuthGuard)
  async patchMyInfo(
    @User() userPayload: JwtPayload,
    @Body() body: PatchUserDto,
  ) {
    const user = await this.userService.getUser({ email: userPayload.email });
    const updated = await this.userService.patchUser({
      id: user.id,
      ...body,
    });
    return updated;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  async registerUser(@Body() body: RegisterUserDto) {
    const user = await this.userService.registerUser({
      ...body,
      type: AuthProvider.EMAIL,
    });
    return this.authService.createUserToken(user);
  }

  @Post('/sign-in')
  async signIn(@Body() body: signInUserDto) {
    const user = await this.userService.getUserByEmailAndPassword(body);
    return this.authService.createUserToken(user);
  }
}
