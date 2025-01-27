import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { MateModule } from 'src/mate/mate.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RelationModule } from 'src/relation/relation.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  exports: [UserService],
  imports: [
    PrismaModule,
    AuthModule,
    forwardRef(() => MateModule),
    forwardRef(() => RelationModule),
  ],
  providers: [UserService],
})
export class UserModule {}
