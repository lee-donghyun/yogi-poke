import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { PushService } from './push.service';

@Module({
  exports: [PushService],
  imports: [PrismaModule],
  providers: [PushService],
})
export class PushModule {}
