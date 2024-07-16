import { Module, forwardRef } from '@nestjs/common';
import { MateController } from './mate.controller';
import { MateService } from './mate.service';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { PushModule } from 'src/push/push.module';
import { UtilModule } from 'src/util/util.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RelationModule } from 'src/relation/relation.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    RelationModule,
    AuthModule,
    PushModule,
    UtilModule,
    PrismaModule,
  ],
  providers: [MateService],
  controllers: [MateController],
  exports: [MateService],
})
export class MateModule {}
