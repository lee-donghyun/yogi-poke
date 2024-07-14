import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { User } from 'src/auth/auth.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/auth.interface';
import { PatchRelationDto } from './dto/patch-relation.dto';
import { RelationService } from './relation.service';
import { UserService } from 'src/user/user.service';

@Controller('relation')
export class RelationController {
  constructor(
    private userService: UserService,
    private relationService: RelationService,
  ) {}
  @UseGuards(AuthGuard)
  @Patch('/:email')
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
