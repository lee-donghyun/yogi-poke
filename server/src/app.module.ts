import { Module } from '@nestjs/common';
import { MateModule } from './mate/mate.module';
import { UserModule } from './user/user.module';
import { UtilModule } from './util/util.module';

@Module({
  imports: [UserModule, MateModule, UtilModule],
})
export class AppModule {}
