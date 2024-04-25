import { Module } from '@nestjs/common';
import { MateController } from './mate.controller';
import { MateService } from './mate.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { PushModule } from 'src/push/push.module';
import { UtilModule } from 'src/util/util.module';

@Module({
  imports: [UserModule, AuthModule, PushModule, UtilModule],
  controllers: [MateController],
  providers: [MateService, PrismaService],
})
export class MateModule {}
