import { Module } from '@nestjs/common';
import { MateModule } from './mate/mate.module';

@Module({
  imports: [MateModule],
})
export class AppModule {}
