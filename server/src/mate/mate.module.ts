import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PushModule } from 'src/push/push.module';
import { RelationModule } from 'src/relation/relation.module';
import { UserModule } from 'src/user/user.module';
import { UtilModule } from 'src/util/util.module';

import { MateController } from './mate.controller';
import { MateService } from './mate.service';

@Module({
  controllers: [MateController],
  exports: [MateService],
  imports: [
    forwardRef(() => UserModule),
    RelationModule,
    AuthModule,
    PushModule,
    UtilModule,
    PrismaModule,
  ],
  providers: [MateService],
})
export class MateModule {}
