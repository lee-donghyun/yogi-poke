import { Module } from '@nestjs/common';
import { MateModule } from './mate/mate.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev', '.env.prod'],
    }),
    MateModule,
  ],
})
export class AppModule {}
