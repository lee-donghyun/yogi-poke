import { Module } from '@nestjs/common';
import { MateModule } from './mate/mate.module';
import { UtilService } from './util/date.service';
import { PushModule } from './push/push.module';
import { PushService } from './push/push.service';
import { DateUtilModule } from './date-util/date-util.module';
import { UtilModule } from './util/util.module';
import { UtilDateService } from './util.date/util.date.service';
import { UtilService } from './util/date.service';

@Module({
  imports: [MateModule, UtilModule, DateUtilModule, PushModule],
  providers: [UtilService, UtilDateService, PushService],
})
export class AppModule {}
