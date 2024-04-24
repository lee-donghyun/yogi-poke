import { Module } from '@nestjs/common';
import { MateController } from './mate.controller';
import { MateService } from './mate.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { PushModule } from 'src/push/push.module';
import { DateUtilService } from 'src/date-util/date-util.service';

@Module({
  imports: [UserModule, AuthModule, PushModule],
  controllers: [MateController],
  providers: [MateService, PrismaService, DateUtilService],
})
export class MateModule {}
