import { Module } from '@nestjs/common';
import { MateController } from './mate.controller';
import { MateService } from './mate.service';

@Module({
  controllers: [MateController],
  providers: [MateService],
})
export class MateModule {}
