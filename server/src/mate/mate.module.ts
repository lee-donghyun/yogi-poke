import { Module } from '@nestjs/common';
import { MateController } from './mate.controller';
import { MateService } from './mate.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [MateController],
  providers: [MateService, PrismaService],
})
export class MateModule {}
