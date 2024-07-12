import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RequestRelationDto } from './dto/request-relation.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/auth/auth.decorator';
import { JwtPayload } from 'src/auth/auth.interface';
import { UserService } from 'src/user/user.service';
import { MateService } from './mate.service';
import { PushService } from 'src/push/push.service';
import { GetPokeListDto } from './dto/get-poke-list.dto';
import {
  GetUserRelatedPokeListDto,
  GetUserRelatedPokeListParamDto,
} from './dto/get-user-related-poke-list.dto';

@Controller('mate')
@UseGuards(AuthGuard)
export class MateController {
  constructor(
    private userService: UserService,
    private mateService: MateService,
    private pushService: PushService,
  ) {}

  @Post('poke')
  @HttpCode(HttpStatus.CREATED)
  async pokeMate(
    @User() user: JwtPayload,
    @Body() requestRelationDto: RequestRelationDto,
  ) {
    const { id: fromUserId, email } = user;
    const { id: toUserId, pushSubscription } = await this.userService.getUser({
      email: requestRelationDto.email,
    });

    await this.mateService.pokeMate(
      fromUserId,
      toUserId,
      requestRelationDto.payload,
    );
    if (pushSubscription !== null) {
      this.pushService.sendPushNotification(toUserId, {
        title: `@${email}`,
        body:
          requestRelationDto.payload.type === 'normal'
            ? `콕!`
            : requestRelationDto.payload.message,
      });
    }
  }

  @Get('poke')
  async getRelatedPokesList(
    @User() user: JwtPayload,
    @Query() query: GetPokeListDto,
  ) {
    const relatedPokes = await this.mateService.getRelatedPokesList(user.id, {
      limit: query.limit ?? 20,
      page: query.page ?? 1,
    });
    return relatedPokes;
  }
}
