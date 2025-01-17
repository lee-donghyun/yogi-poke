import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { DateUtilService } from './date-util/date-util.service';
import { DocumentUtilService } from './document-util/document-util.service';
import { FileUtilService } from './file-util/file-util.service';
import { UtilController } from './util.controller';

@Module({
  controllers: [UtilController],
  exports: [DateUtilService],
  imports: [AuthModule, PrismaModule],
  providers: [DateUtilService, FileUtilService, DocumentUtilService],
})
export class UtilModule {}
