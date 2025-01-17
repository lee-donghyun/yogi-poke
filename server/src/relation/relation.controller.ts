import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { User } from 'src/auth/auth.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/auth.interface';
import { UserService } from 'src/user/user.service';

import { PatchRelationDto } from './dto/patch-relation.dto';
import { RelationService } from './relation.service';

@Controller('relation')
export class RelationController {
  constructor(
    private userService: UserService,
    private relationService: RelationService,
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
    return await this.relationService.updateUserAcception(body.isAccepted, {
      fromUserId: userPayload.id,
      toUserId,
    });
  }
}
