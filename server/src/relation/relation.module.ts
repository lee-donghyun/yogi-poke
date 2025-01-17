import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';

import { RelationController } from './relation.controller';
import { RelationService } from './relation.service';

@Module({
  controllers: [RelationController],
  exports: [RelationService],
  imports: [AuthModule, UserModule, PrismaModule],
  providers: [RelationService],
})
export class RelationModule {}
