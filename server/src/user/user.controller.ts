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
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/auth/auth.decorator';
import { JwtPayload } from 'src/auth/auth.interface';
import { MateService } from 'src/mate/mate.service';
import { signInUserDto } from './dto/sign-in.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { GetUserListParamDto } from './dto/get-user-list.dto';
import { GetUserByEmailParamDto } from './dto/get-user-by-email.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { AuthProvider } from '@prisma/client';
import { RegisterAuthorizedUserDto } from './dto/register-authorized-user.dto';

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
    const user = await this.userService.registerUser({
      ...body,
      type: AuthProvider.EMAIL,
    });
    return this.authService.createUserToken(user);
  }

  @Post('/register/authorized')
  @HttpCode(HttpStatus.CREATED)
  async registerInstagramUser(@Body() body: RegisterAuthorizedUserDto) {
    const { authProvider, authProviderId } =
      this.authService.verifyAuthorizedToken(body.token);
    const user = await this.userService.registerUser({
      type: authProvider,
      authProviderId,
      email: body.email,
      name: body.name,
    });
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

  @Post('/sign-in')
  async signIn(@Body() body: signInUserDto) {
    const user = await this.userService.getUserByEmailAndPassword(body);
    return this.authService.createUserToken(user);
  }

  @UseGuards(AuthGuard)
  @Patch('/my-info')
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

  @UseGuards(AuthGuard)
  @Get('/')
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

  @UseGuards(AuthGuard)
  @Get('/:email')
  async getUserByEamil(
    @User() userPayload: JwtPayload,
    @Param() param: GetUserByEmailParamDto,
  ) {
    const { email, id, name, profileImageUrl } = await this.userService.getUser(
      param,
    );
    const pokes = await this.mateService.getPokedCount({
      fromUserId: userPayload.id,
      toUserId: id,
    });
    const pokeds = await this.mateService.getPokedCount({
      fromUserId: id,
      toUserId: userPayload.id,
    });
    return { email, id, name, profileImageUrl, pokeds, pokes };
  }

  @UseGuards(AuthGuard)
  @Delete('/my-info')
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
}
