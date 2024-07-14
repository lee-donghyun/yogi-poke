import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { RelationController } from './relation.controller';
import { RelationService } from './relation.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule],
  providers: [RelationService],
  controllers: [RelationController],
})
export class RelationModule {}
