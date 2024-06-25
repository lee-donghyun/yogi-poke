import { Module } from '@nestjs/common';
import { DateUtilService } from './date-util/date-util.service';
import { UtilController } from './util.controller';
import { FileUtilService } from './file-util/file-util.service';
import { AuthModule } from 'src/auth/auth.module';
import { DocumentUtilService } from './document-util/document-util.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [DateUtilService, FileUtilService, DocumentUtilService],
  exports: [DateUtilService],
  controllers: [UtilController],
})
export class UtilModule {}
