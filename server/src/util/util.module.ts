import { Module } from '@nestjs/common';
import { DateUtilService } from './date-util/date-util.service';
import { UtilController } from './util.controller';
import { FileUtilService } from './file-util/file-util.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [DateUtilService, FileUtilService],
  exports: [DateUtilService],
  controllers: [UtilController],
})
export class UtilModule {}
