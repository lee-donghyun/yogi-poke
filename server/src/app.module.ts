import { Module } from '@nestjs/common';
import { MateModule } from './mate/mate.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { UtilModule } from './util/util.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev', '.env.prod'],
    }),
    UserModule,
    MateModule,
    UtilModule,
  ],
})
export class AppModule {}
