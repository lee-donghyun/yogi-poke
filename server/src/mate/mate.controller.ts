import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RequestRelationDto } from './dto/request-relation.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/auth/auth.decorator';
import { JwtPayload } from 'src/auth/auth.interface';
import { UserService } from 'src/user/user.service';
import { MateService } from './mate.service';

@Controller('mate')
@UseGuards(AuthGuard)
export class MateController {
  constructor(
    private userService: UserService,
    private mateService: MateService,
  ) {}
  @Post('relation')
  async createRelation(
    @User() user: JwtPayload,
    @Body() requestRelationDto: RequestRelationDto,
  ) {
    const { id: fromUserId } = user;
    const { id: toUserId } = await this.userService.getUser({
      email: requestRelationDto.email,
    });

    const made = await this.mateService.createRelation(fromUserId, toUserId);
    return made;
  }
}
