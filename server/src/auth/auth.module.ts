import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';

import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  exports: [AuthService, AuthGuard],
  imports: [
    HttpModule,
    JwtModule.register({ secret: process.env.USER_SECRET }),
    PrismaModule,
  ],
  providers: [AuthService, AuthGuard],
})
export class AuthModule {}
