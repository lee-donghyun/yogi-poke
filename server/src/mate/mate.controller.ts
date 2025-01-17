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
import { map, of } from 'rxjs';
import { User } from 'src/auth/auth.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/auth.interface';
import { PushService } from 'src/push/push.service';
import { UserService } from 'src/user/user.service';

import { GetPokeListDto } from './dto/get-poke-list.dto';
import {
  GetUserRelatedPokeListDto,
  GetUserRelatedPokeListParamDto,
} from './dto/get-user-related-poke-list.dto';
import { RequestRelationDto } from './dto/request-relation.dto';
import { MateService } from './mate.service';

@Controller('mate')
@UseGuards(AuthGuard)
export class MateController {
  constructor(
    private userService: UserService,
    private mateService: MateService,
    private pushService: PushService,
  ) {}

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

  @Get('poke/:email')
  async getUserRelatedPokeList(
    @User() user: JwtPayload,
    @Query() query: GetUserRelatedPokeListDto,
    @Param() param: GetUserRelatedPokeListParamDto,
  ) {
    const { id: userId1 } = user;
    const { id: userId2 } = await this.userService.getUser({
      email: param.email,
    });
    const relatedPokes = await this.mateService.getUserRelatedPokeList(
      userId1,
      userId2,
      {
        limit: query.limit ?? 20,
        page: query.page ?? 1,
      },
    );
    return relatedPokes;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('poke')
  async pokeMate(
    @User() user: JwtPayload,
    @Body() requestRelationDto: RequestRelationDto,
  ) {
    const { email, id: fromUserId } = user;
    const { id: toUserId, pushSubscription } = await this.userService.getUser({
      email: requestRelationDto.email,
    });

    await this.mateService.pokeMate(
      fromUserId,
      toUserId,
      requestRelationDto.payload,
    );

    if (pushSubscription !== null) {
      of(requestRelationDto)
        .pipe(
          map((requestRelationDto) => {
            switch (requestRelationDto.payload.type) {
              case 'drawing':
                return '그림';
              case 'emoji':
                return requestRelationDto.payload.message;
              case 'geolocation':
                return '위치';
              case 'normal':
                return '콕!';
            }
          }),
        )
        .subscribe((body) => {
          this.pushService.sendPushNotification(toUserId, {
            data: {
              options: { body },
              title: `@${email}`,
            },
            type: 'POKE',
          });
        });
    }
  }
}
