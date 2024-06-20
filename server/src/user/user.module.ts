import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';
import { AuthService } from 'src/auth/auth.service';

@Module({
  providers: [UserService, PrismaService, AuthService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
