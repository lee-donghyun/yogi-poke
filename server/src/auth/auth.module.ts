import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [forwardRef(() => UserModule), HttpModule],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
