import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { User } from 'src/auth/auth.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/auth.interface';
import { PushService } from 'src/push/push.service';
import { UserService } from 'src/user/user.service';

import { PatchRelationDto } from './dto/patch-relation.dto';
import { RelationService } from './relation.service';

@Controller('relation')
export class RelationController {
  constructor(
    private userService: UserService,
    private relationService: RelationService,
    private pushService: PushService,
  ) {}
  @Get('/blocked')
  @UseGuards(AuthGuard)
  async getBlockedUsers(@User() userPayload: JwtPayload) {
    return await this.relationService.getBlockedUsers(userPayload.id);
  }

  @Patch('/:email')
  @UseGuards(AuthGuard)
  async patchRelation(
    @User() userPayload: JwtPayload,
    @Body() body: PatchRelationDto,
    @Param('email') email: string,
  ) {
    const { id: toUserId } = await this.userService.getUser({ email });
    if (body.isFollowing) {
      void this.pushService.sendPushNotification(toUserId, {
        data: {
          options: {
            body: `회원님을 팔로우하기 시작했습니다.`,
          },
          title: `@${userPayload.email}`,
        },
        type: 'FOLLOW',
      });
    }
    return await this.relationService.updateUserRelation(body, {
      fromUserId: userPayload.id,
      toUserId,
    });
  }
}
