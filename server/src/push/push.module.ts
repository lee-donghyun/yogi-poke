import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PushService } from './push.service';

@Module({
  providers: [PrismaService, PushService],
  exports: [PushService],
})
export class PushModule {}
